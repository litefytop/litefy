import path from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry } from "../utils/registry";
import { writeBarrelIndex } from "../utils/barrel";
import { addSingle } from "./add";
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

export async function repair() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn(`litefy.json not found at ${configPath}`);
    logger.info("Please run `litefy init` first.");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const registry: Registry = await loadRegistry();

  const processList: Array<{
    name: string;
    entry: RegistryEntry;
    targetDir: string;
  }> = [];

  for (const name of config.components.installed) {
    const entry = registry[name];
    if (!entry) {
      logger.warn(`[repair] ${name} exists in config but missing from registry, skip`);
      continue;
    }
    processList.push({ name, entry, targetDir: config.components.path });
  }

  for (const name of config.utils.installed) {
    const entry = registry[name];
    if (!entry) {
      logger.warn(`[repair] ${name} exists in config but missing from registry, skip`);
      continue;
    }
    processList.push({ name, entry, targetDir: config.utils.path });
  }

  for (const item of processList) {
    const { name, entry, targetDir } = item;
    const fileName = getFileNameFromUrl(entry.url);
    const filePath = path.resolve(cwd, targetDir, fileName);

    if (await fs.pathExists(filePath)) {
      continue;
    }
    logger.info(`[repair] missing file, restoring ${name}`);
    await addSingle(name, entry, targetDir, cwd, { overwrite: true });
  }

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const hookIndex = path.resolve(cwd, config.utils.path, "index.ts");
  await writeBarrelIndex(hookIndex, config.utils.installed);

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success("Repair finished");
}

export default repair;
