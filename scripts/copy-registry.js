import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

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

async function generateRegistry() {
  const registry = {};

  const compFiles = await scanDir(path.join(srcComponentDir, "components"));
  for (const fname of compFiles) {
    const name = path.basename(fname, path.extname(fname));
    registry[name] = {
      type: "component",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/components/${fname}`,
    };
  }

  const hookFiles = await scanDir(path.join(srcComponentDir, "hooks"));
  for (const fname of hookFiles) {
    const name = path.basename(fname, path.extname(fname));
    registry[name] = {
      type: "hook",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/hooks/${fname}`,
    };
  }

  const styleFiles = await scanDir(path.join(srcComponentDir, "styles"));
  for (const fname of styleFiles) {
    const base = path.basename(fname, path.extname(fname));
    const key = `style-${base}`;
    registry[key] = {
      type: "css",
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy-fuma@main/app/ui/styles/${fname}`,
    };
  }

  await fs.ensureDir(path.dirname(registryRoot));
  await fs.writeJson(registryRoot, registry, { spaces: 2 });

  const keys = Object.keys(registry);
  const componentKeys = keys.filter((k) => !k.startsWith("style-") && !k.startsWith("use-"));
  const hookKeys = keys.filter((k) => k.startsWith("use-"));
  const styleKeys = keys.filter((k) => k.startsWith("style-"));

  console.log(
    `Generated registry.json, Total: ${keys.length} | components:${componentKeys.length} | hooks:${hookKeys.length} | styles:${styleKeys.length}`,
  );
}

generateRegistry().catch((err) => {
  console.error(err);
  process.exit(1);
});
