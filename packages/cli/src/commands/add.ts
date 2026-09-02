import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry } from "../utils/registry";
import { writeBarrelIndex } from "../utils/barrel";
import init from "../commands/init";

interface AddOptions {
  overwrite?: boolean;
}

interface LitefyConfig {
  sourceRoot: string;
  components: {
    path: string;
    installed: string[];
  };
  utils: {
    path: string;
    installed: string[];
  };
  styles: {
    path: string;
    installed: string[];
  };
}

export type RegistryEntry = {
  type: "component" | "hook" | "util" | "css";
  url: string;
  docs?: string;
  dependence?: string[];
};

export type Registry = Record<string, RegistryEntry>;

async function add(selectNames: string[], options: AddOptions): Promise<void> {
  logger.step(`Preparing to add: ${selectNames.join(", ")}`);

  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.info("litefy.json not found, running init automatically...");
    await init({ yes: true });
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const registry: Registry = await loadRegistry();

  const targetDirFor = (entry: RegistryEntry) =>
    entry.type === "component"
      ? config.components.path
      : entry.type === "css"
        ? config.styles.path
        : config.utils.path;

  const installedListFor = (entry: RegistryEntry) =>
    entry.type === "component"
      ? config.components.installed
      : entry.type === "css"
        ? config.styles.installed
        : config.utils.installed;

  const processed = new Set<string>();
  const queue = [...selectNames];

  while (queue.length) {
    const name = queue.shift()!;
    if (processed.has(name)) continue;
    processed.add(name);

    const entry = registry[name];
    if (!entry) {
      logger.error(`Not found in registry: ${name}`);
      continue;
    }

    const ok = await addSingle(name, entry, targetDirFor(entry), cwd, options);
    if (!ok) continue;

    const installedList = installedListFor(entry);
    if (!installedList.includes(name)) installedList.push(name);

    for (const dep of entry.dependence ?? []) {
      if (processed.has(dep)) continue;
      if (!registry[dep]) {
        logger.warn(`Dependency "${dep}" of ${name} not found in registry, skip`);
        continue;
      }
      logger.info(`Resolving dependency "${dep}" required by ${name}`);
      queue.push(dep);
    }
  }

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const utilIndex = path.resolve(cwd, config.utils.path, "index.ts");
  await writeBarrelIndex(utilIndex, config.utils.installed);

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success("Process finished.");
}

export async function addSingle(
  itemName: string,
  entry: RegistryEntry,
  relTargetDir: string,
  cwd: string,
  options: AddOptions,
): Promise<boolean> {
  const targetDir = path.resolve(cwd, relTargetDir);
  await fs.ensureDir(targetDir);

  const fileName = getFileNameFromUrl(entry.url);
  const outFile = path.join(targetDir, fileName);
  const exists = await fs.pathExists(outFile);

  if (exists && !options.overwrite) {
    logger.warn(`${fileName} exists, skip. Use --overwrite to replace.`);
    return true;
  }

  logger.step(`Download ${itemName} → ${path.relative(cwd, outFile)}`);
  try {
    const res = await axios.get<string>(entry.url, { timeout: 10000 });
    await fs.writeFile(outFile, res.data, "utf-8");
    logger.success(`Saved ${fileName}`);
  } catch (e) {
    logger.error(`Download failed ${itemName}: ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }

  return true;
}

export default add;
