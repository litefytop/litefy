import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcComponentDir = path.resolve(__dirname, "../app/ui");
const registryRoot = path.resolve(__dirname, "../packages/cli/registry.json");

async function scanDir(dirPath) {
  if (!(await fs.pathExists(dirPath))) return [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => path.basename(name, path.extname(name)) !== "index");
}

function scanLocalImports(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
  const deps = new Set();
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || (ts.isExportDeclaration(node) && node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      if (spec.startsWith(".") && spec !== "." && spec !== "..") {
        const base = path.basename(spec, path.extname(spec));
        if (base && base !== "index") deps.add(base);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return deps;
}

function buildExportMap(dirPath) {
  const map = new Map();
  const files = fs.readdirSync(dirPath);
  for (const fname of files) {
    if (fname === "index.ts" || fname === "index.tsx") continue;
    const filePath = path.join(dirPath, fname);
    if (!fs.statSync(filePath).isFile()) continue;
    const source = fs.readFileSync(filePath, "utf8");
    const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
    const visit = (node) => {
      if (ts.isExportDeclaration(node)) {
        if (node.exportClause && ts.isNamedExports(node.exportClause)) {
          for (const elt of node.exportClause.elements) {
            const name = elt.name.text;
            if (name && !map.has(name)) map.set(name, path.basename(fname, path.extname(fname)));
          }
        } else if (!node.exportClause && node.moduleSpecifier) {
          const spec = node.moduleSpecifier.text;
          if (spec.startsWith(".")) {
            const base = path.basename(spec, path.extname(spec));
            if (base && !map.has(base)) map.set(base, base);
          }
        }
      } else if (ts.isExportAssignment(node)) {
        if (ts.isIdentifier(node.expression)) {
          const name = node.expression.text;
          if (name && !map.has(name)) map.set(name, path.basename(fname, path.extname(fname)));
        }
      } else if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
        if (node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && node.name) {
          map.set(node.name.text, path.basename(fname, path.extname(fname)));
        }
      } else if (ts.isVariableStatement(node)) {
        if (node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          for (const decl of node.declarationList.declarations) {
            if (decl.name && ts.isIdentifier(decl.name)) {
              map.set(decl.name.text, path.basename(fname, path.extname(fname)));
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
  return map;
}

function scanBarrelImports(filePath, exportMap, selfBase) {
  const source = fs.readFileSync(filePath, "utf8");
  const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
  const deps = new Set();
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "..") {
      if (node.importClause) {
        if (node.importClause.name) {
          const localName = node.importClause.name.text;
          const baseName = exportMap.get(localName);
          if (baseName && baseName !== selfBase) {
            deps.add(baseName);
          }
        }
        if (node.importClause.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
          for (const elt of node.importClause.namedBindings.elements) {
            const localName = elt.name.text;
            const baseName = exportMap.get(localName);
            if (baseName && baseName !== selfBase) {
              deps.add(baseName);
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return deps;
}

async function generateRegistry() {
  const registry = {};
  const counts = { component: 0, hook: 0, util: 0, css: 0 };

  const compDir = path.join(srcComponentDir, "components");
  const utilDir = path.join(srcComponentDir, "utils");

  const compExportMap = buildExportMap(compDir);
  const utilExportMap = buildExportMap(utilDir);
  const barrelExportMap = new Map([...compExportMap, ...utilExportMap]);

  const compFiles = await scanDir(compDir);
  for (const fname of compFiles) {
    const name = path.basename(fname, path.extname(fname));
    const filePath = path.join(compDir, fname);
    const deps = new Set();
    for (const d of scanLocalImports(filePath)) deps.add(d);
    for (const d of scanBarrelImports(filePath, compExportMap)) deps.add(d);
    registry[name] = {
      type: "component",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/components/${fname}`,
      ...(deps.size ? { dependence: [...deps] } : {}),
    };
    counts.component += 1;
  }

  // Optional modules shipped as folders with an index.tsx (e.g. form-item/).
  const compEntries = await fs.readdir(compDir, { withFileTypes: true });
  for (const entry of compEntries) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(compDir, entry.name, "index.tsx");
    if (!fs.pathExists(indexPath)) continue;
    const deps = new Set();
    for (const d of scanLocalImports(indexPath)) deps.add(d);
    for (const d of scanBarrelImports(indexPath, compExportMap)) deps.add(d);
    registry[entry.name] = {
      type: "component",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/components/${entry.name}/index.tsx`,
      ...(deps.size ? { dependence: [...deps] } : {}),
    };
    counts.component += 1;
  }

  const utilFiles = await scanDir(utilDir);
  for (const fname of utilFiles) {
    const name = path.basename(fname, path.extname(fname));
    const type = name.startsWith("use-") ? "hook" : "util";
    const deps = scanLocalImports(path.join(utilDir, fname));
    registry[name] = {
      type,
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/utils/${fname}`,
      ...(deps.size ? { dependence: [...deps] } : {}),
    };
    counts[type] += 1;
  }

  const styleFiles = await scanDir(path.join(srcComponentDir, "styles"));
  for (const fname of styleFiles) {
    const base = path.basename(fname, path.extname(fname));
    const key = `style-${base}`;
    registry[key] = {
      type: "css",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/styles/${fname}`,
    };
    counts.css += 1;
  }

  await fs.ensureDir(path.dirname(registryRoot));
  await fs.writeJson(registryRoot, registry, { spaces: 2 });

  const keys = Object.keys(registry);
  console.log(
    `Generated registry.json, Total: ${keys.length} | components:${counts.component} | hooks:${counts.hook} | utils:${counts.util} | styles:${counts.css}`,
  );
}

generateRegistry().catch((err) => {
  console.error(err);
  process.exit(1);
});
