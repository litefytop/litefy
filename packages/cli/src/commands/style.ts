import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";
import { getFileNameFromUrl, loadRegistry, readPkgSource } from "../utils/registry";
import {
  entryFileUrls,
  type AddOptions,
  type Registry,
  type RegistryEntry,
} from "./add";

export { entryFileUrls, type Registry, type RegistryEntry };
import init from "./init";
import packageJson from "../../package.json";

interface LitefyConfig {
  version?: string;
  scheme?: string;
  components: {
    path: string;
    installed: string[];
  };
  utils: {
    path: string;
    installed: string[];
  };
  skins?: {
    path: string;
    installed: string[];
  };
  styles: {
    path: string;
    installed: string[];
  };
}

export interface InstallResult {
  ok: boolean;
  changed: boolean;
}

export async function addSingle(
  itemName: string,
  entry: RegistryEntry,
  relTargetDir: string,
  cwd: string,
  options: AddOptions,
): Promise<InstallResult> {
  const targetDir = path.resolve(cwd, relTargetDir);
  await fs.ensureDir(targetDir);

  let ok = true;
  let changed = false;
  for (const url of entryFileUrls(entry)) {
    const fileName = entry.installAs ?? getFileNameFromUrl(url);
    const outFile = path.join(targetDir, fileName);
    const exists = await fs.pathExists(outFile);

    if (exists && !options.overwrite) {
      logger.warn(`${fileName} exists, skip. Use --overwrite to replace.`);
      continue;
    }

    logger.step(`Download ${itemName} → ${path.relative(cwd, outFile)}`);
    try {
      const res = await axios.get<string>(url, { timeout: 10000 });
      await fs.writeFile(outFile, res.data, "utf-8");
      changed = true;
      logger.success(`Saved ${fileName}`);
    } catch {
      const pkgSource = await readPkgSource(url);
      if (pkgSource !== null) {
        await fs.writeFile(outFile, pkgSource, "utf-8");
        changed = true;
        logger.success(`Saved ${fileName} (from package sources)`);
        continue;
      }
      logger.error(`Download failed ${itemName}: CDN unreachable and no package source fallback`);
      ok = false;
    }
  }

  return { ok, changed };
}

export async function styleInstall(scheme: string, options: AddOptions): Promise<void> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, "litefy.json");
  if (!(await fs.pathExists(configPath))) {
    logger.info("litefy.json not found, running init automatically...");
    await init({ yes: true });
  }
  const config = (await fs.readJson(configPath)) as LitefyConfig;
  config.scheme = scheme;
  const registry: Registry = await loadRegistry();

  const prefix = `style/${scheme}/`;
  const baseKey = `${prefix}base`;
  const presetKey = `${prefix}preset`;
  if (!registry[baseKey]) {
    logger.error(`Style scheme not found in registry: ${scheme}`);
    return;
  }

  // 样式整包安装：方案是自洽单位，因此 preset 就是唯一的安装单位——它现在是该方案唯一
  // 的 `index.css`（令牌 + base + @theme + 变体 + @utility）。`options.all` 仍被接受但
  // 已无差别，整包即默认行为。
  const entry = registry[presetKey] ?? registry[baseKey];
  const fileNames = entryFileUrls(entry).map((url) => getFileNameFromUrl(url));
  logger.step(`Installing scheme "${scheme}": complete stylesheet (${fileNames.length} file(s))`);

  // 方案排他：index.css 永远等于当前方案的最新内容，切换与自动同步都强制覆盖。
  const result = await addSingle(presetKey, entry, config.styles.path, cwd, { ...options, overwrite: true });
  if (!result.ok) return;

  // 唯一出口：最后 add 的方案就是 styles/index.css 的全部来源——替换之前所有方案记录，杜绝混用。
  config.styles.installed = [presetKey];
  if (result.changed) config.version = packageJson.version;

  // 方案是纯主题层，不是入口：用户须在自己的 Tailwind 入口先 @import "tailwindcss" 再
  // @import 这份 index.css（tailwind 在前），扫描归用户入口，CLI 不改写任何路径。
  await fs.writeJson(configPath, config, { spaces: 2 });
  logger.success(`Scheme "${scheme}" styles installed into ${config.styles.path}.`);
  logger.info(`Import it into your Tailwind CSS entry after @import "tailwindcss" (Tailwind first).`);
}
