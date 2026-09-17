import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";
import { detectPackageManager, installDependencies, type PackageManager } from "../utils/pm";
import { getFileNameFromUrl, loadRegistry } from "../utils/registry";
import { syncStyleImports } from "../utils/style-imports";
import { UI_BARREL_INDEX_SOURCE } from "../utils/barrel";

interface InitOptions {
  yes?: boolean;
}

interface LitefyConfig {
  components: {
    path: string;
    installed: string[];
  };
  utils: {
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
const DEPENDENCIES = ["react", "react-dom", "lucide-react", "tailwindcss", "tailwind-merge"];

const CN_TEMPLATE = `import { type ClassNameValue, twMerge } from "tailwind-merge";

export const cn = twMerge;
export type { ClassNameValue };
`;

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

  if (options.yes) {
    parentPath = DEFAULT_PARENT;
  } else {
    const answers = await inquirer.prompt<{
      parentPath: string;
    }>([
      {
        type: "input",
        name: "parentPath",
        message: "Litefy parent directory (ui/litefy will be created inside):",
        default: DEFAULT_PARENT,
      },
    ]);
    parentPath = answers.parentPath;
  }

  const uiRoot = path.join(parentPath, UI_FIXED_SUB);
  const componentsPath = path.join(uiRoot, "components");
  const utilsPath = path.join(uiRoot, "utils");
  const stylesPath = path.join(uiRoot, "styles");

  const config: LitefyConfig = {
    components: {
      path: componentsPath,
      installed: [],
    },
    utils: {
      path: utilsPath,
      installed: [],
    },
    styles: {
      path: stylesPath,
      installed: [],
    },
  };

  await fs.ensureDir(utilsPath);
  const cnFile = path.resolve(cwd, utilsPath, "cn.ts");
  if (!(await fs.pathExists(cnFile))) {
    await fs.writeFile(cnFile, CN_TEMPLATE, "utf-8");
    logger.info("Created utils/cn.ts");
  }
  if (!config.utils.installed.includes("cn")) config.utils.installed.push("cn");

  await writeLitefyConfig(cwd, config);
  logger.success(`Generated ${configPath}`);

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
  if (!(await fs.pathExists(utilIndex))) {
    await fs.writeFile(utilIndex, 'export * from "./cn";\n', "utf-8");
  }
  logger.info("Created components/index.ts barrel skeleton & utils/index.ts exporting cn");

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

  const registry = await loadRegistry();

  const themeEntry = registry["style-theme"];
  if (themeEntry?.type === "css") {
    logger.step("Installing required style: style-theme...");
    try {
      const res = await axios.get<string>(themeEntry.url, { timeout: 10000 });
      await fs.ensureDir(path.resolve(cwd, stylesPath));
      await fs.writeFile(
        path.resolve(cwd, stylesPath, getFileNameFromUrl(themeEntry.url)),
        res.data,
        "utf-8",
      );
      if (!config.styles.installed.includes("style-theme")) {
        config.styles.installed.push("style-theme");
        await writeLitefyConfig(cwd, config);
      }
      logger.success("Installed style-theme");
    } catch (error) {
      logger.warn(error instanceof Error ? error.message : String(error));
      logger.warn("style-theme download failed. Install it later: litefy add style-theme");
    }
  } else {
    logger.warn("style-theme not found in registry. Install it later: litefy add style-theme");
  }

  await syncStyleImports(cwd, stylesPath, config.styles.installed, registry);
  logger.success(`Initialized ${path.posix.join(stylesPath, "index.css")}`);

  const cssImportPath = "@/ui/litefy/styles/index.css";

  console.log(`
┌──────────────────────────────────────────────────────────────────────────────┐
│ Directory layout:                                                             │
│   components: ${componentsPath.padEnd(36)}                                    │
│   utils:      ${utilsPath.padEnd(36)}                                         │
│   styles:     ${stylesPath.padEnd(36)}                                        │
└──────────────────────────────────────────────────────────────────────────────┘


⚠️  Next step: import styles/index.css into your project, otherwise styles will not take effect.


  • JS / TS entry (main.tsx / app.tsx):
    import "${cssImportPath}"


  • HTML entry:
    <link rel="stylesheet" href="${cssImportPath}" />
`);

  logger.info(
    `Optional: add the global interaction layer with "litefy add style-interactive", or implement your own.`,
  );
}

export default init;
