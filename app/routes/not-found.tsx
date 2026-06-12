import type { Route } from "./+types/not-found";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link, useParams } from "react-router";
import { baseOptions } from "@/lib/layout.shared";
import { i18n } from "@/lib/i18n";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Not Found" }];
}

export default function NotFound() {
  const params = useParams<{ lang: string }>();

  const locale = params.lang || i18n.defaultLanguage;
  const docsPath = `/${locale}/docs`;

  useEffect(() => {
    if (typeof window !== "undefined" && params.lang) {
      localStorage.setItem("preferred-language", params.lang);
    }
  }, [params.lang]);

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Not Found</h1>
        <p className="text-fd-muted-foreground mb-4">
          This page could not be found.
        </p>

        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={docsPath}
        >
          Back to Docs
        </Link>
      </div>
    </HomeLayout>
  );
}
