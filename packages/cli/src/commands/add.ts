import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";

interface AddOptions {
  overwrite?: boolean;
  docs?: boolean;
  config?: string;
  componentsDir?: string;
}

interface LitefyConfig {
  components: string;
  installed: string[];
  aliases?: {
    ui: string;
    hooks: string;
    utils: string;
  };
  docs?: string;
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

async function add(components: string[], options: AddOptions): Promise<void> {
  logger.step(`Preparing to add components: ${components.join(", ")}`);

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

  const componentsDirRaw =
    options.componentsDir || config.components || "./src/ui";
  const componentsDir = path.resolve(cwd, componentsDirRaw);
  await fs.ensureDir(componentsDir);

  const registry = await fetchRegistry();

  for (const component of components) {
    await addSingleComponent(
      component,
      componentsDir,
      options,
      config,
      registry,
    );
  }

  const newInstalled = [...new Set([...config.installed, ...components])];
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
): Promise<void> {
  const componentInfo = registry[componentName];
  if (!componentInfo) {
    logger.error(`Component not found: ${componentName}`);
    return;
  }

  const targetFilePath = path.join(targetDir, `${componentName}.tsx`);
  const componentExists = await fs.pathExists(targetFilePath);
  const alreadyInstalled = config.installed.includes(componentName);

  let downloadComponent = true;
  if (alreadyInstalled && !options.overwrite) {
    logger.warn(
      `${componentName} already installed in config, skipping. Use --overwrite to force.`,
    );
    downloadComponent = false;
  } else if (componentExists && !options.overwrite) {
    logger.warn(
      `${componentName}.tsx already exists, skipping. Use --overwrite to force.`,
    );
    downloadComponent = false;
  }

  if (downloadComponent) {
    logger.step(`Downloading ${componentName}.tsx...`);
    try {
      const response = await axios.get<string>(componentInfo.url);
      await fs.writeFile(targetFilePath, response.data);
      logger.success(`${componentName}.tsx saved to ${targetFilePath}`);
    } catch (err) {
      logger.error(
        `Failed to download ${componentName}.tsx: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  if (options.docs && componentInfo.docs) {
    const docsDir = config.docs
      ? path.resolve(process.cwd(), config.docs)
      : path.join(process.cwd(), "docs");
    await fs.ensureDir(docsDir);
    const docsPath = path.join(docsDir, `${componentName}.md`);
    const docsExists = await fs.pathExists(docsPath);
    if (docsExists && !options.overwrite) {
      logger.warn(
        `Documentation ${componentName}.md already exists, skipped. Use --overwrite to force.`,
      );
    } else {
      try {
        const docsResponse = await axios.get<string>(componentInfo.docs);
        await fs.writeFile(docsPath, docsResponse.data);
        logger.success(`Documentation saved to ${docsPath}`);
      } catch (err) {
        logger.error(
          `Failed to download ${componentName} docs: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }
  } else if (options.docs && !componentInfo.docs) {
    logger.warn(
      `No documentation URL configured for ${componentName} in registry.`,
    );
  }
}

export default add;
