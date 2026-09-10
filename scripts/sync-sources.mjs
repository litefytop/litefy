import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const registryPath = path.join(repoRoot, "packages", "cli", "registry.json");
const sourcesRoot = path.join(repoRoot, "packages", "cli", "sources");
const marker = "jsdelivr.net/gh/";

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

fs.rmSync(sourcesRoot, { recursive: true, force: true });

let count = 0;
for (const [name, entry] of Object.entries(registry)) {
  const url = entry.url;
  const index = url.indexOf(marker);
  if (index === -1) {
    console.warn(`skip ${name}: url is not a jsdelivr gh url`);
    continue;
  }
  const rest = url.slice(index + marker.length);
  const at = rest.indexOf("@");
  const slash = rest.indexOf("/", at);
  if (at === -1 || slash === -1) {
    console.warn(`skip ${name}: cannot parse repo path from url`);
    continue;
  }
  const repoPath = rest.slice(slash + 1);
  const src = path.join(repoRoot, repoPath);
  const dest = path.join(sourcesRoot, repoPath);
  if (!fs.existsSync(src)) {
    console.warn(`skip ${name}: source not found at ${repoPath}`);
    continue;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  count++;
}

console.log(`Synced ${count}/${Object.keys(registry).length} entries to packages/cli/sources`);
