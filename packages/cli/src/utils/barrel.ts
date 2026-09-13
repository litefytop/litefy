import fs from "fs-extra";
import path from "node:path";
import { getFileNameFromUrl, loadRegistry } from "./registry";
import type { Registry } from "../commands/add";

// The top-level barrel init writes at <parent>/ui/litefy/index.ts, outside the
// configured components/utils/styles directories. uninstall matches this exact
// content to decide it is safe to delete.
export const UI_BARREL_INDEX_SOURCE = `export * from "./components";
export * from "./utils";
`;

export async function writeBarrelIndex(indexPath: string, installed: string[]) {
  const registry: Registry = await loadRegistry();
  const lines: string[] = [];

  for (const name of installed) {
    const entry = registry[name];
    if (!entry) continue;
    const fileName = getFileNameFromUrl(entry.url);
    const base = path.basename(fileName, path.extname(fileName));
    lines.push(`export * from "./${base}";`);
  }

  await fs.writeFile(indexPath, lines.join("\n") + "\n", "utf-8");
}
