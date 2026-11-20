import { HomeRoute } from "./home-view";
import type { LinksFunction } from "react-router";
import globalHref from "../global.css?url";
import { homeContent } from "./home-view";
import { socialMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/shared";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalHref },
];

export function meta() {
  const t = homeContent.zh;
  const title = t.title;
  const description = t.description;
  const url = `${siteUrl}/`;
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: url },
    ...socialMeta({ title, description, url, locale: "zh" }),
  ];
}

export default HomeRoute;
