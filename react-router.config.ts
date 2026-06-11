import type { Config } from '@react-router/dev/config';
import { glob } from 'node:fs/promises';
import { createGetUrl, getSlugs } from 'fumadocs-core/source';

const getUrl = createGetUrl('/docs');

export default {
  ssr: true,  
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
      if (!excluded.includes(path)) paths.push(path);
    }

    // 添加所有语言版本的文档路径
    const languages = ['en', 'zh'];

    // 添加 docs 首页路径
    for (const lang of languages) {
      paths.push(`/${lang}/docs`);
    }

    for await (const entry of glob('**/*.mdx', { cwd: 'content/docs' })) {
      const slugs = getSlugs(entry);

      for (const lang of languages) {
        // 所有语言都有前缀
        paths.push(
          `/${lang}${getUrl(slugs)}`,
          `/${lang}/llms.mdx/docs/${[...slugs, 'content.md'].join('/')}`
        );
      }
    }

    // 添加 API 和 LLM 路径（所有语言版本）
    for (const lang of languages) {
      // Search API
      paths.push(`/${lang}/api/search`);

      // LLM files
      paths.push(
        `/${lang}/llms.txt`,
        `/${lang}/llms-full.txt`
      );
    }

    return paths;
  },
} satisfies Config;
