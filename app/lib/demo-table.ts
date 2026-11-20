import type { ComponentType } from "react";

export type DemoLoaders = Record<string, () => Promise<{ default: ComponentType }>>;
type CodeLoaders = Record<string, () => Promise<string>>;

export interface DemoEntry {
  load: () => Promise<ComponentType>;
  loadCode: () => Promise<string>;
}

export function demoKeyOf(path: string): string {
  const match = path.match(/app\/demos\/(.+)\.tsx$/u);
  return match ? match[1].replaceAll('/', "-") : path;
}

export function buildDemoTable(
  modules: DemoLoaders,
  codes: CodeLoaders,
): Record<string, DemoEntry> {
  const table: Record<string, DemoEntry> = {};
  for (const [path, loadModule] of Object.entries(modules)) {
    const loadCode = codes[path];
    if (!loadModule || !loadCode) continue;
    table[demoKeyOf(path)] = { load: async () => (await loadModule()).default, loadCode };
  }
  return table;
}
