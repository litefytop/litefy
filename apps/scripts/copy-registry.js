import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcComponentDir = path.resolve(__dirname, '../src/component/ui');
const srcDocsDir = path.resolve(__dirname, '../src/docs');
const destComponentDir = path.resolve(__dirname, '../public/registry/ui');
const destDocsDir = path.resolve(__dirname, '../public/registry/docs');
const allowedExtensions = ['.tsx', '.ts', '.css', '.module.css', '.json', '.md'];

function getVersion() {
  if (process.env.VERSION) return process.env.VERSION;
  try {
    const tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    if (tag) return tag;
  } catch {
    return 'main';
  }
  return 'main';
}

async function copyDir(src, dest, filterExts) {
  await fs.ensureDir(dest);
  await fs.copy(src, dest, {
    filter: (srcPath) => {
      if (srcPath.includes('node_modules')) return false;
      const ext = path.extname(srcPath);
      if (ext === '') return true;
      return filterExts.includes(ext);
    },
  });
}

async function generateRegistry() {
  const registryRoot = path.resolve(__dirname, '../public/registry.json');
  const uiFiles = await fs.readdir(destComponentDir);
  const version = getVersion();
  const registry = {};
  for (const file of uiFiles) {
    const name = path.basename(file, '.tsx');
    registry[name] = {
      url: `https://cdn.jsdelivr.net/gh/litefytop/litefy@${version}/apps/public/registry/ui/${file}`,
      docs: `https://cdn.jsdelivr.net/gh/litefytop/litefy@${version}/apps/public/registry/docs/${name}.md`,
    };
  }
  await fs.writeJson(registryRoot, registry, { spaces: 2 });
  console.log(`Generated registry.json with version ${version}`);
}

async function copyRegistry() {
  const registryRoot = path.resolve(__dirname, '../public/registry');
  await fs.emptyDir(registryRoot);
  console.log(`Cleared target directory: ${registryRoot}`);
  await copyDir(srcComponentDir, destComponentDir, allowedExtensions);
  console.log(`Component source code copied to: ${destComponentDir}`);
  await copyDir(srcDocsDir, destDocsDir, allowedExtensions);
  console.log(`Docs copied to: ${destDocsDir}`);
  await generateRegistry();
}

copyRegistry();
