import { HomeContent } from "./home";
import { socialMeta } from "@/lib/seo";
import { siteUrl } from "@/lib/shared";

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

export default function Root() {
  return <HomeContent locale="en" />;
}
