import crossSpawn from "cross-spawn";
import { detect } from "@antfu/ni";

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export async function detectPackageManager(cwd: string): Promise<PackageManager> {
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

  return "npm";
}

export function getInstallCommand(pm: PackageManager): {
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

export function installDependencies(pm: PackageManager, packages: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const { cmd, args } = getInstallCommand(pm);
    const child = crossSpawn(cmd, [...args, ...packages], {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Installation failed with code ${code}`));
    });

    child.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "ENOENT") {
        reject(
          new Error(`Package manager "${pm}" was not found on system. Please install it first.`),
        );
      } else {
        reject(err);
      }
    });
  });
}
