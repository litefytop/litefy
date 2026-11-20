#!/usr/bin/env node

import { program } from "commander";
import packageJson from "../../package.json";
import add from "../commands/add";
import install from "../commands/install";
import init from "../commands/init";
import rm from "../commands/rm";
import { repair } from "../commands/repair";
import { clean } from "../commands/clean";
import { uninstall } from "../commands/uninstall";

program
  .name("litefy")
  .description("Litefy UI - A lightweight React component library and CLI tool")
  .version(packageJson.version);

program
  .command("init")
  .description("Initialize Litefy configuration in your project (headless skeleton only — styles install via `add`)")
  .option("-y, --yes", "Skip prompts, use default values")
  .action((opts) => {
    init({
      yes: opts.yes,
    });
  });

program
  .command("add <components...>")
  .description("Add components (skeletons) to your project — or a scheme stylesheet with: add style <scheme>")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-y, --yes", "Skip prompts (auto-install npm dependencies)")
  .option("-a, --all", "Accepted for compatibility; styles always install the complete set")
  .option("-s, --style <scheme>", "Pick a style scheme; its complete stylesheet re-syncs on every add afterwards")
  .option("-i, --icon-library <lib>", "Icon adapter to install instead of the default lucide set (e.g. tabler)")
  .action(async (components: string[], opts) => {
    await add(components, opts);
  });

program
  .command("install")
  .description("Install every component, hook, util, and style from the registry")
  .option("-o, --overwrite", "Overwrite existing files")
  .option("-y, --yes", "Skip prompts (auto-install npm dependencies)")
  .option("-i, --icon-library <lib>", "Icon adapter to install instead of the default lucide set (e.g. tabler)")
  .action(async (opts) => {
    await install(opts);
  });

program
  .command("rm <names...>")
  .description("Remove specified components/hooks")
  .action(async (names: string[]) => await rm(names));

program
  .command("repair")
  .description("Repair: restore missing component/hook files (needs network)")
  .action(async () => await repair());

program
  .command("clean")
  .description("Clean: offline prune invalid entries from config, no network")
  .action(async () => await clean());

program
  .command("uninstall")
  .description("Uninstall: remove all local litefy files and litefy.json (dangerous)")
  .action(async () => await uninstall());

program.parse();
