import path from "node:path";
import fs from "fs-extra";
import logger from "../utils/logger";

interface RmOptions {
  config?: string;
}

interface LitefyConfig {
  components: string;
  installed: string[];
  aliases?: {
    ui: string;
    hooks: string;
    utils: string;
  };
}

async function rm(components: string[], options: RmOptions): Promise<void> {
  const cwd = process.cwd();
  const configPath = options.config
    ? path.resolve(cwd, options.config)
    : path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn(`litefy.json not found at ${configPath}`);
    logger.info("Please run `litefy init` first.");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const componentsDir = path.resolve(cwd, config.components);

  for (const comp of components) {
    const targetFile = path.join(componentsDir, `${comp}.tsx`);

    if (!config.installed.includes(comp)) {
      logger.warn(`Component "${comp}" is not in installed list, skip`);
      continue;
    }

    if (await fs.pathExists(targetFile)) {
      await fs.remove(targetFile);
      logger.success(`Deleted file: ${targetFile}`);
    } else {
      logger.warn(`File ${targetFile} not found, clean config only`);
    }

    config.installed = config.installed.filter((item) => item !== comp);
  }

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success("Remove done, updated litefy.json");
}

export default rm;
