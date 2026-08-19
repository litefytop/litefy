import path from "node:path";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";

interface LitefyConfig {
  components: { path: string };
  hooks: { path: string };
  styles: { path: string };
}

export async function uninstall() {
  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.warn("litefy.json not found, nothing to uninstall");
    return;
  }

  const answer = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message:
        "Are you sure to uninstall Litefy from this project?\nThis will DELETE components/hooks/styles directories and litefy.json. Continue?",
      default: false,
    },
  ]);

  if (!answer.confirm) {
    logger.info("Uninstall cancelled");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;

  const compDir = path.resolve(cwd, config.components.path);
  const hookDir = path.resolve(cwd, config.hooks.path);
  const styleDir = path.resolve(cwd, config.styles.path);

  if (await fs.pathExists(compDir)) await fs.remove(compDir);
  if (await fs.pathExists(hookDir)) await fs.remove(hookDir);
  if (await fs.pathExists(styleDir)) await fs.remove(styleDir);

  await fs.remove(configPath);

  logger.success("Litefy project local artifacts uninstalled complete");
  logger.info("Note: npm package is NOT removed, run `npm remove litefy` for npm uninstall");
}

export default uninstall;
