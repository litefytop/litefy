import { type LinksFunction } from "react-router";
import globalHref from "../global.css?url";
import { homeContent, type Locale } from "./home-view";
import { siteDefaultLanguage } from "@/lib/i18n";
import { socialMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/shared";
import { LANGUAGES } from "../lib/style-templates";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalHref },
];

export function meta({ params }: { params: { lang?: string } }) {
  const lang = params.lang ?? siteDefaultLanguage;
  const locale = (LANGUAGES.includes(lang) ? lang : siteDefaultLanguage) as Locale;
  const t = homeContent[locale] ?? homeContent.en;
  const url = `${siteUrl}/${locale}`;
  return [
    { title: t.title },
    { name: "description", content: t.description },
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: url },
    ...socialMeta({ title: t.title, description: t.description, url, locale }),
  ];
}

export { HomeRoute as default } from "./home-view";
