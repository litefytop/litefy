import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "fumadocs-mdx/vite";
import { defineConfig, type Plugin } from "vite";

const SCRIPT_PATH = fileURLToPath(
  new URL("./scripts/build-page-trees.mjs", import.meta.url),
);

function runBuildScript(): void {
  const result = spawnSync(process.execPath, [SCRIPT_PATH], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(
      `build-page-trees script failed with exit code ${result.status}`,
    );
  }
}

function pageTreesPlugin(): Plugin {
  return {
    name: "fumadocs-page-trees",
    enforce: "pre",
    configResolved() {
      runBuildScript();
    },
  };
}

export default defineConfig({
  plugins: [mdx(), tailwindcss(), reactRouter(), pageTreesPlugin()],
  resolve: {
    tsconfigPaths: true,
    noExternal: [
      "fumadocs-core",
      "fumadocs-ui",
      "fumadocs-openapi",
      "@fumadocs/base-ui",
    ],
  },
  build: {
    sourcemap: false,
  },
  css: {
    devSourcemap: false,
  },
});
