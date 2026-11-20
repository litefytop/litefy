import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

/* Mirror every registry URL into packages/cli/sources so the CLI's offline
   fallback (readPkgSource) can serve installs without the CDN. The registry urls
   point at this same repo, so the copy reads the working tree directly.
   The mirror never lingers in the working tree: publish regenerates it via
   prepublishOnly, `--clean` removes it again via postpublish. */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const registryPath = path.join(repoRoot, "packages", "cli", "registry.json");
const sourcesRoot = path.join(repoRoot, "packages", "cli", "sources");

if (process.argv.includes("--clean")) {
  fs.rmSync(sourcesRoot, { recursive: true, force: true });
  console.log("sync-sources: removed packages/cli/sources");
  process.exit(0);
}

const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));

const MARKER = "/litefy@main/";
let copied = 0;
let missing = [];

for (const entry of Object.values(registry)) {
  const urls = entry.files?.length ? entry.files : [entry.url];
  if (entry.skin) urls.push(entry.skin);
  for (const url of urls) {
    const at = url.indexOf(MARKER);
    if (at === -1) continue;
    const repoPath = url.slice(at + MARKER.length);
    const from = path.join(repoRoot, repoPath);
    const to = path.join(sourcesRoot, repoPath);
    if (!fs.existsSync(from)) {
      missing.push(repoPath);
      continue;
    }
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    copied += 1;
  }
}

console.log(`sync-sources: copied ${copied} file(s) into packages/cli/sources`);
if (missing.length) {
  console.error(`sync-sources: missing in repo:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
