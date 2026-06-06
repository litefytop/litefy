#!/usr/bin/env node

import { program } from 'commander';
import init from '../commands/init';
import add from '../commands/add';
import packageJson from '../../package.json'; 

program
  .name('litefy')
  .description('Litefy UI - A lightweight React component library and CLI tool')
  .version(packageJson.version); 

program
  .command('init')
  .description('Initialize Litefy configuration in your project')
  .option('-y, --yes', 'Skip all prompts, use defaults')
  .action(init);

program
  .command('add <components...>')
  .description('Add components to your project')
  .option('-o, --overwrite', 'Overwrite existing files')
  .action(add);

program.parse();
