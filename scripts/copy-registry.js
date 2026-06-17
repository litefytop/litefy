import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcComponentDir = path.resolve(__dirname, "../app/ui");
const registryRoot = path.resolve(__dirname, "../public/registry.json");
const allowedExts = new Set([".tsx", ".ts"]);

async function generateRegistry() {
  const uiFiles = await fs.readdir(srcComponentDir);
  const registry = {};

  for (const file of uiFiles) {
    const ext = path.extname(file);
    if (!allowedExts.has(ext)) continue;
    if (file === "index.ts" || file === "index.tsx") continue;

    const name = path.basename(file, ext);
    registry[name] = {
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/app/ui/${file}`,
      docs: `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/content/docs/${name}.mdx`,
    };
  }

  await fs.writeJson(registryRoot, registry, { spaces: 2 });
  console.log(
    `Generated registry.json with ${Object.keys(registry).length} components`,
  );
}

generateRegistry();
