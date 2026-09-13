import path from "node:path";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";
import { UI_BARREL_INDEX_SOURCE } from "../utils/barrel";

interface LitefyConfig {
  components: { path: string };
  utils: { path: string };
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
        "Are you sure to uninstall Litefy from this project?\nThis will DELETE the whole ui/litefy directory (components, utils, styles) and litefy.json. Continue?",
      default: false,
    },
  ]);

  if (!answer.confirm) {
    logger.info("Uninstall cancelled");
    return;
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;

  const compDir = path.resolve(cwd, config.components.path);
  const utilDir = path.resolve(cwd, config.utils.path);
  const styleDir = path.resolve(cwd, config.styles.path);

  if (await fs.pathExists(compDir)) await fs.remove(compDir);
  if (await fs.pathExists(utilDir)) await fs.remove(utilDir);
  if (await fs.pathExists(styleDir)) await fs.remove(styleDir);

  await fs.remove(configPath);

  await cleanupGeneratedBarrels(cwd, [compDir, utilDir, styleDir]);

  logger.success("Litefy project local artifacts uninstalled complete");
  logger.info("Note: npm package is NOT removed, run `npm remove litefy` for npm uninstall");
}

// init also generates a top-level barrel (e.g. src/ui/litefy/index.ts) outside the
// configured directories; sweep it and the empty directories it leaves behind.
async function cleanupGeneratedBarrels(cwd: string, dirs: string[]) {
  const roots = new Set(dirs.map((d) => path.dirname(d)));

  for (const root of roots) {
    if (!isInside(cwd, root) || !(await fs.pathExists(root))) continue;

    const barrelPath = path.join(root, "index.ts");
    if (
      (await fs.pathExists(barrelPath)) &&
      (await fs.readFile(barrelPath, "utf8")) === UI_BARREL_INDEX_SOURCE
    ) {
      await fs.remove(barrelPath);
      logger.info(`Removed generated barrel ${path.relative(cwd, barrelPath)}`);
    }

    const entries = await fs.readdir(root);
    if (entries.length === 0) {
      await fs.remove(root);
      logger.info(`Removed empty directory ${path.relative(cwd, root)}`);
      await removeEmptyAncestors(cwd, path.dirname(root));
      continue;
    }

    // ui/litefy is init's tool-owned namespace, so it may be wiped whole once the
    // developer confirms; any other root (e.g. hand-edited litefy.json paths) only
    // ever loses generated files.
    if (isLitefyNamespaceRoot(root) && (await confirmStrayDelete(cwd, root, entries))) {
      await fs.remove(root);
      logger.info(`Removed ${path.relative(cwd, root)} and its remaining files`);
      await removeEmptyAncestors(cwd, path.dirname(root));
    } else {
      logger.warn(
        `Kept ${path.relative(cwd, root)}, it still contains non-Litefy files: ${entries.join(", ")}`,
      );
    }
  }
}

// init hardcodes the tool-owned namespace as <parent>/ui/litefy; nothing else
// qualifies for whole-directory deletion.
function isLitefyNamespaceRoot(root: string): boolean {
  return path.basename(root) === "litefy" && path.basename(path.dirname(root)) === "ui";
}

async function confirmStrayDelete(
  cwd: string,
  root: string,
  entries: string[],
): Promise<boolean> {
  const answer = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: `${path.relative(cwd, root)} also contains non-Litefy files:\n  ${entries.join(", ")}\nDelete them as well?`,
      default: false,
    },
  ]);
  return answer.confirm;
}

// Drop parents of `dir` up to (not including) cwd while they are empty.
async function removeEmptyAncestors(cwd: string, dir: string) {
  let current = dir;
  while (isInside(cwd, current) && (await fs.pathExists(current))) {
    if ((await fs.readdir(current)).length > 0) return;
    await fs.remove(current);
    logger.info(`Removed empty directory ${path.relative(cwd, current)}`);
    current = path.dirname(current);
  }
}

function isInside(cwd: string, dir: string): boolean {
  const rel = path.relative(cwd, dir);
  return rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel);
}

export default uninstall;
