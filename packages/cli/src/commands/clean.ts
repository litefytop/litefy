import path from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry } from "../utils/registry";
import { writeBarrelIndex } from "../utils/barrel";
import type { Registry } from "./add";

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

async function filterMissing(
  installed: string[],
  targetDir: string,
  registry: Registry,
  cwd: string,
): Promise<string[]> {
  const keep: string[] = [];
  for (const name of installed) {
    const entry = registry[name];
    if (!entry) {
      logger.warn(`[clean] ${name} missing in registry, will prune from config`);
      continue;
    }
    const fileName = getFileNameFromUrl(entry.url);
    const fullPath = path.resolve(cwd, targetDir, fileName);
    if (await fs.pathExists(fullPath)) {
      keep.push(name);
    } else {
      logger.info(`[clean] prune ${name}: file not exist on disk`);
    }
  }
  return keep;
}

export async function clean() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn(`litefy.json not found at ${configPath}`);
    logger.info("Please run `litefy init` first.");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const registry: Registry = await loadRegistry();

  config.components.installed = await filterMissing(
    config.components.installed,
    config.components.path,
    registry,
    cwd,
  );
  config.utils.installed = await filterMissing(
    config.utils.installed,
    config.utils.path,
    registry,
    cwd,
  );

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const hookIndex = path.resolve(cwd, config.utils.path, "index.ts");
  await writeBarrelIndex(hookIndex, config.utils.installed);

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success("Clean finished, pruned invalid config entries");
}

export default clean;
