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
import SearchDialog from "@/components/search";
import { i18n } from "@/lib/i18n";
import { translations } from "@/lib/layout.shared";
import NotFound from "./routes/not-found";

function RootProviderWrapper({ children }: { children: React.ReactNode }) {
  const { lang = i18n.defaultLanguage } = useParams<{ lang?: string }>();

  return (
    <RootProvider
      search={{ SearchDialog }}
      i18n={i18nProvider(translations, lang)}
    >
      {children}
    </RootProvider>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProviderWrapper>{children}</RootProviderWrapper>
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

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFound />;
    message = "Error";
    details = error.statusText;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 w-full max-w-350 mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
