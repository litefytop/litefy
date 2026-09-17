import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const REPO = path.resolve(import.meta.dirname, "../..");
const UI = path.join(REPO, "app/ui");
const COMP_DIR = path.join(UI, "components");
const UTIL_DIR = path.join(UI, "utils");
const esbuild = createRequire(import.meta.url)("../../node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild");

const EXTERNAL = ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "lucide-react"];

function exportedNames(file) {
  const src = fs.readFileSync(file, "utf8");
  const names = new Set();
  const types = new Set();
  for (const m of src.matchAll(/export\s+(?:async\s+)?(?:function|const|class|let|var|enum)\s+(\w+)/g)) names.add(m[1]);
  for (const m of src.matchAll(/export\s+(?:type|interface)\s+(\w+)/g)) types.add(m[1]);
  for (const m of src.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of m[1].split(",")) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      const [local, alias] = trimmed.split(/\s+as\s+/).map((s) => s.trim());
      const isType = /^type\s/.test(local);
      const n = (alias || local.replace(/^type\s+/, "")).trim();
      if (!n) continue;
      if (isType) types.add(n);
      else names.add(n);
    }
  }
  for (const t of types) names.delete(t);
  return names;
}

const nameMap = new Map();
const scanDir = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".ts") && !name.endsWith(".tsx")) continue;
    if (name === "index.ts") continue;
    const file = path.join(dir, name);
    for (const n of exportedNames(file)) if (!nameMap.has(n)) nameMap.set(n, file);
  }
};
scanDir(UTIL_DIR);
scanDir(COMP_DIR);

function listEntries() {
  const out = [];
  for (const name of fs.readdirSync(COMP_DIR).sort()) {
    const p = path.join(COMP_DIR, name);
    if (fs.statSync(p).isDirectory()) {
      if (fs.existsSync(path.join(p, "index.tsx"))) out.push({ name, file: path.join(p, "index.tsx") });
    } else if (name.endsWith(".tsx")) out.push({ name: name.replace(/\.tsx$/, ""), file: p });
  }
  return out;
}

const stubDir = path.join(import.meta.dirname, "stubs");
fs.mkdirSync(stubDir, { recursive: true });

function expandNames(seed) {
  const all = new Set();
  const queue = [...seed];
  while (queue.length) {
    const n = queue.shift();
    if (all.has(n)) continue;
    all.add(n);
    const file = nameMap.get(n);
    if (!file) continue;
    const src = fs.readFileSync(file, "utf8");
    for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*"\.\.";/g)) {
      for (const part of m[1].split(",")) {
        const t = part.trim();
        if (!t || t.startsWith("type ")) continue;
        const inner = t.split(/\s+as\s+/)[0].trim();
        if (inner && !all.has(inner)) queue.push(inner);
      }
    }
  }
  return all;
}

const results = [];
for (const entry of listEntries()) {
  const src = fs.readFileSync(entry.file, "utf8");
  const direct = new Set();
  for (const m of src.matchAll(/import\s*\{([^}]+)\}\s*from\s*"\.\.";/g)) {
    for (const part of m[1].split(",")) {
      const trimmed = part.trim();
      if (!trimmed || trimmed.startsWith("type ")) continue;
      const n = trimmed.split(/\s+as\s+/)[0].trim();
      if (n) direct.add(n);
    }
  }
  const valueNames = expandNames(direct);
  const buildStub = (names, fileSuffix) => {
    const lines = [];
    const imports = [];
    for (const n of names) {
      const file = nameMap.get(n);
      if (!file || file === entry.file) continue;
      imports.push(`import { ${n} as _${n.replace(/\W/g, "_")} } from "${file.replace(/\\/g, "/")}";`);
      lines.push(`export const ${n} = _${n.replace(/\W/g, "_")};`);
    }
    const f = path.join(stubDir, `barrel-${entry.name}-${fileSuffix}.ts`);
    fs.writeFileSync(f, imports.join("\n") + "\n" + lines.join("\n"));
    return f;
  };
  const stubFile = buildStub(valueNames, "min");
  const fullStubFile = buildStub([...nameMap.keys()], "full");

  const buildOpts = (stubPath) => ({
    entryPoints: [entry.file],
    bundle: true,
    write: false,
    minify: true,
    metafile: true,
    format: "esm",
    target: "es2020",
    jsx: "automatic",
    external: EXTERNAL,
    legalComments: "none",
    outdir: "virtual",
    plugins: [
      {
        name: "stub-barrel",
        setup(build) {
          build.onResolve({ filter: /^\.\.$/ }, () => ({ path: stubPath }));
        },
      },
    ],
  });

  let r;
  try {
    r = await esbuild.build(buildOpts(stubFile));
  } catch {
    r = await esbuild.build(buildOpts(fullStubFile));
  }
  try {
    const js = r.outputFiles.find((f) => f.path.endsWith(".js"));
    const raw = js.contents.length;
    const gzip = zlib.gzipSync(js.contents, { level: 9 }).length;
    results.push({ component: entry.name, rawMin: raw, gzip, isolated: true });
    console.log(`${entry.name.padEnd(18)} raw=${(raw / 1024).toFixed(2)}K gzip=${(gzip / 1024).toFixed(2)}K`);
  } catch (e) {
    results.push({ component: entry.name, error: String(e).slice(0, 300) });
    console.log(`${entry.name.padEnd(18)} ERROR ${String(e).slice(0, 200)}`);
  }
}
fs.writeFileSync(new URL("./results/sizes-isolated.json", import.meta.url), JSON.stringify(results, null, 1));
console.log("done:", results.length);
