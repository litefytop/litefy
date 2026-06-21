import { spawn } from "node:child_process";
import path from "node:path";
import { detect } from "@antfu/ni";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";

interface InitOptions {
  yes?: boolean;
  config?: string;
  pm?: "npm" | "yarn" | "pnpm" | "bun";
}

interface LitefyConfig {
  components: string;
  installed: string[];
}

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

async function detectPackageManager(
  cwd: string,
  explicit?: PackageManager,
): Promise<PackageManager> {
  if (explicit) return explicit;

  const detected = await detect({ programmatic: true, cwd });

  if (detected === "yarn@berry" || detected === "yarn") return "yarn";
  if (detected === "pnpm@6" || detected === "pnpm") return "pnpm";
  if (detected === "bun") return "bun";

  if (!detected) {
    const userAgent = process.env.npm_config_user_agent || "";
    if (userAgent.startsWith("yarn")) return "yarn";
    if (userAgent.startsWith("pnpm")) return "pnpm";
    if (userAgent.startsWith("bun")) return "bun";
  }

  return (detected as PackageManager) ?? "npm";
}

function getInstallCommand(pm: PackageManager): {
  cmd: string;
  args: string[];
} {
  switch (pm) {
    case "yarn":
      return { cmd: "yarn", args: ["add"] };
    case "pnpm":
      return { cmd: "pnpm", args: ["add"] };
    case "bun":
      return { cmd: "bun", args: ["add"] };
    default:
      return { cmd: "npm", args: ["install", "--save"] };
  }
}

function installDependencies(
  pm: PackageManager,
  packages: string[],
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { cmd, args } = getInstallCommand(pm);
    const child = spawn(cmd, [...args, ...packages], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Installation failed with code ${code}`));
    });

    child.on("error", (err) => reject(err));
  });
}

async function init(options: InitOptions): Promise<void> {
  logger.step("Initializing Litefy configuration...");

  const cwd = process.cwd();
  const configPath = options.config
    ? path.resolve(cwd, options.config)
    : path.join(cwd, "litefy.json");

  if (await fs.pathExists(configPath)) {
    logger.warn(`litefy.json already exists at ${configPath}`);
    logger.info(
      "Use -c to specify a different path, or remove the existing file.",
    );
    return;
  }

  let config: LitefyConfig;

  if (options.yes) {
    config = {
      components: "./src/ui",
      installed: [],
    };
  } else {
    const answers = await inquirer.prompt<{ componentsPath: string }>([
      {
        type: "input",
        name: "componentsPath",
        message: "Components directory path:",
        default: "./src/ui",
      },
    ]);
    config = {
      components: answers.componentsPath,
      installed: [],
    };
  }

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success(`Initialization complete! Generated ${configPath}`);

  const pm = await detectPackageManager(cwd, options.pm);
  logger.info(`Detected package manager: ${pm}`);

  let shouldInstall = true;
  if (!options.yes) {
    const answer = await inquirer.prompt<{ install: boolean }>([
      {
        type: "confirm",
        name: "install",
        message: `Install dependencies (lucide-react, tailwind-merge) using ${pm}?`,
        default: true,
      },
    ]);
    shouldInstall = answer.install;
  }

  if (shouldInstall) {
    logger.step(`Installing lucide-react and tailwind-merge with ${pm}...`);
    try {
      await installDependencies(pm, ["lucide-react", "tailwind-merge"]);
      logger.success("Dependencies installed successfully!");
    } catch (error) {
      logger.error(error instanceof Error ? error.message : String(error));
      logger.error(`Installation failed`);
      logger.warn("You can install them manually later:");
      logger.info(`  ${pm} add lucide-react tailwind-merge`);
    }
  } else {
    logger.info("Skipped dependency installation.");
    logger.info(
      `You can install them later with: ${pm} add lucide-react tailwind-merge`,
    );
  }

  logger.info("Run `litefy add <component>` to add components");
}

export default init;
