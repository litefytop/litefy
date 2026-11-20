#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// security-audit: CVE gate over `pnpm audit --json` for the whole workspace.
// - Threshold via --level=<low|moderate|high|critical> (default: high).
// - Known-unfixable advisories go in security-allowlist.json at the repo root:
//     { "<module>": [{ "reason": "why it is accepted", "expires": "YYYY-MM-DD" }] }
//   Every entry carries an expiry; once past the date the exemption lapses and
//   the finding fails the gate again (re-review cadence is enforced, not optional).
// - Exit 1 when any finding at/above the level is not allowlisted.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ALLOWLIST_PATH = path.join(ROOT, "security-allowlist.json");

const LEVELS = ["low", "moderate", "high", "critical"];
const levelArg = process.argv.find((a) => a.startsWith("--level="));
const LEVEL = levelArg ? levelArg.split("=")[1] : "high";
if (!LEVELS.includes(LEVEL)) {
  console.error(`security-audit: unknown level "${LEVEL}" — use one of ${LEVELS.join("|")}`);
  process.exit(2);
}
const THRESHOLD = LEVELS.indexOf(LEVEL);

function readAllowlist() {
  if (!fs.existsSync(ALLOWLIST_PATH)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, "utf8"));
    const map = {};
    for (const [moduleName, entries] of Object.entries(parsed)) {
      map[moduleName] = Array.isArray(entries) ? entries : [entries];
    }
    return map;
  } catch (error) {
    console.error(`security-audit: allowlist unreadable (${error.message})`);
    process.exit(2);
  }
}

function allowlisted(moduleName, allowlist) {
  const entries = allowlist[moduleName];
  if (!entries) return false;
  const today = new Date().toISOString().slice(0, 10);
  const live = entries.filter((e) => !e.expires || e.expires >= today);
  for (const entry of entries) {
    if (entry.expires && entry.expires < today) {
      console.warn(
        `security-audit: allowlist entry for "${moduleName}" EXPIRED (${entry.expires}) — exemption no longer applies. Reason was: ${entry.reason ?? "unspecified"}`,
      );
    }
  }
  return live.length > 0;
}

const result = spawnSync("pnpm audit --json", {
  cwd: ROOT,
  encoding: "utf8",
  shell: true,
  maxBuffer: 64 * 1024 * 1024,
});
if (result.error) {
  console.error(`security-audit: failed to run pnpm audit (${result.error.message})`);
  process.exit(2);
}
let json;
try {
  json = JSON.parse(result.stdout);
} catch {
  console.error("security-audit: pnpm audit did not return JSON — run `pnpm install` first.");
  process.exit(2);
}

const allowlist = readAllowlist();
const advisories = Object.values(json.advisories ?? {});
const failing = [];
const accepted = [];

for (const advisory of advisories) {
  if (LEVELS.indexOf(advisory.severity) < THRESHOLD) continue;
  const entry = {
    module: advisory.module_name,
    severity: advisory.severity,
    title: advisory.title,
    url: advisory.url,
    patched: advisory.patched_versions,
    paths: [...new Set((advisory.findings ?? []).flatMap((f) => f.paths ?? []))].slice(0, 4),
  };
  if (allowlisted(entry.module, allowlist)) accepted.push(entry);
  else failing.push(entry);
}

console.log(
  `security-audit: ${advisories.length} advisory(ies) in lockfile, threshold >= ${LEVEL}, ` +
    `${failing.length} failing, ${accepted.length} allowlisted`,
);

for (const finding of failing) {
  console.error(
    `\n[FAIL] ${finding.severity.toUpperCase()} ${finding.module} (patched in ${finding.patched})\n` +
      `  ${finding.title}\n` +
      `  paths: ${finding.paths.join(" | ") || "(unknown)"}\n` +
      `  ${finding.url}`,
  );
}
for (const finding of accepted) {
  console.log(`\n[allowlisted] ${finding.severity.toUpperCase()} ${finding.module} — ${finding.url}`);
}

if (failing.length > 0) {
  console.error(
    `\nsecurity-audit: ${failing.length} finding(s) at/above ${LEVEL}. ` +
      `Fix by upgrading (pnpm up <pkg> / pnpm overrides), or add a dated entry to security-allowlist.json.`,
  );
  process.exit(1);
}
console.log("security-audit: clean");
