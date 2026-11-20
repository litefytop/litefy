import { docs } from "collections/server";
import { loader } from "fumadocs-core/source";
import { demoKeyOf } from "./demo-table";
import { i18n } from "./i18n";
import { buildMarkdownUrl } from "./markdown-url";
import { docsRoute } from "./shared";

export const source = loader({
  source: docs.toFumadocsSource(),
  baseUrl: docsRoute,
  i18n,
});

const demoCodeModules = import.meta.glob<string>("/app/demos/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
});
const demoCodes: Record<string, string> = {};
for (const [path, code] of Object.entries(demoCodeModules)) demoCodes[demoKeyOf(path)] = code;

export function getPageMarkdownUrl(page: (typeof source)["$inferPage"]) {
  return buildMarkdownUrl(page.locale || i18n.defaultLanguage, page.slugs);
}

export { buildMarkdownUrl } from "./markdown-url";

const COMPONENT_PREVIEW_REGEX = /<ComponentPreview\s+name\s*=\s*["']([^"']+)["'][^/>]*\/?>/gu;
const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/gu;

async function replaceComponentPreview(content: string): Promise<string> {
  const matches = Array.from(content.matchAll(COMPONENT_PREVIEW_REGEX));

  if (matches.length === 0) return content;

  const replacements = await Promise.all(
    matches.map((match) => {
      const fullMatch = match[0];
      const demoName = match[1];

      if (!demoName) {
        return { match: fullMatch, replacement: fullMatch };
      }

      const code = demoCodes[demoName];

      if (!code) {
        return { match: fullMatch, replacement: fullMatch };
      }

      return {
        match: fullMatch,
        replacement: `\n\`\`\`tsx\n${code.trim()}\n\`\`\`\n`,
      };
    }),
  );

  let result = content;
  const processedMatches = new Set<string>();

  for (const { match, replacement } of replacements) {
    if (processedMatches.has(match)) continue;

    processedMatches.add(match);
    const escapedMatch = match.replace(REGEX_ESCAPE, "\\$&");
    const regex = new RegExp(escapedMatch, "gu");

    result = result.replace(regex, replacement);
  }

  return result;
}

const EXCESSIVE_NEWLINES = /\n{3,}/gu;

function cleanContent(content: string): string {
  return content.replace(EXCESSIVE_NEWLINES, "\n\n").trim();
}

async function processMDXContent(content: string): Promise<string> {
  let processed = await replaceComponentPreview(content);
  processed = cleanContent(processed);
  return processed;
}

export async function getLLMText(page: (typeof source)["$inferPage"]) {
  const rawContent = await page.data.getText("processed");
  const processedContent = await processMDXContent(rawContent);

  return `# ${page.data.title} (${page.url})

${processedContent}`;
}
