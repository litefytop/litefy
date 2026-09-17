// Shared Vite harness server so every audit script mounts demos with the same
// aliases and the real Tailwind styles (without the plugin, utility classes
// never generate and size/visibility measurements are garbage).
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

const REPO = path.resolve(import.meta.dirname, "../..");

export function startHarnessServer(port) {
  return import("vite").then((v) =>
    v.createServer({
      root: REPO,
      configFile: false,
      plugins: [tailwindcss()],
      server: { port, strictPort: true, fs: { allow: [REPO] } },
      logLevel: "error",
      esbuild: { jsx: "automatic" },
      resolve: {
        dedupe: ["react", "react-dom"],
        alias: [
          { find: /^@\/ui$/, replacement: path.join(REPO, "app/ui/index.ts") },
          { find: /^@\//, replacement: path.join(REPO, "app/") },
        ],
      },
      define: { "process.env.NODE_ENV": JSON.stringify("development") },
    }),
  );
}
