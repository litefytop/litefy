import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useParams,
} from "react-router";
import type { Route } from "./+types/root";

import { Suspense, useEffect } from "react";
import { i18n } from "@/lib/i18n";
import { findStyleTemplateByPath, laneHomeHref, LANGUAGES, SCHEME_PREFIXES, STYLE_TEMPLATES } from "@/lib/style-templates";
import { applyAttr, loadStored } from "@/lib/ramp-attrs";
import { HydrateFallback } from "./components/hydrate-fallback";
import { BrowserSupportGate } from "./components/browser-support-notice";
import { ArrowLeft } from "./components/icons";

export function Layout(props?: { children?: React.ReactNode }) {
  const { children } = props ?? {};
  const { lang = i18n.defaultLanguage } = useParams<{ lang?: string }>();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col bg-background">
        <BrowserSupportGate>
          <Suspense fallback={<HydrateFallback />}>{children}</Suspense>
        </BrowserSupportGate>
        <ScrollRestoration getKey={(location) => `${location.pathname}${location.search}${location.hash}`} />
        <Scripts />
      </body>
    </html>
  );
}

const MARKDOWN_DOCS = new RegExp(`^(?:/[a-z-]+)?/(${LANGUAGES.join("|")})/docs/(.+)\\.md$`, "u");

const serverMiddleware: Route.MiddlewareFunction = ({ request }, next) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const first = pathname.split("/").find(Boolean);
  if (first && !LANGUAGES.includes(first) && !SCHEME_PREFIXES.includes(`/${first}`)) {
    return new Response("Not Found", { status: 404 });
  }

  const markdown = pathname.match(MARKDOWN_DOCS);
  if (markdown) {
    return Response.redirect(new URL(`/${markdown[1]}/llms.mdx/docs/${markdown[2]}/content.md`, url));
  }

  return next();
};

export const middleware = [serverMiddleware];

function ScrollKeeper() {
  const location = useLocation();
  useEffect(() => {
    const y = (location.state as { scrollY?: number } | null)?.scrollY;
    if (typeof y === "number") window.scrollTo(0, y);
  }, [location]);
  return null;
}

function RampSync() {
  const location = useLocation();
  useEffect(() => {
    const current = findStyleTemplateByPath(location.pathname);
    for (const tpl of STYLE_TEMPLATES) {
      for (const cfg of tpl.palettes) {
        applyAttr(cfg.attr, tpl.slug === current.slug ? loadStored(cfg.storageKey) : "");
      }
    }
  }, [location.pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollKeeper />
      <RampSync />
      <Outlet />
    </>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  console.error("[ErrorBoundary]", error);

  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText || "Error"}`;
    details = error.data ?? error.statusText ?? "Request failed.";
  } else if (error) {
    if (typeof error === "object" && "then" in error) {
      details =
        "Data is still loading (Suspense pending) – this should not appear if Suspense works.";
      console.error("Caught a Promise:", error);
    } else if (error instanceof Error) {
      details = error.message;
      stack = error.stack;
    } else {
      details = String(error);
    }
  }

  const homeHref = laneHomeHref(typeof window === "undefined" ? "" : window.location.pathname);

  return (
    <main className="flex flex-col items-center justify-center gap-6 px-4 md:px-6 lg:px-8 min-h-screen">
      <div className="flex w-full max-w-[40rem] flex-col items-center gap-3 text-center">
        <p className="m-0">Something went wrong</p>
        <h1 className="m-0">{message}</h1>
        <p className="m-0 wrap-break-word max-w-112">
          {details}
        </p>
        <a href={homeHref} className="inline-flex items-center gap-2">
          <ArrowLeft className="size-4" aria-hidden />
          Back to Home
        </a>
      </div>
      {stack && (
        <pre
          className="w-full max-w-[40rem] overflow-x-auto whitespace-pre-wrap p-4"
          style={{ marginBlockStart: "var(--pad-block)" }}
        >
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
