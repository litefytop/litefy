import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import logger from '../utils/logger';
import defaultRegistry from '../registry.json';

interface AddOptions {
  overwrite?: boolean;
  docs?: boolean;
}

interface LitefyConfig {
  components: string;
  installed: string[];
}

interface RegistryEntry {
  url: string;
}

type Registry = Record<string, RegistryEntry>;

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
    await addSingleComponent(component, componentsDir, options, config, defaultRegistry);
  }

  const newInstalled = [...new Set([...config.installed, ...components])];
  config.installed = newInstalled;
  await fs.writeJson(configPath, config, { spaces: 2 });

  logger.success('All components added successfully!');
}

async function addSingleComponent(
  componentName: string,
  targetDir: string,
  options: AddOptions,
  config: LitefyConfig,
  registry: Registry
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
    logger.warn(`${componentName} already installed, skipping component download. Use --overwrite to force.`);
    downloadComponent = false;
  } else if (componentExists && !options.overwrite) {
    logger.warn(`${componentName}.tsx already exists, skipping component download. Use --overwrite to force.`);
    downloadComponent = false;
  }

  if (downloadComponent) {
    logger.step(`Downloading ${componentName}.tsx...`);
    try {
      const response = await axios.get<string>(componentInfo.url);
      await fs.writeFile(targetFilePath, response.data);
      logger.success(`${componentName}.tsx saved to ${targetFilePath}`);
    } catch (err) {
      logger.error(`Failed to download ${componentName}.tsx: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (options.docs) {
    const docsUrl = `https://gitee.com/a1337650/litefy/raw/main/apps/public/registry/docs/${componentName}.md`;
    const docsDir = path.join(process.cwd(), 'docs');
    await fs.ensureDir(docsDir);
    const docsPath = path.join(docsDir, `${componentName}.md`);
    const docsExists = await fs.pathExists(docsPath);
    if (docsExists && !options.overwrite) {
      logger.warn(`Documentation ${componentName}.md already exists, skipped. Use --overwrite to force.`);
    } else {
      try {
        const docsResponse = await axios.get<string>(docsUrl);
        await fs.writeFile(docsPath, docsResponse.data);
        logger.success(`Documentation saved to ${docsPath}`);
      } catch (err) {
        logger.warn(`No documentation found for ${componentName} at ${docsUrl}`);
      }
    }
  }
}

export default add;
