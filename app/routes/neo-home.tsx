import { type LinksFunction } from "react-router";
import neoSiteHref from "./neo-site.css?url";
import { homeContent, type Locale } from "./home-view";
import { siteDefaultLanguage } from "@/lib/i18n";
import { socialMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/shared";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: neoSiteHref },
];

export function meta({ params }: { params: { lang?: string } }) {
  const locale = (params.lang || siteDefaultLanguage) as Locale;
  const t = homeContent[locale] ?? homeContent.en;
  const url = `${siteUrl}/neo/${locale}`;
  return [
    { title: t.title },
    { name: "description", content: t.description },
    { name: "robots", content: "noindex, follow" },
    ...socialMeta({ title: t.title, description: t.description, url, locale }),
  ];
}

export { HomeRoute as default } from "./home-view";
