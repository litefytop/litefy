import { i18nProvider } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/react-router";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useParams,
} from "react-router";
import type { Route } from "./+types/root";
import "./assets/styles/index.css";
import { Suspense } from "react";
import SearchDialog from "@/components/search";
import { i18n } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
import { HydrateFallback } from "./components/hydrate-fallback";
import NotFound from "./routes/not-found";

export function Layout(
  { children }: { children: React.ReactNode } = { children: undefined },
) {
  const { lang = i18n.defaultLanguage } = useParams<{ lang?: string }>();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <Suspense fallback={<HydrateFallback />}>
          <RootProvider
            search={{ SearchDialog }}
            i18n={i18nProvider(translations, lang)}
          >
            {children}
          </RootProvider>
        </Suspense>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const serverMiddleware: Route.MiddlewareFunction = async (
  { request },
  next,
) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const langMatch = pathname.match(/^\/([a-z]{2})\/docs\/(.+)\.md$/);
  if (langMatch) {
    const [, lang, path] = langMatch;
    return Response.redirect(new URL(`/${lang}/llms.mdx/docs/${path}`, url));
  }

  return next();
};

export const middleware = [serverMiddleware];

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  console.error("[ErrorBoundary]", error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFound />;
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

  const homeHref =
    typeof window !== "undefined"
      ? `/${window.location.pathname.split("/")[1] || ""}`
      : "/";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-fd-background text-fd-foreground">
      <div className="w-full max-w-xl flex flex-col items-center text-center gap-3">
        <span className="text-sm font-medium text-fd-muted-foreground tracking-widest uppercase">
          Something went wrong
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold">{message}</h1>
        <p className="text-fd-muted-foreground max-w-md wrap-break-word">
          {details}
        </p>
        <a
          href={homeHref}
          className="mt-4 inline-flex items-center gap-2 text-sm bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors rounded-full font-medium px-5 py-2.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Home
        </a>
      </div>
      {stack && (
        <pre className="mt-10 w-full max-w-xl p-4 overflow-x-auto rounded-lg border bg-fd-card text-fd-card-foreground text-xs leading-relaxed">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
