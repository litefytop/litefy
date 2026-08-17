import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry } from "../utils/registry";

interface AddOptions {
  overwrite?: boolean;
}

interface LitefyConfig {
  components: string;
  installed: string[];
}

interface RegistryEntry {
  url: string;
  docs?: string;
}

type Registry = Record<string, RegistryEntry>;





async function add(components: string[], options: AddOptions): Promise<void> {
  logger.step(`Preparing to add components: ${components.join(", ")}`);

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
  await fs.ensureDir(componentsDir);

  const registry = await loadRegistry();

  const successList: string[] = [];
  for (const component of components) {
    const ok = await addSingleComponent(
      component,
      componentsDir,
      options,
      config,
      registry,
    );
    if (ok) successList.push(component);
  }

  const newInstalled = [...new Set([...config.installed, ...successList])];
  config.installed = newInstalled;
  await fs.writeJson(configPath, config, { spaces: 2 });

  logger.success("All components added successfully!");
}

async function addSingleComponent(
  componentName: string,
  targetDir: string,
  options: AddOptions,
  config: LitefyConfig,
  registry: Registry,
): Promise<boolean> {
  const componentInfo = registry[componentName];
  if (!componentInfo) {
    logger.error(`Component not found: ${componentName}`);
    return false;
  }

  if (config.installed.includes(componentName) && !options.overwrite) {
    logger.warn(`${componentName} already installed in config, skipping. Use --overwrite to force.`);
    return true;
  }

  const fileName = getFileNameFromUrl(componentInfo.url);
  const targetFilePath = path.join(targetDir, fileName);
  const componentExists = await fs.pathExists(targetFilePath);

  let downloadComponent = true;
  if (componentExists && !options.overwrite) {
    logger.warn(
      `${fileName} already exists, skipping. Use --overwrite to force.`,
    );
    downloadComponent = false;
  }

  if (downloadComponent) {
    logger.step(`Downloading ${fileName}...`);
    try {
      const response = await axios.get<string>(componentInfo.url);
      await fs.writeFile(targetFilePath, response.data);
      logger.success(`${fileName} saved to ${targetFilePath}`);
    } catch (err) {
      logger.error(
        `Failed to download ${fileName}: ${err instanceof Error ? err.message : String(err)}`,
      );
      return false;
    }
  }
  return true;
}

export default add;
