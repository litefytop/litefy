import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import logger from '../utils/logger';

interface AddOptions {
  overwrite?: boolean;
}

interface LitefyConfig {
  components: string;
  registry: string;
}

interface RegistryEntry {
  url: string;
  files?: string[];
}

interface Registry {
  [componentName: string]: RegistryEntry;
}

async function add(components: string[], options: AddOptions): Promise<void> {
  logger.step(`Preparing to add components: ${components.join(', ')}`);

  const cwd = process.cwd();
  const configPath = path.join(cwd, 'litefy.json');

  if (!(await fs.pathExists(configPath))) {
    logger.warn('litefy.json not found. Please run `litefy init` first.');
    logger.info('Auto-initializing...');
    const init = await import('./init');
    await init.default({ yes: false });
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const componentsDir = path.join(cwd, config.components || './src/components');
  await fs.ensureDir(componentsDir);

  for (const component of components) {
    await addSingleComponent(component, componentsDir, options, config);
  }

  logger.success('All components added successfully!');
}

async function addSingleComponent(
  componentName: string,
  targetDir: string,
  options: AddOptions,
  config: LitefyConfig
): Promise<void> {
  const filePath = path.join(targetDir, `${componentName}.tsx`);

  if ((await fs.pathExists(filePath)) && !options.overwrite) {
    logger.warn(`${componentName} already exists, skipped (use --overwrite to force)`);
    return;
  }

  logger.step(`Downloading ${componentName}.tsx...`);

  try {
    const registryUrl = config.registry || 'https://litefy.top/registry.json';
    const response = await axios.get<Registry>(registryUrl);
    const registry = response.data;

    const componentInfo = registry[componentName];
    if (!componentInfo) {
      logger.error(`Component not found: ${componentName}`);
      return;
    }

    const codeResponse = await axios.get<string>(componentInfo.url);
    await fs.writeFile(filePath, codeResponse.data);
    logger.success(`${componentName} added to ${filePath}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error(`Failed to download ${componentName}: ${message}`);
  }
}

export default add;
