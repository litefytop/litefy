// Full-library bundle cost, re-measurable counterpart of the antd / RAC
// comparison baselines in results/full-*.json. The competitor packages are not
// installed in this repo anymore; their historic numbers live in
// results/full-antd-full.json / full-react-aria-components-full.json.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const REPO = path.resolve(import.meta.dirname, "../..");
const ENTRY = path.join(REPO, "app/ui/index.ts");
const esbuild = createRequire(import.meta.url)("../../node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild");

// Framework externals every consumer already ships.
const BASE_EXTERNAL = ["react", "react-dom", "react/jsx-runtime", "react-dom/client"];

async function measure(name, external) {
  const r = await esbuild.build({
    entryPoints: [ENTRY],
    bundle: true,
    write: false,
    minify: true,
    format: "esm",
    target: "es2020",
    jsx: "automatic",
    external,
    legalComments: "none",
    outdir: "virtual",
  });
  const js = r.outputFiles.find((f) => f.path.endsWith(".js"));
  return {
    name,
    raw: js.contents.length,
    gzip: zlib.gzipSync(js.contents, { level: 9 }).length,
    warnings: r.warnings.length,
  };
}

const results = [
  // Icons stay external: consumers tree-shake only the icons they use.
  await measure("litefy-full", [...BASE_EXTERNAL, "lucide-react"]),
  // Everything bundled, worst case.
  await measure("litefy-full-batteries", BASE_EXTERNAL),
];

fs.writeFileSync(new URL("./results/full-litefy-full.json", import.meta.url), JSON.stringify(results, null, 1));
for (const r of results) {
  console.log(`${r.name.padEnd(24)} raw=${(r.raw / 1024).toFixed(1)}K gzip=${(r.gzip / 1024).toFixed(2)}K warnings=${r.warnings}`);
}
