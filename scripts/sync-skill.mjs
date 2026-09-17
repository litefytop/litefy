import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const src = path.resolve(__dirname, "../.agents/skills/litefy-design/SKILL.md");
const dest = path.resolve(__dirname, "../public/litefy-design-skill.md");

const detectSrc = path.resolve(__dirname, "design-detect.mjs");
const detectDest = path.resolve(__dirname, "../public/litefy-design-detect.mjs");

await fs.copy(src, dest);
await fs.copy(detectSrc, detectDest);
console.log("Synced skill: public/litefy-design-skill.md");
console.log("Synced skill script: public/litefy-design-detect.mjs");
