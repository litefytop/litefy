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

function scanDependencies(filePath) {
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
  return [...deps];
}

async function generateRegistry() {
  const registry = {};
  const counts = { component: 0, hook: 0, util: 0, css: 0 };

  const compFiles = await scanDir(path.join(srcComponentDir, "components"));
  for (const fname of compFiles) {
    const name = path.basename(fname, path.extname(fname));
    const dependence = scanDependencies(path.join(srcComponentDir, "components", fname));
    registry[name] = {
      type: "component",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/components/${fname}`,
      ...(dependence.length ? { dependence } : {}),
    };
    counts.component += 1;
  }

  const utilFiles = await scanDir(path.join(srcComponentDir, "utils"));
  for (const fname of utilFiles) {
    const name = path.basename(fname, path.extname(fname));
    const type = name.startsWith("use-") ? "hook" : "util";
    const dependence = scanDependencies(path.join(srcComponentDir, "utils", fname));
    registry[name] = {
      type,
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/utils/${fname}`,
      ...(dependence.length ? { dependence } : {}),
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
