import fs from "fs-extra";
import path from "node:path";
import type { Registry, RegistryEntry } from "../commands/add";

export async function loadRegistry(): Promise<Registry> {
  const regPath = path.resolve(__dirname, "../../packages/cli/registry.json");
  const raw = (await fs.readJson(regPath)) as Record<
    string,
    { type: string; url: string; docs?: string }
  >;

  const registry: Registry = {};
  for (const key in raw) {
    const item = raw[key];
    registry[key] = {
      type: item.type as RegistryEntry["type"],
      url: item.url,
      docs: item.docs,
    };
  }
  return registry;
}

export function getFileNameFromUrl(url: string): string {
  return url.split("/").pop()!;
}
