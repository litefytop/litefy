import { HomeRoute } from "./home-view";
import type { LinksFunction } from "react-router";
import globalHref from "../global.css?url";
import { socialMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/shared";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalHref },
];

export function meta() {
  const title = "Litefy UI - Lightweight React Component Library";
  const description =
    "Litefy UI is a lightweight React UI library for building modern web apps.";
  const url = `${siteUrl}/`;
  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: url },
    ...socialMeta({ title, description, url, locale: "en" }),
  ];
}

export default HomeRoute;
