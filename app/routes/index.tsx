import { HomeContent } from "./home";

export function meta() {
  return [
    { title: "Litefy UI - Lightweight React Component Library" },
    {
      name: "description",
      content:
        "Litefy UI is a lightweight React UI library for building modern web apps.",
    },
    { name: "robots", content: "index, follow" },
    { rel: "canonical", href: "https://litefy.top/" },
  ];
}

export default function Root() {
  return <HomeContent locale="en" />;
}
