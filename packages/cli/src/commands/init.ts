import path from "node:path";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";
import { detectPackageManager, installDependencies, type PackageManager } from "../utils/pm";
import { UI_BARREL_INDEX_SOURCE } from "../utils/barrel";

interface InitOptions {
  yes?: boolean;
}

interface LitefyConfig {
  scheme?: string;
  components: {
    path: string;
    installed: string[];
  };
  utils: {
    path: string;
    installed: string[];
  };
  skins: {
    path: string;
    installed: string[];
  };
  styles: {
    path: string;
    installed: string[];
  };
}

const DEFAULT_PARENT = "./src";
const UI_FIXED_SUB = path.join("ui", "litefy");
const DEPENDENCIES = ["react", "react-dom"];

async function writeLitefyConfig(cwd: string, config: LitefyConfig) {
  const configPath = path.join(cwd, "litefy.json");
  await fs.writeJson(configPath, config, { spaces: 2 });
  return configPath;
}

async function init(options: InitOptions): Promise<void> {
  logger.step("Initializing Litefy configuration...");

  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (await fs.pathExists(configPath)) {
    logger.warn(`litefy.json already exists at ${configPath}`);
    logger.info("Remove the existing file and try again.");
    return;
  }

  let parentPath: string;
  let scheme: string | undefined;

  if (options.yes) {
    parentPath = DEFAULT_PARENT;
  } else {
    const answers = await inquirer.prompt<{
      parentPath: string;
      scheme: string;
    }>([
      {
        type: "input",
        name: "parentPath",
        message: "Litefy parent directory (ui/litefy will be created inside):",
        default: DEFAULT_PARENT,
      },
      {
        type: "list",
        name: "scheme",
        message: "Style scheme (project-wide, can be switched later with -s):",
        choices: [
          { name: "minimal", value: "minimal" },
          { name: "neo-brutalist", value: "neo-brutalist" },
          { name: "neon-gradient", value: "neon-gradient" },
          { name: "clinical", value: "clinical" },
          { name: "None (headless — skeletons only, add styles later)", value: "" },
        ],
        default: "minimal",
      },
    ]);
    parentPath = answers.parentPath;
    scheme = answers.scheme || undefined;
  }

  const uiRoot = path.join(parentPath, UI_FIXED_SUB);
  const componentsPath = path.join(uiRoot, "components");
  const utilsPath = path.join(uiRoot, "utils");
  const skinsPath = path.join(uiRoot, "skins");
  const stylesPath = path.join(uiRoot, "styles");

  const config: LitefyConfig = {
    scheme,
    components: {
      path: componentsPath,
      installed: [],
    },
    utils: {
      path: utilsPath,
      installed: [],
    },
    skins: {
      path: skinsPath,
      installed: [],
    },
    styles: {
      path: stylesPath,
      installed: [],
    },
  };

  await fs.ensureDir(utilsPath);

  await writeLitefyConfig(cwd, config);
  logger.success(`Generated ${configPath}`);
  if (scheme) logger.info(`Scheme set to ${scheme} — every add syncs its index.css automatically.`);

  const baseDir = path.dirname(path.resolve(cwd, componentsPath));
  const barrelIndexTs = path.resolve(baseDir, "index.ts");

  if (!(await fs.pathExists(barrelIndexTs))) {
    await fs.ensureDir(path.dirname(barrelIndexTs));
    await fs.writeFile(barrelIndexTs, UI_BARREL_INDEX_SOURCE, "utf-8");
    logger.info(`Created ${path.relative(cwd, barrelIndexTs)}`);
  } else {
    logger.info(`${path.relative(cwd, barrelIndexTs)} already exists, skipped`);
  }

  const compIndex = path.resolve(cwd, componentsPath, "index.ts");
  await fs.ensureFile(compIndex);
  const utilIndex = path.resolve(cwd, utilsPath, "index.ts");
  await fs.ensureFile(utilIndex);
  const skinIndex = path.resolve(cwd, skinsPath, "index.ts");
  await fs.ensureFile(skinIndex);
  logger.info("Created components/index.ts, utils/index.ts & skins/index.ts barrel skeletons");

  let pm = await detectPackageManager(cwd);
  if (!options.yes) {
    const res = await inquirer.prompt<{ selectedPm: PackageManager }>([
      {
        type: "list",
        name: "selectedPm",
        message: `Detected package manager: ${pm}. Confirm which one to use:`,
        choices: ["npm", "pnpm", "yarn", "bun"] as PackageManager[],
        default: pm,
      },
    ]);
    pm = res.selectedPm;
  }

  logger.info(`Using package manager: ${pm}`);

  logger.step(`Installing ${DEPENDENCIES.join(", ")} with ${pm}...`);
  try {
    await installDependencies(pm, DEPENDENCIES);
    logger.success("Dependencies installed successfully!");
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    logger.warn("Dependency installation failed, please install manually.");
    logger.info(`  ${pm} add ${DEPENDENCIES.join(" ")}`);
  }

  // A scheme picked here travels in litefy.json: every later add syncs its index.css.
  if (scheme) {
    logger.step(`Installing the ${scheme} stylesheet...`);
    try {
      const { styleInstall } = await import("./style");
      await styleInstall(scheme, options);
    } catch (error) {
      logger.warn(
        `Style install failed: ${error instanceof Error ? error.message : String(error)} — run "litefy add style ${scheme}" manually.`,
      );
    }
  } else {
    logger.info(
      "Headless for now. Pick a scheme anytime: litefy add style minimal (or litefy add <component> -s minimal).",
    );
  }

  await fs.ensureDir(stylesPath);
  logger.success(
    `Initialized ${stylesPath} — "litefy add style <scheme>" writes its index.css entry there.`,
  );

  const cssImportPath = "@/ui/litefy/styles/index.css";

  console.log(`
┌──────────────────────────────────────────────────────────────────────────────┐
│ Directory layout:                                                             │
│   components: ${componentsPath.padEnd(36)}                                    │
│   utils:      ${utilsPath.padEnd(36)}                                         │
│   styles:     ${stylesPath.padEnd(36)}                                        │
└──────────────────────────────────────────────────────────────────────────────┘


⚠️  Next step: wire styles/index.css into your Tailwind CSS entry, otherwise styles will not take effect.

  In your Tailwind CSS entry file, import Tailwind first, then the scheme:
    @import "tailwindcss";
    @import "${cssImportPath}";
`);
}

export default init;
