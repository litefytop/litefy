import type { LinksFunction } from "react-router";
import type { Route } from "./+types/neo-docs";
import neoSiteHref from "./neo-site.css?url";
import DocsView, { preloadDocsPage } from "./docs-view";
import { SiteSkinProvider } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: neoSiteHref },
];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  await preloadDocsPage(new URL(request.url).pathname);
}
clientLoader.hydrate = true;

export default function NeoDocsRoute() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <DocsView />
    </SiteSkinProvider>
  );
}
