import registryJson from "../../registry.json";

export interface RegistryEntry {
  url: string;
  docs?: string;
}
export type Registry = Record<string, RegistryEntry>;

export async function loadRegistry() {
  return registryJson;
}

export function getFileNameFromUrl(url: string) {
  return new URL(url).pathname.split("/").pop()!;
}
