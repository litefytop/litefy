import path from "node:path";
import { fileURLToPath } from "node:url";
import fsp from "node:fs/promises";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcComponentDir = path.resolve(__dirname, "../app/ui");
const registryRoot = path.resolve(__dirname, "../packages/cli/registry.json");
const BASELINE_NPM_DEPS = new Set(["react", "react-dom"]);

async function scanDir(dirPath) {
  if (!(existsSync(dirPath))) return [];
  const entries = await fsp.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => path.basename(name, path.extname(name)) !== "index");
}

function scanLocalImports(filePath) {
  const source = readFileSync(filePath, "utf8");
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

function scanExternalImports(filePath) {
  const source = readFileSync(filePath, "utf8");
  const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
  const deps = new Set();
  const visit = (node) => {
    if (ts.isImportDeclaration(node) || (ts.isExportDeclaration(node) && node.moduleSpecifier)) {
      const spec = node.moduleSpecifier.text;
      if (!spec.startsWith(".") && !spec.startsWith("@/")) {
        const pkg = spec.startsWith("@")
          ? spec.split("/").slice(0, 2).join("/")
          : spec.split("/")[0];
        if (!BASELINE_NPM_DEPS.has(pkg)) deps.add(pkg);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return deps;
}

function scanBarrelImports(filePath, exportMap, selfBase) {
  const source = readFileSync(filePath, "utf8");
  const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
  const deps = new Set();
  const visit = (node) => {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === ".." && node.importClause) {
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
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return deps;
}

async function generateRegistry() {
  const registry = {};
  const counts = { component: 0, hook: 0, util: 0, css: 0, skin: 0 };

  const compDir = path.join(srcComponentDir, "components");
  const utilDir = path.join(srcComponentDir, "utils");
  const skinDir = path.join(srcComponentDir, "skins");

  /* The export map mirrors what the consumer barrels actually expose: files the
     barrels do not re-export (icons.tsx — its glyph components collide with real
     component names like Calendar) stay out of the map. */
  const reexportedBases = (dir) => {
    const indexSource = readFileSync(path.join(dir, "index.ts"), "utf8");
    return new Set(
      [...indexSource.matchAll(/export \* from "\.\/([\w-]+)"/gu)].map((m) => m[1]),
    );
  };

  const buildExportMap = (dir, included) => {
    const map = new Map();
    for (const fname of readdirSync(dir)) {
      if (fname.startsWith("index")) continue;
      if (included && !included.has(path.basename(fname, path.extname(fname)))) continue;
      const fp = path.join(dir, fname);
      if (!statSync(fp).isFile()) continue;
      const source = readFileSync(fp, "utf8");
      const kind = fname.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
      const sf = ts.createSourceFile(fp, source, ts.ScriptTarget.Latest, true, kind);
      const visit = (node) => {
        if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
          for (const e of node.exportClause.elements) map.set(e.name.text, path.basename(fname, path.extname(fname)));
        } else if (ts.isFunctionDeclaration(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) && node.name) {
          map.set(node.name.text, path.basename(fname, path.extname(fname)));
        } else if (ts.isVariableStatement(node) && node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
          for (const d of node.declarationList.declarations) {
            if (d.name && ts.isIdentifier(d.name)) map.set(d.name.text, path.basename(fname, path.extname(fname)));
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    return map;
  };

  const compIncluded = reexportedBases(compDir);
  const utilIncluded = reexportedBases(utilDir);
  const compExportMap = buildExportMap(compDir, compIncluded);
  const utilExportMap = buildExportMap(utilDir, utilIncluded);
  const barrelExportMap = new Map([...compExportMap, ...utilExportMap]);

  const compFiles = await scanDir(compDir);
  const skinFiles = await scanDir(skinDir);
  const skinBases = new Set(skinFiles.map((f) => path.basename(f, path.extname(f))));
  const skinFileName = new Map(skinFiles.map((f) => [path.basename(f, path.extname(f)), f]));
  const skinUrl = (base) =>
    `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/skins/${skinFileName.get(base)}`;

  /* Which components does each skin serve? The headless parts it RENDERS as JSX —
     aliased `@/ui` imports resolved through the component export map and filtered to
     components without their own same-name skin (that filter keeps a skin like
     swatch-picker — which composes SegmentGroup — from being read as the segment's
     look). Mere helper imports (createIcon, cn) are not renders. A skin serving
     components attaches to them via the `skin` field; one serving none is a
     standalone skin entry. */
  const scanSkinImports = (filePath) => {
    const source = readFileSync(filePath, "utf8");
    const kind = filePath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, kind);
    const uiAliases = new Map(); // local alias -> component base
    const local = new Set();
    const jsxTags = new Set();
    const visit = (node) => {
      if (ts.isImportDeclaration(node)) {
        const spec = node.moduleSpecifier.text;
        const bindings = node.importClause?.namedBindings;
        if (spec === "@/ui" && bindings && ts.isNamedImports(bindings)) {
          for (const elt of bindings.elements) {
            // Aliased imports (`X as Y`) carry the original export in propertyName.
            const comp = barrelExportMap.get(elt.propertyName?.text ?? elt.name.text);
            if (comp) uiAliases.set(elt.name.text, comp);
          }
        }
        if (spec.startsWith("./")) {
          local.add(path.basename(spec, path.extname(spec)));
        }
      }
      if (
        (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) &&
        ts.isIdentifier(node.tagName)
      ) {
        jsxTags.add(node.tagName.text);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    const served = new Set();
    for (const [alias, comp] of uiAliases) {
      if (jsxTags.has(alias)) served.add(comp);
    }
    return { served, uiAliases, local };
  };

  const skinServes = new Map();
  const compRenderers = new Map(); // component base -> skins rendering it as JSX
  for (const fname of skinFiles) {
    const base = path.basename(fname, path.extname(fname));
    const { served, uiAliases, local } = scanSkinImports(path.join(skinDir, fname));
    const cross = new Set([...served].filter((comp) => !skinBases.has(comp)));
    skinServes.set(base, { serves: cross, uiAliases, local });
    for (const comp of served) {
      if (!compRenderers.has(comp)) compRenderers.set(comp, new Set());
      compRenderers.get(comp).add(base);
    }
  }
  const compBases = new Set(compFiles.map((f) => path.basename(f, path.extname(f))));
  const skinOf = new Map();
  // 1:1: a skin named after its component (button.tsx → button).
  for (const base of skinBases) {
    if (compBases.has(base)) skinOf.set(base, base);
  }
  // Cross mappings only when the render is unique: a single skin rendering
  // NumberField IS number-field's look, while a shared helper like icons is
  // rendered by many skins and must not be attached to an arbitrary one.
  for (const [comp, renderers] of compRenderers) {
    if (renderers.size !== 1 || skinBases.has(comp)) continue;
    const base = [...renderers][0];
    if (!compBases.has(comp) || skinOf.has(comp)) continue;
    skinOf.set(comp, base);
  }

  for (const fname of compFiles) {
    const name = path.basename(fname, path.extname(fname));
    const filePath = path.join(compDir, fname);
    const deps = new Set();
    for (const d of scanLocalImports(filePath)) deps.add(d);
    for (const d of scanBarrelImports(filePath, barrelExportMap, name)) deps.add(d);
    // The skin ships with the component; its own relative imports that are skins
    // rather than components (cn / slots) ride along as skin entries.
    const skinBase = skinOf.get(name);
    if (skinBase) {
      for (const d of skinServes.get(skinBase).local) {
        if (skinBases.has(d)) deps.add(d);
      }
    }
    const npmDeps = [...scanExternalImports(filePath)];
    registry[name] = {
      type: "component",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/components/${fname}`,
      ...(skinBase ? { skin: skinUrl(skinBase) } : {}),
      ...(deps.size ? { dependence: [...deps] } : {}),
      ...(npmDeps.length ? { dependencies: npmDeps } : {}),
    };
    counts.component += 1;
  }

  const compEntries = await fsp.readdir(compDir, { withFileTypes: true });
  for (const entry of compEntries) {
    if (!entry.isDirectory()) continue;
    const indexPath = path.join(compDir, entry.name, "index.tsx");
    if (!existsSync(indexPath)) continue;
    const deps = new Set();
    for (const d of scanLocalImports(indexPath)) deps.add(d);
    for (const d of scanBarrelImports(indexPath, compExportMap)) deps.add(d);
    const npmDeps = [...scanExternalImports(indexPath)];
    registry[entry.name] = {
      type: "component",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/components/${entry.name}/index.tsx`,
      ...(deps.size ? { dependence: [...deps] } : {}),
      ...(npmDeps.length ? { dependencies: npmDeps } : {}),
    };
    counts.component += 1;
  }

  const utilFiles = await scanDir(utilDir);
  for (const fname of utilFiles) {
    const name = path.basename(fname, path.extname(fname));
    const type = name.startsWith("use-") ? "hook" : "util";
    const deps = scanLocalImports(path.join(utilDir, fname));
    const npmDeps = [...scanExternalImports(path.join(utilDir, fname))];
    registry[name] = {
      type,
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/utils/${fname}`,
      ...(deps.size ? { dependence: [...deps] } : {}),
      ...(npmDeps.length ? { dependencies: npmDeps } : {}),
    };
    counts[type] += 1;
  }

  /* Pure-style skins (no skeleton counterpart) get their own entries — add callout
     installs the skin file itself, so a skin-only component never fails. Skins of
     skeleton components ride on the component entry's `skin` field instead. */
  for (const [base, { serves, uiAliases, local }] of skinServes) {
    if (serves.size || compBases.has(base) || registry[base]) continue;
    const deps = new Set();
    for (const comp of uiAliases.values()) {
      if (registry[comp]) deps.add(comp);
    }
    for (const d of local) {
      if (skinBases.has(d)) deps.add(d);
    }
    const npmDeps = [...scanExternalImports(path.join(skinDir, skinFileName.get(base)))];
    registry[base] = {
      type: "skin",
      url: skinUrl(base),
      ...(deps.size ? { dependence: [...deps] } : {}),
      ...(npmDeps.length ? { dependencies: npmDeps } : {}),
    };
    counts.skin += 1;
  }

  /* The default icons entry is the lucide adapter; it never enters consumer
     barrels — glyph exports collide with component names (Calendar). */
  if (registry.icons) registry.icons.barrel = false;

  /* Icon adapters (ui/components.md contract): alternative implementations of
     the canonical icon surface. They live outside app/ui on purpose — they are
     distribution assets, installed as `icons.tsx` via `--icon-library`, so the
     skeleton's `./icons` imports stay untouched whichever library is chosen. */
  const adaptersDir = path.resolve(__dirname, "../packages/cli/adapters");
  if (existsSync(adaptersDir)) {
    for (const entry of await fsp.readdir(adaptersDir, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.startsWith("icons-")) continue;
      const lib = path.basename(entry.name, path.extname(entry.name)).replace(/^icons-/u, "");
      const npmDeps = [...scanExternalImports(path.join(adaptersDir, entry.name))];
      registry[`icons/${lib}`] = {
        type: "component",
        url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/packages/cli/adapters/${entry.name}`,
        installAs: "icons.tsx",
        barrel: false,
        ...(npmDeps.length ? { dependencies: npmDeps } : {}),
      };
      counts.component += 1;
    }
  }

  const schemesDir = path.join(srcComponentDir, "schemes");
  if (existsSync(schemesDir)) {
    for (const schemeEntry of await fsp.readdir(schemesDir, { withFileTypes: true })) {
      if (!schemeEntry.isDirectory()) continue;
      const scheme = schemeEntry.name;
      const cdn = (f) =>
        `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/schemes/${scheme}/${f}`;

      // One scheme = one theme stylesheet: `index.css` holds the tokens, base behaviour,
      // variants and @utility primitives, so `base` and `preset` are the same file — the
      // scheme is installed whole. The looks live in app/ui/skins/*.tsx, one copy shared
      // by every scheme, and the registry still has no type that places them.
      registry[`style/${scheme}/base`] = {
        type: "css",
        url: cdn("index.css"),
        files: [cdn("index.css")],
      };
      registry[`style/${scheme}/preset`] = {
        type: "css",
        url: cdn("index.css"),
        files: [cdn("index.css")],
      };
      counts.css += 2;
    }
  }

  await fsp.mkdir(path.dirname(registryRoot), { recursive: true });
  await fsp.writeFile(registryRoot, JSON.stringify(registry, null, 2) + "\n");

  const keys = Object.keys(registry);
  console.log(
    `Generated registry.json, Total: ${keys.length} | components:${counts.component} | hooks:${counts.hook} | utils:${counts.util} | skins:${counts.skin} | styles:${counts.css}`,
  );
}

try {
  await generateRegistry();
} catch (err) {
  console.error(err);
  process.exit(1);
}
