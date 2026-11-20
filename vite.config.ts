import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import mdx from "fumadocs-mdx/vite";
import { defineConfig, type Plugin } from "vite";
import path from "node:path";

const SCRIPT_PATH = fileURLToPath(new URL("./scripts/build-page-trees.mjs", import.meta.url));

function runBuildScript(scriptPath: string): void {
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${scriptPath} failed with exit code ${result.status}`);
  }
}

function pageTreesPlugin(): Plugin {
  return {
    name: "fumadocs-page-trees",
    enforce: "pre",
    configResolved() {
      runBuildScript(SCRIPT_PATH);
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), mdx(), reactRouter(), pageTreesPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
      collections: path.resolve(__dirname, "./.source"),
    },

    noExternal: ["fumadocs-core", "fumadocs-ui", "fumadocs-openapi", "@fumadocs/base-ui"],
  },
});
