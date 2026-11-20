import fs from "fs-extra";
import path from "node:path";
import { getFileNameFromUrl, loadRegistry } from "./registry";
import type { Registry } from "../commands/add";

export const UI_BARREL_INDEX_SOURCE = `export * from "./components";
export * from "./utils";
`;

export async function writeBarrelIndex(indexPath: string, installed: string[]) {
  const registry: Registry = await loadRegistry();
  const lines: string[] = [];

  for (const name of installed) {
    const entry = registry[name];
    if (!entry) continue;
    // Icon adapters (barrel: false) stay out — glyph exports collide with real
    // component names (Calendar), and components import "./icons" directly.
    if (entry.barrel === false) continue;
    const fileName = entry.installAs ?? getFileNameFromUrl(entry.url);
    const base = path.basename(fileName, path.extname(fileName));
    lines.push(`export * from "./${base}";`);
  }

  // A skin-only install (callout) never creates the components dir — the barrel
  // writer creates its own home before writing.
  await fs.ensureDir(path.dirname(indexPath));
  await fs.writeFile(indexPath, lines.join("\n") + "\n", "utf-8");
}

/* Skins have their own barrel (consumed as @/ui/skins): composed names like Button
   exist in both the skeleton and the skin layer, so a root re-export would shadow
   one side — the two barrels stay apart by design. */
export async function writeSkinBarrelIndex(indexPath: string, bases: string[]) {
  const lines = bases.map((base) => `export * from "./${base}";`);
  await fs.ensureDir(path.dirname(indexPath));
  await fs.writeFile(indexPath, lines.join("\n") + "\n", "utf-8");
}
