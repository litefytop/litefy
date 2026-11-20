import { i18n } from "./i18n";

export function buildMarkdownUrl(locale: string, slugs: string[]) {
  const lang = locale || i18n.defaultLanguage;
  const segments = [lang, ...slugs];
  const tail = [...segments.slice(1), "content.md"].join("/");

  return {
    segments: [...segments, "content.md"],
    url: `/${lang}/llms.mdx/docs/${tail}`,
  };
}
