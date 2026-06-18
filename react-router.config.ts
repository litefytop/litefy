import { glob } from "node:fs/promises";
import type { Config } from "@react-router/dev/config";
import { createGetUrl } from "fumadocs-core/source";

const getUrl = createGetUrl("/docs");

export default {
  ssr: false,
  future: {
    v8_middleware: true,
    v8_viteEnvironmentApi: true,
    v8_passThroughRequests: true,
    v8_trailingSlashAwareDataRequests: true,
    v8_splitRouteModules: true,
  },
  async prerender({ getStaticPaths }) {
    const paths: string[] = [];
    const excluded: string[] = [];

    for (const path of getStaticPaths()) {
      const normalized = path.replace(/\\/g, "/");
      if (!excluded.includes(normalized)) paths.push(normalized);
    }

    const languages = ["en", "zh"];
    const defaultLanguage = "en";

    for (const lang of languages) {
      paths.push(`/${lang}/docs`);
    }

    for await (const entry of glob("**/*.mdx", { cwd: "content/docs" })) {
      const normalized = entry.replace(/\\/g, "/").replace(/\.mdx$/, "");
      const segments = normalized.split("/").filter(Boolean);
      const fileName = segments[segments.length - 1] || "";

      let lang = defaultLanguage;
      let baseName = fileName;
      for (const l of languages) {
        if (l === defaultLanguage) continue;
        if (fileName.endsWith(`.${l}`)) {
          lang = l;
          baseName = fileName.slice(0, -(l.length + 1));
          break;
        }
      }

      const slugs =
        baseName === "index"
          ? segments.slice(0, -1)
          : [...segments.slice(0, -1), baseName];

      paths.push(
        `/${lang}${getUrl(slugs)}`,
        `/${lang}/llms.mdx/docs/${[...slugs, "content.md"].join("/")}`,
      );
    }

    for (const lang of languages) {
      paths.push(`/${lang}/api/search`);

      paths.push(`/${lang}/llms.txt`, `/${lang}/llms-full.txt`);
    }

    return paths.map((p) => p.replace(/\\/g, "/"));
  },
} satisfies Config;
