import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_FACE = "app/ui/components/icons.tsx";
const ADAPTERS_DIR = "packages/cli/adapters";

function fail(message) {
  console.error(`✗ icon adapter gate: ${message}`);
  process.exit(1);
}

// Extract the key sequence of an object literal `export const <name>... = { ... }` (ends at the first line-start `}`)
function extractMapKeys(source, file, name) {
  const match = source.match(new RegExp(`export const ${name}[^=]*= \\{([\\s\\S]*?)\\n\\}`, "u"));
  if (!match) fail(`${file}: export const ${name} not found`);
  const keys = [...match[1].matchAll(/^[ \t]*([A-Za-z0-9_]+)[ \t]*:/gmu)].map((m) => m[1]);
  if (keys.length === 0) fail(`${file}: export const ${name} has no keys`);
  return keys;
}

const defaultSource = readFileSync(DEFAULT_FACE, "utf8");
const faceIcons = extractMapKeys(defaultSource, DEFAULT_FACE, "icons");
const faceNames = extractMapKeys(defaultSource, DEFAULT_FACE, "sourceNames");

if (faceIcons.length !== faceNames.length) {
  fail(
    `${DEFAULT_FACE}: icons has ${faceIcons.length} keys but sourceNames has ${faceNames.length}`,
  );
}
if (faceIcons.join(",") !== faceNames.join(",")) {
  fail(`${DEFAULT_FACE}: icons and sourceNames key order diverge`);
}

const files = readdirSync(ADAPTERS_DIR).filter((f) => /^icons-.+\.tsx$/u.test(f));
if (files.length === 0) fail(`${ADAPTERS_DIR}: no adapter files`);

for (const file of files) {
  const path = join(ADAPTERS_DIR, file);
  const source = readFileSync(path, "utf8");
  const icons = extractMapKeys(source, path, "icons");
  const names = extractMapKeys(source, path, "sourceNames");
  if (icons.length !== names.length) {
    fail(`${path}: icons has ${icons.length} keys but sourceNames has ${names.length}`);
  }
  if (icons.join(",") !== names.join(",")) {
    fail(`${path}: icons and sourceNames key order diverge`);
  }
  if (icons.length !== faceIcons.length) {
    fail(`${path}: ${icons.length} glyphs, default face has ${faceIcons.length}`);
  }
  if (icons.join(",") !== faceIcons.join(",")) {
    const missing = faceIcons.filter((k) => !icons.includes(k));
    const extra = icons.filter((k) => !faceIcons.includes(k));
    fail(
      `${path}: key set diverges from default face — missing [${missing}] extra [${extra}]`,
    );
  }
}

console.log(
  `✓ icon adapter gate: ${faceIcons.length} glyphs × ${files.length + 1} adapters synced`,
);
