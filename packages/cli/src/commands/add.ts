import path from "node:path";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";
import {
  getFileNameFromUrl,
  loadRegistry,
  resolveRegistryName,
} from "../utils/registry";
import { writeBarrelIndex, writeSkinBarrelIndex } from "../utils/barrel";
import { addSingle, styleInstall } from "./style";
import { detectPackageManager, installDependencies } from "../utils/pm";
import init from "../commands/init";
import packageJson from "../../package.json";

export interface AddOptions {
  overwrite?: boolean;
  yes?: boolean;
  all?: boolean;
  style?: string;
  iconLibrary?: string;
}

interface LitefyConfig {
  version?: string;
  sourceRoot?: string;
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

export type RegistryEntry = {
  type: "component" | "skin" | "hook" | "util" | "css";
  url: string;
  skin?: string;
  files?: string[];
  docs?: string;
  dependence?: string[];
  dependencies?: string[];
  installAs?: string;
  barrel?: false;
};

export function entryFileUrls(entry: RegistryEntry): string[] {
  return entry.files?.length ? entry.files : [entry.url];
}

export type Registry = Record<string, RegistryEntry>;

async function add(selectNames: string[], options: AddOptions): Promise<void> {
  // 样式安装：litefy add style <scheme> [-a]
  if (selectNames[0] === "style") {
    const scheme = selectNames[1] ?? configScheme(process.cwd()) ?? "minimal";
    return styleInstall(scheme, options);
  }
  logger.step(`Preparing to add: ${selectNames.join(", ")}`);

  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.info("litefy.json not found, running init automatically...");
    await init({ yes: true });
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  // Old configs predate the skins lane: default it next to components (posix form —
  // the paths land in litefy.json and are read back cross-platform).
  config.skins =
    config.skins ??
    {
      path: path.posix.join(path.posix.dirname(config.components.path), "skins"),
      installed: [],
    };
  const registry: Registry = await loadRegistry();

  const targetDirFor = (entry: RegistryEntry) =>
    entry.type === "component"
      ? config.components.path
      : entry.type === "skin"
        ? config.skins.path
        : entry.type === "css"
          ? config.styles.path
          : config.utils.path;

  const installedListFor = (entry: RegistryEntry) =>
    entry.type === "component"
      ? config.components.installed
      : entry.type === "skin"
        ? config.skins.installed
        : entry.type === "css"
          ? config.styles.installed
          : config.utils.installed;

  const processed = new Set<string>();
  const queue = [...selectNames];
  let changed = false;

  while (queue.length) {
    const raw = queue.shift()!;
    let name = resolveRegistryName(registry, raw);
    if (!name) {
      logger.error(`Not found in registry: ${raw}`);
      continue;
    }
    // Direct `icons` installs honor --icon-library the same way dependence
    // resolution does (ui/components.md contract).
    if (name === "icons" && options.iconLibrary && options.iconLibrary !== "lucide") {
      const adapterKey = `icons/${options.iconLibrary}`;
      if (!registry[adapterKey]) {
        logger.error(
          `Icon library "${options.iconLibrary}" not found in registry (entry ${adapterKey}). Available: ${
            Object.keys(registry)
              .filter((key) => key.startsWith("icons/"))
              .map((key) => key.slice("icons/".length))
              .join(", ") || "(none)"
          }`,
        );
        continue;
      }
      name = adapterKey;
    }
    if (processed.has(name)) continue;
    processed.add(name);

    const entry = registry[name];
    // `-i` installs an icon adapter explicitly: its landing file `icons.tsx` is
    // overwritable without --overwrite (ui/components.md contract). Bare `icons`
    // installs (dependence resolution without -i) keep skip-if-exists so a
    // hand-written adapter is never clobbered.
    const entryOptions =
      options.iconLibrary && (name === "icons" || name.startsWith("icons/"))
        ? { ...options, overwrite: true }
        : options;
    const result = await addSingle(name, entry, targetDirFor(entry), cwd, entryOptions);
    if (!result.ok) continue;
    changed ||= result.changed;

    const installedList = installedListFor(entry);
    if (!installedList.includes(name)) installedList.push(name);

    // The look ships with the skeleton: drop the skin next to the component's
    // skins dir and record its base for the skins barrel.
    if (entry.skin) {
      const skinEntry: RegistryEntry = { type: "skin", url: entry.skin };
      const skinResult = await addSingle(`${name} skin`, skinEntry, config.skins.path, cwd, options);
      if (skinResult.ok) {
        changed ||= skinResult.changed;
        const skinBase = path.basename(getFileNameFromUrl(entry.skin), path.extname(entry.skin));
        if (!config.skins.installed.includes(skinBase)) config.skins.installed.push(skinBase);
      }
    }

    for (const dep of entry.dependence ?? []) {
      if (processed.has(dep)) continue;
      // Icon adapters: `icons` resolves to `icons/<lib>` when an alternative
      // library is requested (ui/components.md contract). The file lands as
      // `icons.tsx` either way, so skeleton imports stay untouched.
      const depName =
        dep === "icons" && options.iconLibrary && options.iconLibrary !== "lucide"
          ? `icons/${options.iconLibrary}`
          : dep;
      if (!registry[depName]) {
        if (depName !== dep) {
          logger.error(
            `Icon library "${options.iconLibrary}" not found in registry (entry ${depName}). Available: ${Object.keys(registry)
              .filter((key) => key.startsWith("icons/"))
              .map((key) => key.slice("icons/".length))
              .join(", ") || "(none)"}`,
          );
          continue;
        }
        logger.warn(`Dependency "${dep}" of ${name} not found in registry, skip`);
        continue;
      }
      logger.info(`Resolving dependency "${depName}" required by ${name}`);
      queue.push(depName);
    }
  }

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const utilIndex = path.resolve(cwd, config.utils.path, "index.ts");
  await writeBarrelIndex(utilIndex, config.utils.installed);

  const skinsIndex = path.resolve(cwd, config.skins.path, "index.ts");
  await writeSkinBarrelIndex(skinsIndex, config.skins.installed);

  if (options.style) config.scheme = options.style;
  if (changed) config.version = packageJson.version;
  await fs.writeJson(configPath, config, { spaces: 2 });

  await installNpmDependencies(registry, processed, cwd, options);

  // 方案已在配置中（-s 选定或此前 add style 设定）→ 每次 add 自动整包同步样式
  if (config.scheme) {
    try {
      await styleInstall(config.scheme, options);
    } catch (error) {
      logger.warn(
        `Style sync failed: ${error instanceof Error ? error.message : String(error)} — run "litefy add style ${config.scheme}" manually.`,
      );
    }
  } else {
    logger.info(
      "Skeletons have no styles. Pick a scheme: litefy add <component> -s minimal (or litefy add style minimal).",
    );
  }
  logger.success("Process finished.");
}

function configScheme(cwdDir: string): string | undefined {
  try {
    const config = fs.readJsonSync(path.join(cwdDir, "litefy.json")) as LitefyConfig;
    return config.scheme;
  } catch {
    return undefined;
  }
}

/** npm 依赖：按本次安装的 registry 条目收集 dependencies（外部包），去重后入 package.json。 */

async function installNpmDependencies(
  registry: Registry,
  processed: Set<string>,
  cwd: string,
  options: AddOptions,
): Promise<void> {
  const npmDeps = new Set<string>();
  for (const name of processed) {
    for (const dep of registry[name]?.dependencies ?? []) npmDeps.add(dep);
  }
  if (!npmDeps.size) return;

  const pkgJsonPath = path.join(cwd, "package.json");
  if (await fs.pathExists(pkgJsonPath)) {
    const pkgJson = await fs.readJson(pkgJsonPath);
    const have = new Set([
      ...Object.keys(pkgJson.dependencies ?? {}),
      ...Object.keys(pkgJson.devDependencies ?? {}),
    ]);
    for (const dep of npmDeps) {
      if (have.has(dep)) npmDeps.delete(dep);
    }
  }
  if (!npmDeps.size) return;

  const list = [...npmDeps];
  let proceed = true;
  if (!options.yes) {
    const res = await inquirer.prompt<{ ok: boolean }>([
      {
        type: "confirm",
        name: "ok",
        message: `Install npm dependencies: ${list.join(", ")}?`,
        default: true,
      },
    ]);
    proceed = res.ok;
  }

  if (!proceed) {
    logger.info(`Skipped npm dependencies. Install manually with your package manager:`);
    logger.info(`  ${list.join(" ")}`);
    return;
  }

  const pm = await detectPackageManager(cwd);
  logger.step(`Installing npm dependencies with ${pm}: ${list.join(", ")}`);
  try {
    await installDependencies(pm, list);
    logger.success("npm dependencies installed successfully!");
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    logger.warn("npm dependency installation failed, please install manually.");
    logger.info(`  ${pm} add ${list.join(" ")}`);
  }
}


export default add;
