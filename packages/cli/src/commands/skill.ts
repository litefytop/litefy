import path from "node:path";
import axios from "axios";
import fs from "fs-extra";
import logger from "../utils/logger";
import { PKG_ROOT } from "../utils/registry";

interface SkillOptions {
  dir?: string;
  overwrite?: boolean;
}

const SKILL_REPO_DIR = ".agents/skills/litefy-design";
const SKILL_FILES = ["SKILL.md", "CHANGELOG.md", "scripts/design-detect.mjs"];
async function fetchSkillFile(repoPath: string): Promise<string | null> {
  try {
    const res = await axios.get<string>(
      `https://cdn.jsdelivr.net/gh/litefytop/litefy@main/${repoPath}`,
      { timeout: 10000 },
    );
    return res.data;
  } catch {
    const localPath = path.join(PKG_ROOT, "sources", repoPath);
    if (await fs.pathExists(localPath)) return fs.readFile(localPath, "utf-8");
    return null;
  }
}

async function skill(options: SkillOptions): Promise<void> {
  const cwd = process.cwd();
  const targetRoot = path.resolve(cwd, options.dir ?? path.join(".claude", "skills", "litefy-design"));

  let failed = 0;
  for (const rel of SKILL_FILES) {
    const outFile = path.join(targetRoot, rel);
    if ((await fs.pathExists(outFile)) && !options.overwrite) {
      logger.warn(`${rel} exists, skip. Use --overwrite to replace.`);
      continue;
    }
    logger.step(`Install ${rel} -> ${path.relative(cwd, outFile)}`);
    const content = await fetchSkillFile(`${SKILL_REPO_DIR}/${rel}`);
    if (content === null) {
      logger.error(`Failed to fetch ${rel}: CDN unreachable and no package source fallback`);
      failed++;
      continue;
    }
    await fs.ensureDir(path.dirname(outFile));
    await fs.writeFile(outFile, content, "utf-8");
    logger.success(`Saved ${rel}`);
  }

  if (failed) {
    process.exitCode = 1;
    logger.error(`${failed} skill file(s) failed to install`);
    return;
  }

  const detect = path.relative(cwd, path.join(targetRoot, "scripts", "design-detect.mjs"));
  logger.success("litefy-design skill installed.");
  logger.info(`Run the validator against your source root, e.g: node ${detect} src`);
}

export default skill;
