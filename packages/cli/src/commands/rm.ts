import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";

interface LitefyConfig {
  components: string;
  installed: string[];
}

interface RegistryEntry {
  url: string;
  docs?: string;
}
type Registry = Record<string, RegistryEntry>;

const REGISTRY_URL =
  "https://cdn.jsdelivr.net/gh/litefytop/litefy@main/registry.json";

async function fetchRegistry(): Promise<Registry> {
  try {
    const response = await axios.get<Registry>(REGISTRY_URL);
    return response.data;
  } catch (error) {
    logger.error(`Failed to fetch component registry from ${REGISTRY_URL}`);
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function getFileNameFromUrl(url: string): string {
  return path.basename(new URL(url).pathname);
}

async function rm(components: string[]): Promise<void> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn(`litefy.json not found at ${configPath}`);
    logger.info("Please run `litefy init` first.");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const componentsDirRaw = config.components || "./src/ui";
  const componentsDir = path.resolve(cwd, componentsDirRaw);

  const registry = await fetchRegistry();

  for (const comp of components) {
    const componentInfo = registry[comp];
    if (!componentInfo) {
      logger.error(`Component not found in registry: ${comp}, skip`);
      continue;
    }

    if (!config.installed.includes(comp)) {
      logger.warn(`Component "${comp}" is not in installed list, skip`);
      continue;
    }

    const fileName = getFileNameFromUrl(componentInfo.url);
    const targetFile = path.join(componentsDir, fileName);

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
