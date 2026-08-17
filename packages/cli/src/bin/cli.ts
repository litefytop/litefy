#!/usr/bin/env node

import { program,Option } from "commander";
import packageJson from "../../package.json";
import add from "../commands/add";
import init from "../commands/init";
import rm from "../commands/rm";

program
  .name("litefy")
  .description("Litefy UI - A lightweight React component library and CLI tool")
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize Litefy configuration in your project")
  .option("-y, --yes", "Skip prompts, use default values")
  .addOption(
    new Option("--pm <pm>", "Specify package manager")
      .choices(["npm", "yarn", "pnpm", "bun"])
  )
  .action((opts) => {
    init({
      yes: opts.yes,
      pm: opts.pm,
    });
  });

program
  .command("add <components...>")
  .description("Add components to your project")
  .option("-o, --overwrite", "Overwrite existing files")
  .action(add);

program
  .command("rm <components...>")
  .description("Remove installed components")
  .action(async (components: string[]) => {
    await rm(components);
  });

program.parse();
