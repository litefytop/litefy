import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import logger from '../utils/logger';

interface InitOptions {
  yes?: boolean;
}

interface LitefyConfig {
  components: string;
  registry: string;
}

async function init(options: InitOptions): Promise<void> {
  logger.step('Initializing Litefy configuration...');

  const cwd = process.cwd();
  const configPath = path.join(cwd, 'litefy.json');

  if (await fs.pathExists(configPath)) {
    logger.warn('litefy.json already exists, skipping initialization');
    return;
  }

  let config: LitefyConfig;
  if (options.yes) {
    config = {
      components: './src/components',
      registry: 'https://litefy.top/registry.json',
    };
  } else {
    const answers = await inquirer.prompt<{ componentsPath: string }>([
      {
        type: 'input',
        name: 'componentsPath',
        message: 'Components directory path:',
        default: './src/components',
      },
    ]);
    config = {
      components: answers.componentsPath,
      registry: 'https://litefy.top/registry.json',
    };
  }

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success('Initialization complete! Generated litefy.json');
  logger.info('Run `litefy add <component>` to add components');
}

export default init;
