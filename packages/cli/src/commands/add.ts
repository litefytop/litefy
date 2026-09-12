import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import inquirer from "inquirer";
import logger from "../utils/logger";
import {
  getFileNameFromUrl,
  loadRegistry,
  readPkgSource,
  resolveRegistryName,
} from "../utils/registry";
import { writeBarrelIndex } from "../utils/barrel";
import { syncStyleImports } from "../utils/style-imports";
import { detectPackageManager, installDependencies } from "../utils/pm";
import init from "../commands/init";

interface AddOptions {
  overwrite?: boolean;
  yes?: boolean;
}

interface LitefyConfig {
  sourceRoot: string;
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

export type RegistryEntry = {
  type: "component" | "hook" | "util" | "css";
  url: string;
  docs?: string;
  dependence?: string[];
  dependencies?: string[];
};

export type Registry = Record<string, RegistryEntry>;

async function add(selectNames: string[], options: AddOptions): Promise<void> {
  logger.step(`Preparing to add: ${selectNames.join(", ")}`);

  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");

  if (!(await fs.pathExists(configPath))) {
    logger.info("litefy.json not found, running init automatically...");
    await init({ yes: true });
  }

  const config = (await fs.readJson(configPath)) as LitefyConfig;
  const registry: Registry = await loadRegistry();

  const targetDirFor = (entry: RegistryEntry) =>
    entry.type === "component"
      ? config.components.path
      : entry.type === "css"
        ? config.styles.path
        : config.utils.path;

  const installedListFor = (entry: RegistryEntry) =>
    entry.type === "component"
      ? config.components.installed
      : entry.type === "css"
        ? config.styles.installed
        : config.utils.installed;

  const processed = new Set<string>();
  const queue = [...selectNames];

  while (queue.length) {
    const raw = queue.shift()!;
    const name = resolveRegistryName(registry, raw);
    if (!name) {
      logger.error(`Not found in registry: ${raw}`);
      continue;
    }
    if (processed.has(name)) continue;
    processed.add(name);

    const entry = registry[name];
    const ok = await addSingle(name, entry, targetDirFor(entry), cwd, options);
    if (!ok) continue;

    const installedList = installedListFor(entry);
    if (!installedList.includes(name)) installedList.push(name);

    for (const dep of entry.dependence ?? []) {
      if (processed.has(dep)) continue;
      if (!registry[dep]) {
        logger.warn(`Dependency "${dep}" of ${name} not found in registry, skip`);
        continue;
      }
      logger.info(`Resolving dependency "${dep}" required by ${name}`);
      queue.push(dep);
    }
  }

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const utilIndex = path.resolve(cwd, config.utils.path, "index.ts");
  await writeBarrelIndex(utilIndex, config.utils.installed);

  await syncStyleImports(cwd, config.styles.path, config.styles.installed, registry);

  await fs.writeJson(configPath, config, { spaces: 2 });

  await installNpmDependencies(registry, processed, cwd, options);
  logger.success("Process finished.");
}

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

export async function addSingle(
  itemName: string,
  entry: RegistryEntry,
  relTargetDir: string,
  cwd: string,
  options: AddOptions,
): Promise<boolean> {
  const targetDir = path.resolve(cwd, relTargetDir);
  await fs.ensureDir(targetDir);

  const fileName = getFileNameFromUrl(entry.url);
  const outFile = path.join(targetDir, fileName);
  const exists = await fs.pathExists(outFile);

  if (exists && !options.overwrite) {
    logger.warn(`${fileName} exists, skip. Use --overwrite to replace.`);
    return true;
  }

  logger.step(`Download ${itemName} → ${path.relative(cwd, outFile)}`);
  try {
    const res = await axios.get<string>(entry.url, { timeout: 10000 });
    await fs.writeFile(outFile, res.data, "utf-8");
    logger.success(`Saved ${fileName}`);
  } catch {
    const pkgSource = await readPkgSource(entry);
    if (pkgSource !== null) {
      await fs.writeFile(outFile, pkgSource, "utf-8");
      logger.success(`Saved ${fileName} (from package sources)`);
      return true;
    }
    logger.error(`Download failed ${itemName}: CDN unreachable and no package source fallback`);
    return false;
  }

  return true;
}

export default add;
