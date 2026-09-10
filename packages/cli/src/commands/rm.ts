import path from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry, resolveRegistryName } from "../utils/registry";
import { writeBarrelIndex } from "../utils/barrel";
import type { Registry, RegistryEntry } from "./add";

interface LitefyConfig {
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

async function rm(names: string[]): Promise<void> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn(`litefy.json not found at ${configPath}`);
    logger.info("Please run `litefy init` first.");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const registry: Registry = await loadRegistry();

  for (const raw of names) {
    const name = resolveRegistryName(registry, raw);
    if (!name) {
      logger.error(`"${raw}" not found in local registry, skip`);
      continue;
    }
    await removeSingle(name, registry[name], config, cwd);
  }

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const hookIndex = path.resolve(cwd, config.utils.path, "index.ts");
  await writeBarrelIndex(hookIndex, config.utils.installed);

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success("Remove done, updated litefy.json");
}

async function removeSingle(
  itemName: string,
  entry: RegistryEntry,
  config: LitefyConfig,
  cwd: string,
) {
  let relDir: string;
  let installedArr: string[];

  switch (entry.type) {
    case "component":
      relDir = config.components.path;
      installedArr = config.components.installed;
      break;
    case "hook":
    case "util":
      relDir = config.utils.path;
      installedArr = config.utils.installed;
      break;
    case "css":
      relDir = config.styles.path;
      installedArr = config.styles.installed;
      break;
  }

  if (!installedArr.includes(itemName)) {
    logger.warn(`"${itemName}" is not installed, skip`);
    return;
  }

  const targetDir = path.resolve(cwd, relDir);
  const fileName = getFileNameFromUrl(entry.url);
  const filePath = path.join(targetDir, fileName);

  if (await fs.pathExists(filePath)) {
    await fs.remove(filePath);
    logger.success(`Deleted ${path.relative(cwd, filePath)}`);
  } else {
    logger.warn(`File not found ${path.relative(cwd, filePath)}, clean config only`);
  }

  switch (entry.type) {
    case "component":
      config.components.installed = config.components.installed.filter((x) => x !== itemName);
      break;
    case "hook":
    case "util":
      config.utils.installed = config.utils.installed.filter((x) => x !== itemName);
      break;
    case "css":
      config.styles.installed = config.styles.installed.filter((x) => x !== itemName);
      break;
  }
}

export default rm;
