import path from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry, resolveRegistryName } from "../utils/registry";
import { writeBarrelIndex, writeSkinBarrelIndex } from "../utils/barrel";
import { entryFileUrls, type Registry, type RegistryEntry } from "./add";

interface LitefyConfig {
  components: {
    path: string;
    installed: string[];
  };
  utils: {
    path: string;
    installed: string[];
  };
  skins: {
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
  config.skins =
    config.skins ??
    {
      path: path.posix.join(path.posix.dirname(config.components.path), "skins"),
      installed: [],
    };
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

  const skinsIndex = path.resolve(cwd, config.skins.path, "index.ts");
  await writeSkinBarrelIndex(skinsIndex, config.skins.installed);

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
    case "skin":
      relDir = config.skins.path;
      installedArr = config.skins.installed;
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

  for (const url of entryFileUrls(entry)) {
    const filePath = path.join(targetDir, getFileNameFromUrl(url));
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      logger.success(`Deleted ${path.relative(cwd, filePath)}`);
    } else {
      logger.warn(`File not found ${path.relative(cwd, filePath)}, clean config only`);
    }
  }

  if (entry.skin) {
    const skinPath = path.resolve(cwd, config.skins.path, getFileNameFromUrl(entry.skin));
    if (await fs.pathExists(skinPath)) {
      await fs.remove(skinPath);
      logger.success(`Deleted ${path.relative(cwd, skinPath)}`);
    }
    config.skins.installed = config.skins.installed.filter((x) => x !== itemName);
  }

  switch (entry.type) {
    case "component":
      config.components.installed = config.components.installed.filter((x) => x !== itemName);
      break;
    case "skin":
      config.skins.installed = config.skins.installed.filter((x) => x !== itemName);
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
