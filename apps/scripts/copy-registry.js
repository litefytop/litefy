import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcComponentDir = path.resolve(__dirname, '../src/component/ui');
const srcDocsDir = path.resolve(__dirname, '../src/docs');
const destComponentDir = path.resolve(__dirname, '../public/registry/ui');
const destDocsDir = path.resolve(__dirname, '../public/registry/docs');
const allowedExtensions = ['.tsx', '.ts', '.css', '.module.css', '.json', '.md'];

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

async function copyRegistry() {
  const registryRoot = path.resolve(__dirname, '../public/registry');
  await fs.emptyDir(registryRoot);
  console.log(`Cleared target directory: ${registryRoot}`);
  await copyDir(srcComponentDir, destComponentDir, allowedExtensions);
  console.log(`Component source code copied to: ${destComponentDir}`);
  await copyDir(srcDocsDir, destDocsDir, allowedExtensions);
  console.log(`Docs copied to: ${destDocsDir}`);
}

copyRegistry();
