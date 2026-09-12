import fs from "node:fs";
import path from "node:path";

const UI = "D:/Documents/code/litefy-fuma/app/ui";
const files = [];
for (const dir of ["components", "utils"]) {
  const abs = path.join(UI, dir);
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && entry.name !== "index.ts") {
      files.push(path.join(abs, entry.name));
    } else if (entry.isDirectory()) {
      const idx = path.join(abs, entry.name, "index.tsx");
      if (fs.existsSync(idx)) files.push(idx);
    }
  }
}

let fixed = 0;
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const usesType = /(?<![\w.])ClassNameValue(?![\w])/.test(src.replace(/import\s*\{[^}]*ClassNameValue[^}]*\}\s*from\s*"[^"]+";?/g, ""));
  const alreadyImported = /import\s*(?:type\s*)?\{[^}]*\btype\s+ClassNameValue\b[^}]*\}\s*from\s*"\.\.\/utils\/cn"/.test(src);
  if (!usesType || alreadyImported) continue;

  let out;
  const cnImport = src.match(/import\s*\{([^}]*)\}\s*from\s*"\.\.\/utils\/cn";/);
  if (cnImport && !/ClassNameValue/.test(cnImport[1])) {
    out = src.replace(cnImport[0], `import { type ClassNameValue, ${cnImport[1].trim()} } from "../utils/cn";`);
  } else {
    const anchor = src.match(/(^[\s\S]*?\n)(import[^\n]*\n)/);
    out = src.replace(/(import \* as React from "react";\n)/, `$1import { type ClassNameValue } from "../utils/cn";\n`);
  }
  fs.writeFileSync(file, out);
  fixed++;
  console.log("repaired", path.relative(UI, file));
}
console.log("done:", fixed);
