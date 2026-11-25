import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const skillDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(skillDir, "../../..");
const rel = (file) => path.relative(root, file).split(path.sep).join("/");
const timestamp = new Date().toISOString().replaceAll(":", "-").replace(".", "-");
const rawPath = path.join(root, `temp/class-length-${timestamp}.txt`);
const analysisPath = path.join(root, `temp/class-analysis-${timestamp}.txt`);

const result = spawnSync(process.execPath, [path.join(skillDir, "check-class-length.mjs"), "--all"], {
  cwd: root,
  encoding: "utf8",
  maxBuffer: 20 * 1024 * 1024,
});
if (result.error) {
  console.error(result.error);
  process.exit(1);
}

const report = result.stdout;
fs.writeFileSync(rawPath, report + result.stderr);

const units = [];
let current = null;
for (const line of report.split(/\r?\n/)) {
  const match = line.match(/^### (\d+)\s+(\S+):(\d+)\s+(.+)$/);
  if (match) {
    current = { length: Number(match[1]), file: match[2], line: Number(match[3]), label: match[4] };
    units.push(current);
    continue;
  }
  if (current && line.trim() && !line.startsWith("#") && !line.startsWith("[")) {
    current.text = line.trim();
    current = null;
  }
}
const classUnits = units.filter((unit) => unit.text);
const locationCount = (items) => new Set(items.map((item) => `${item.file}:${item.line}`)).size;
const output = [];
const log = (line = "") => output.push(line);

log(`# class 分析 — ${timestamp}`);
log(`原始报告：${rel(rawPath)}`);
log(report.split(/\r?\n/)[1]);

const full = new Map();
for (const unit of classUnits) {
  const items = full.get(unit.text) ?? [];
  items.push(unit);
  full.set(unit.text, items);
}
log(`\nIDENTICAL FULL STRINGS (unique strings: ${full.size})`);
for (const [text, items] of [...full].sort((a, b) => b[1].length - a[1].length || b[0].length - a[0].length).slice(0, 20)) {
  const locations = [...new Set(items.map((unit) => `${unit.file}:${unit.line}`))];
  log(`${items.length} units / ${locations.length} locations / ${text.length} chars / ${text.split(" ").length} tokens | ${locations.join(", ")}`);
  log(`  ${text}`);
}

const grams = new Map();
for (const unit of classUnits) {
  const tokens = unit.text.split(" ");
  for (let size = 4; size >= 2; size -= 1) {
    for (let index = 0; index + size <= tokens.length; index += 1) {
      const gram = tokens.slice(index, index + size).join(" ");
      const items = grams.get(gram) ?? [];
      items.push(unit);
      grams.set(gram, items);
    }
  }
}
log("\nREPEATED ADJACENT N-GRAMS (>=4 tokens, >=3 distinct locations)");
const repeatedGrams = [...grams]
  .filter(([gram, items]) => gram.split(" ").length >= 4 && locationCount(items) >= 3)
  .sort((a, b) => locationCount(b[1]) - locationCount(a[1]) || b[0].length - a[0].length)
  .slice(0, 40);
for (const [gram, items] of repeatedGrams) {
  log(`${locationCount(items)} loc / ${items.length} units | ${gram}`);
}

const tokens = new Map();
for (const unit of classUnits) {
  for (const token of new Set(unit.text.split(" "))) {
    const items = tokens.get(token) ?? [];
    items.push(unit);
    tokens.set(token, items);
  }
}
log("\nTOP INDIVIDUAL TOKENS");
for (const [token, items] of [...tokens].sort((a, b) => b[1].length - a[1].length).slice(0, 35)) {
  log(`${locationCount(items)} loc | ${token}`);
}

const schemeNames = ["minimal", "neo-brutalist", "flat-minimal", "neon-gradient"];
const cssFiles = schemeNames.map((scheme) => path.join(root, `app/ui/schemes/${scheme}/index.css`));
const definitions = new Map();
for (const file of cssFiles) {
  for (const match of fs.readFileSync(file, "utf8").matchAll(/^@utility\s+([\w-]+)/gm)) {
    const schemes = definitions.get(match[1]) ?? [];
    schemes.push(path.basename(path.dirname(file)));
    definitions.set(match[1], schemes);
  }
}
const usage = new Map();
const sources = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(ts|tsx|mdx)$/.test(entry.name)) sources.push(file);
  }
}
walk(path.join(root, "app/ui"));
for (const file of sources) {
  const words = fs.readFileSync(file, "utf8").split(/[^A-Za-z0-9_-]+/);
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  for (const name of definitions.keys()) {
    const count = counts.get(name) ?? 0;
    if (!count) continue;
    const items = usage.get(name) ?? [];
    items.push({ file: rel(file), count });
    usage.set(name, items);
  }
}
log(`\nUTILITIES unique=${definitions.size} definitions=${[...definitions.values()].reduce((sum, schemes) => sum + schemes.length, 0)}`);
for (const [name, schemes] of [...definitions].sort((a, b) => {
  const countA = usage.get(a[0])?.reduce((sum, item) => sum + item.count, 0) ?? 0;
  const countB = usage.get(b[0])?.reduce((sum, item) => sum + item.count, 0) ?? 0;
  return countB - countA;
})) {
  const items = usage.get(name) ?? [];
  log(`${name} | schemes=${schemes.length} | code refs=${items.reduce((sum, item) => sum + item.count, 0)} | files=${items.length}`);
}

fs.writeFileSync(analysisPath, `${output.join("\n")}\n`);
console.log(`原始报告：${rel(rawPath)}`);
console.log(`分析报告：${rel(analysisPath)}`);
process.exit(result.status ?? 1);
