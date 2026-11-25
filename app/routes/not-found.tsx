import { HomeShell } from "@/components/docs-shell";
import type { LinksFunction } from "react-router";
import globalHref from "../global.css?url";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { siteDefaultLanguage } from "@/lib/i18n";
import { appName } from "@/lib/shared";
import { SiteSkinProvider, useSiteSkin } from "@/components/site-skin";
import { siteSkin } from "@/components/site-skin-bundle";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalHref },
];

export function meta() {
  return [{ title: `Not Found - ${appName}` }];
}

export default function NotFound() {
  return (
    <SiteSkinProvider skin={siteSkin}>
      <NotFoundView />
    </SiteSkinProvider>
  );
}

function NotFoundView() {
  const { buttonVariants } = useSiteSkin();
  const params = useParams<{ lang: string }>();

  const locale = params.lang || siteDefaultLanguage;
  const docsPath = `/`;

  useEffect(() => {
    if (typeof window !== "undefined" && params.lang) {
      localStorage.setItem("preferred-language", params.lang);
    }
  }, [params.lang]);

  return (
    <HomeShell locale={locale}>
      <div
        className="flex flex-col flex-1 items-center justify-center px-4 md:px-6 lg:px-8 text-center"
      >
        <h1 className="m-0 scroll-mt-20 py-4 mb-4 text-36 leading-10 tracking-tight font-bold sm:text-48 sm:leading-none lg:text-60 lg:leading-none">Not Found</h1>
        <p
          className="m-0 scroll-mt-20 text-foreground text-base leading-6 sm:text-lg sm:leading-7"
          style={{ marginBlockEnd: "calc(var(--spacing) * 4)" }}
        >
          This page could not be found.
        </p>

        <Link className={buttonVariants.primary} to={docsPath}>
          Back to Docs
        </Link>
      </div>
    </HomeShell>
  );
}
