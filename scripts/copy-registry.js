import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcComponentDir = path.resolve(__dirname, "../app/ui");
const docsBaseDir = path.resolve(__dirname, "../content/docs");
const registryRoot = path.resolve(__dirname, "../registry.json");
const allowedExts = new Set([".tsx", ".ts"]);

async function findDocFile(componentName) {
  const subDirs = ["component", "css", "hooks"];
  const targetName = `${componentName}.mdx`;
  for (const dir of subDirs) {
    const fullPath = path.join(docsBaseDir, dir, targetName);
    if (await fs.pathExists(fullPath)) {
      return `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/content/docs/${dir}/${targetName}`;
    }
  }
  return undefined;
}

async function generateRegistry() {
  const uiFiles = await fs.readdir(srcComponentDir);
  const registry = {};

  for (const file of uiFiles) {
    const ext = path.extname(file);
    if (!allowedExts.has(ext)) continue;
    if (file === "index.ts" || file === "index.tsx") continue;

    const name = path.basename(file, ext);
    const docUrl = await findDocFile(name);
    registry[name] = {
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/${file}`,
      ...(docUrl ? { docs: docUrl } : {}),
    };
  }

  await fs.writeJson(registryRoot, registry, { spaces: 2 });
  console.log(
    `Generated registry.json with ${Object.keys(registry).length} components`,
  );
}

generateRegistry();
