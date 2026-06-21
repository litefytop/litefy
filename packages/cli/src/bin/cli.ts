#!/usr/bin/env node

import { program } from "commander";
import packageJson from "../../package.json";
import add from "../commands/add";
import init from "../commands/init";

program
  .name("litefy")
  .description("Litefy UI - A lightweight React component library and CLI tool")
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize Litefy configuration in your project")
  .option("-y, --yes", "Skip all prompts, use defaults")
  .option("-c, --config <path>", "Path to litefy.json", "./litefy.json")
  .action(init);

program
  .command("add <components...>")
  .description("Add components to your project")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-d, --docs", "Also download documentation (markdown)")
  .option(
    "--components <path>",
    "Override components directory (does not modify config)",
  )
  .action(add);

program.parse();
