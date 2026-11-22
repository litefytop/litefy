import type { LinksFunction } from "react-router";
import type { Route } from "./+types/flat-docs";
import flatSiteHref from "./flat-site.css?url";
import DocsView, { preloadDocsPage } from "./docs-view";
import { SiteSkinProvider } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: flatSiteHref },
];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await preloadDocsPage(new URL(request.url).pathname);
}
clientLoader.hydrate = true;

export default function FlatDocsRoute() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <DocsView />
    </SiteSkinProvider>
  );
}
