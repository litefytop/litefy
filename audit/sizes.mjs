import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const REPO = path.resolve(import.meta.dirname, "../..");
const COMP_DIR = path.join(REPO, "app/ui/components");
const esbuild = createRequire(import.meta.url)("../../node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild");

const EXTERNAL = ["react", "react-dom", "react/jsx-runtime", "react-dom/client", "lucide-react"];
const NPM_MARKER = "node_modules/.pnpm/";

function listEntries() {
  const out = [];
  for (const name of fs.readdirSync(COMP_DIR).sort()) {
    const p = path.join(COMP_DIR, name);
    if (fs.statSync(p).isDirectory()) {
      if (fs.existsSync(path.join(p, "index.tsx"))) out.push({ name, file: path.join(p, "index.tsx") });
    } else if (name.endsWith(".tsx")) {
      out.push({ name: name.replace(/\.tsx$/, ""), file: p });
    }
  }
  return out;
}

function npmDepOf(inputPath) {
  const i = inputPath.indexOf(NPM_MARKER);
  if (i < 0) return null;
  const rest = inputPath.slice(i + NPM_MARKER.length);
  const m = rest.match(/^([^/]+)\//);
  if (!m) return null;
  return m[1].replace(/\+.+$/, "");
}

const results = [];
for (const entry of listEntries()) {
  try {
    const r = await esbuild.build({
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
    });
    const js = r.outputFiles.find((f) => f.path.endsWith(".js"));
    const raw = js.contents.length;
    const gzip = zlib.gzipSync(js.contents, { level: 9 }).length;
    const deps = new Map();
    let own = 0;
    for (const [p, info] of Object.entries(r.metafile.inputs)) {
      const dep = npmDepOf(p);
      if (dep) deps.set(dep, (deps.get(dep) ?? 0) + info.bytesInOutput);
      else own += info.bytesInOutput;
    }
    results.push({
      component: entry.name,
      rawMin: raw,
      gzip,
      ownBytesIn: own,
      npmDeps: [...deps.entries()].map(([name, bytes]) => ({ name, bytes })).sort((a, b) => b.bytes - a.bytes),
    });
    console.log(`${entry.name.padEnd(18)} raw=${(raw / 1024).toFixed(1)}K gzip=${(gzip / 1024).toFixed(2)}K deps=${[...deps.keys()].join(",") || "-"}`);
  } catch (e) {
    results.push({ component: entry.name, error: String(e).slice(0, 300) });
    console.log(`${entry.name.padEnd(18)} ERROR ${String(e).slice(0, 120)}`);
  }
}
fs.writeFileSync(new URL("./results/sizes.json", import.meta.url), JSON.stringify(results, null, 1));
console.log("done:", results.length);
