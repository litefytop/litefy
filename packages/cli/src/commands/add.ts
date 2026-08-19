import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry } from "../utils/registry";
import { writeBarrelIndex } from "../utils/barrel";
import init from "../commands/init";

interface AddOptions {
  overwrite?: boolean;
}

interface LitefyConfig {
  sourceRoot: string;
  components: {
    path: string;
    installed: string[];
  };
  hooks: {
    path: string;
    installed: string[];
  };
  styles: {
    path: string;
    installed: string[];
  };
}

export type RegistryEntry = {
  type: "component" | "hook" | "css";
  url: string;
  docs?: string;
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

  const successComponents: string[] = [];
  const successHooks: string[] = [];
  const successStyles: string[] = [];

  for (const name of selectNames) {
    const entry = registry[name];
    if (!entry) {
      logger.error(`Not found in registry: ${name}`);
      continue;
    }

    let ok = false;
    switch (entry.type) {
      case "component":
        ok = await addSingle(name, entry, config.components.path, cwd, options);
        if (ok) successComponents.push(name);
        break;
      case "hook":
        ok = await addSingle(name, entry, config.hooks.path, cwd, options);
        if (ok) successHooks.push(name);
        break;
      case "css":
        ok = await addSingle(name, entry, config.styles.path, cwd, options);
        if (ok) successStyles.push(name);
        break;
    }
  }

  config.components.installed = [
    ...new Set([...config.components.installed, ...successComponents]),
  ];
  config.hooks.installed = [...new Set([...config.hooks.installed, ...successHooks])];
  config.styles.installed = [...new Set([...config.styles.installed, ...successStyles])];

  const compIndex = path.resolve(cwd, config.components.path, "index.ts");
  await writeBarrelIndex(compIndex, config.components.installed);

  const hookIndex = path.resolve(cwd, config.hooks.path, "index.ts");
  await writeBarrelIndex(hookIndex, config.hooks.installed);

  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success("Process finished.");
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
  } catch (e) {
    logger.error(`Download failed ${itemName}: ${e instanceof Error ? e.message : String(e)}`);
    return false;
  }

  return true;
}

export default add;
