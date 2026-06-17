import type { LoaderFunctionArgs } from "react-router";
import { getLLMText, source } from "@/lib/source";

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params.lang || "en";
  const slug = params["*"] || "";
  const parts = slug.split("/").filter((v) => v.length > 0);
  const slugs =
    parts[parts.length - 1] === "content.md" ? parts.slice(0, -1) : parts;

  const page = source.getPage(slugs, locale);

  if (!page) {
    return new Response("not found", { status: 404 });
  }

  return new Response(await getLLMText(page), {
    headers: {
      "Content-Type": "text/markdown",
    },
  });
}
