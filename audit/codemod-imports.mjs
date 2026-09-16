import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const REPO = path.resolve(import.meta.dirname, "../..");
const UI = path.join(REPO, "app/ui");

function exportedNames(file) {
  const src = fs.readFileSync(file, "utf8");
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);
  const names = new Set();
  const visit = (node) => {
    if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
      if (node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && node.name) names.add(node.name.text);
    } else if (ts.isVariableStatement(node)) {
      if (node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
        for (const d of node.declarationList.declarations) {
          if (d.name && ts.isIdentifier(d.name)) names.add(d.name.text);
        }
      }
    } else if (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node) || ts.isEnumDeclaration(node)) {
      if (node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) names.add(node.name.text);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return names;
}

const nameToFile = new Map();
for (const dir of ["utils", "components"]) {
  const abs = path.join(UI, dir);
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    let files = [];
    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && entry.name !== "index.ts") files = [entry.name];
    else if (entry.isDirectory()) {
      const idx = "index.tsx";
      if (fs.existsSync(path.join(abs, entry.name, idx))) files = [idx];
    }
    for (const f of files) {
      const base = f.replace(/\.tsx?$/, "").replace(/\/index$/, "");
      for (const n of exportedNames(path.join(abs, f))) {
        if (!nameToFile.has(n)) nameToFile.set(n, { dir, base });
      }
    }
  }
}

function rewriteFile(file) {
  const source = fs.readFileSync(file, "utf8");
  const kind = file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, kind);
  const edits = [];
  let unresolved = 0;
  const visit = (node) => {
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier.text === ".." &&
      node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings)
    ) {
      const groups = new Map();
      for (const elt of node.importClause.namedBindings.elements) {
        const name = elt.name.text;
        const loc = nameToFile.get(name);
        if (!loc) {
          unresolved++;
          continue;
        }
        const spec = loc.dir === "utils" ? `../utils/${loc.base}` : `./${loc.base}`;
        if (!groups.has(spec)) groups.set(spec, []);
        groups.get(spec).push({ name, isType: elt.isTypeOnly });
      }
      if (unresolved && groups.size === 0) return;
      const stmts = [...groups.entries()]
        .map(([spec, names]) => `import { ${names.map((n) => (n.isType ? "type " : "") + n.name).join(", ")} } from "${spec}";`)
        .join("\n");
      edits.push({ start: node.getStart(sf), end: node.getEnd(), text: stmts });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!edits.length) return false;
  let out = source;
  for (const e of edits.sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  fs.writeFileSync(file, out);
  return true;
}

let changed = 0;
const files = [];
for (const dir of ["components", "utils"]) {
  const abs = path.join(UI, dir);
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && entry.name !== "index.ts") {
      files.push(path.join(abs, entry.name));
    } else if (entry.isDirectory()) {
      const idx = path.join(abs, entry.name, "index.tsx");
      if (fs.existsSync(idx)) files.push(idx);
    }
  }
}
for (const f of files) {
  if (rewriteFile(f)) {
    changed++;
    console.log("rewrote", path.relative(REPO, f));
  }
}
console.log(`done: ${changed}/${files.length} files rewritten`);
