import fs from "fs-extra";
import path from "node:path";
import type { Registry, RegistryEntry } from "../commands/add";

export async function loadRegistry(): Promise<Registry> {
  const regPath = path.resolve(__dirname, "../../registry.json");
  const raw = (await fs.readJson(regPath)) as Record<
    string,
    { type: string; url: string; docs?: string; dependence?: string[] }
  >;

  const registry: Registry = {};
  for (const key in raw) {
    const item = raw[key];
    registry[key] = {
      type: item.type as RegistryEntry["type"],
      url: item.url,
      docs: item.docs,
      dependence: item.dependence,
    };
  }
  return registry;
}

export function getFileNameFromUrl(url: string): string {
  return url.split("/").pop()!;
}

export const PKG_ROOT = path.resolve(__dirname, "..", "..");

export function getRepoPathFromUrl(url: string): string | null {
  const marker = "jsdelivr.net/gh/";
  const index = url.indexOf(marker);
  if (index === -1) return null;
  const rest = url.slice(index + marker.length);
  const at = rest.indexOf("@");
  if (at === -1) return null;
  const slash = rest.indexOf("/", at);
  return slash === -1 ? null : rest.slice(slash + 1);
}

export async function readPkgSource(entry: RegistryEntry): Promise<string | null> {
  const repoPath = getRepoPathFromUrl(entry.url);
  if (!repoPath) return null;
  const localPath = path.join(PKG_ROOT, "sources", repoPath);
  if (!(await fs.pathExists(localPath))) return null;
  return fs.readFile(localPath, "utf-8");
}

export function resolveRegistryName(registry: Registry, name: string): string | null {
  if (registry[name]) return name;
  const lower = name.toLowerCase();
  return registry[lower] ? lower : null;
}
