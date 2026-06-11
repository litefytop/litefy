import { loader } from 'fumadocs-core/source';
import { docs } from 'collections/server';
import { docsContentRoute, docsRoute } from './shared';
import { i18n } from './i18n';
import { demos } from '@/demos';

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  i18n,
});

export function getPageMarkdownUrl(page: (typeof source)['$inferPage']) {
  const segments = [page.locale || i18n.defaultLanguage, ...page.slugs];

  return {
    segments: [...segments, 'content.md'],
    url: `/${page.locale || i18n.defaultLanguage}/llms.mdx/docs/${segments.slice(1).join('/')}`,
  };
}

const COMPONENT_PREVIEW_REGEX = /<ComponentPreview\s+name\s*=\s*["']([^"']+)["'][^/>]*\/?>/g;
const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g;

async function replaceComponentPreview(content: string): Promise<string> {
  const matches = Array.from(content.matchAll(COMPONENT_PREVIEW_REGEX));

  if (matches.length === 0) return content;

  const replacements = await Promise.all(
    matches.map(async (match) => {
      const fullMatch = match[0];
      const demoName = match[1];

      if (!demoName) {
        return { match: fullMatch, replacement: fullMatch };
      }

      const demo = demos[demoName];

      if (!demo?.code) {
        return { match: fullMatch, replacement: fullMatch };
      }

      return {
        match: fullMatch,
        replacement: `\n\`\`\`tsx\n${demo.code.trim()}\n\`\`\`\n`,
      };
    }),
  );

  let result = content;
  const processedMatches = new Set<string>();

  for (const { match, replacement } of replacements) {
    if (processedMatches.has(match)) continue;

    processedMatches.add(match);
    const escapedMatch = match.replace(REGEX_ESCAPE, '\\$&');
    const regex = new RegExp(escapedMatch, 'g');

    result = result.replace(regex, replacement);
  }

  return result;
}

const EXCESSIVE_NEWLINES = /\n{3,}/g;

function cleanContent(content: string): string {
  return content
    .replace(EXCESSIVE_NEWLINES, '\n\n')
    .trim();
}

async function processMDXContent(content: string): Promise<string> {
  let processed = await replaceComponentPreview(content);
  processed = cleanContent(processed);
  return processed;
}

export async function getLLMText(page: (typeof source)['$inferPage']) {
  const rawContent = await page.data.getText('processed');
  const processedContent = await processMDXContent(rawContent);

  return `# ${page.data.title} (${page.url})

${processedContent}`;
}
