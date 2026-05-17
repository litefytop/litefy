import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { zh, en } from "./i18n";
import { App, Introduction } from "@/pages";
import { ComingSoon } from "@/component";

const Accordion = lazy(() => import("@/pages/accordion"));
const Anchor = lazy(() => import("@/pages/anchor"));
const AnchorDemo = lazy(() => import("@/pages/anchor/examples/anchor-basic"));
const Button = lazy(() => import("@/pages/button"));
const Checkbox = lazy(() => import("@/pages/checkbox"));
const Description = lazy(() => import("@/pages/description"));
const Dropdown = lazy(() => import("@/pages/dropdown"));
const Empty = lazy(() => import("@/pages/empty/page"));
const Input = lazy(() => import("@/pages/input"));
const Password = lazy(() => import("@/pages/password"));
const Radio = lazy(() => import("@/pages/radio"));
const Select = lazy(() => import("@/pages/select"));
const Toast = lazy(() => import("@/pages/toast"));
const Dialog = lazy(() => import("@/pages/dialog"));
const Drawer = lazy(() => import("@/pages/drawer"));

const introduction = {
  key: "introduction",
  path: "/",
  Component: Introduction,
};

const componentRouteConfig = [
  { key: "accordion", path: "/components/accordion", Component: Accordion },
  { key: "anchor", path: "/components/anchor", Component: Anchor },
  { key: "button", path: "/components/button", Component: Button },
  { key: "toast", path: "/components/toast", Component: Toast },
  { key: "dialog", path: "/components/dialog", Component: Dialog },
  { key: "drawer", path: "/components/drawer", Component: Drawer },
  { key: "input", path: "/components/input", Component: Input },
  { key: "checkbox", path: "/components/checkbox", Component: Checkbox },
  { key: "radio", path: "/components/radio", Component: Radio },
  { key: "dropdown", path: "/components/dropdown", Component: Dropdown },
  { key: "select", path: "/components/select", Component: Select },
  { key: "password", path: "/components/password", Component: Password },
  { key: "slider", path: "/components/slider", Component: ComingSoon },
  { key: "textarea", path: "/components/textarea", Component: ComingSoon },
  { key: "loading", path: "/components/loading", Component: ComingSoon },
  { key: "empty", path: "/components/empty", Component: Empty },
  { key: "skeleton", path: "/components/skeleton", Component: ComingSoon },
  { key: "separator", path: "/components/separator", Component: ComingSoon },
  { key: "theme", path: "/components/theme", Component: ComingSoon },
  { key: "title", path: "/components/title", Component: ComingSoon },
  { key: "text", path: "/components/text", Component: ComingSoon },
  { key: "description", path: "/components/description", Component: Description },
  { key: "image", path: "/components/image", Component: ComingSoon },
  { key: "watermark", path: "/components/watermark", Component: ComingSoon },
  { key: "show", path: "/components/show", Component: ComingSoon },
  { key: "toggle", path: "/components/toggle", Component: ComingSoon },
  { key: "search", path: "/components/search", Component: ComingSoon },
  { key: "sidebar", path: "/components/sidebar", Component: ComingSoon },
  { key: "paper", path: "/components/paper", Component: ComingSoon },
  { key: "pagination", path: "/components/pagination", Component: ComingSoon },
  { key: "transfer", path: "/components/transfer", Component: ComingSoon },

];

function getLabel(t: typeof zh, key: string): string {
  return t.components[key as keyof typeof t.components];
}

const navConfig = {
  zh: {
    introduction: {
      key: "introduction",
      path: "/",
      href: "/",
      title: zh.introduction,
    },
    components: componentRouteConfig
      .slice()
      .sort((a, b) => (a.key || "").localeCompare(b.key || ""))
      .map((item) => ({
        key: item.key,
        path: item.path,
        href: item.path,
        title: getLabel(zh, item.key),
      })),
  },
  en: {
    introduction: {
      key: "introduction",
      path: "/",
      href: "/",
      title: en.introduction,
    },
    components: componentRouteConfig
      .slice()
      .sort((a, b) => (a.key || "").localeCompare(b.key || ""))
      .map((item) => ({
        key: item.key,
        path: item.path,
        href: item.path,
        title: getLabel(en, item.key),
      })),
  },
};

export const components = componentRouteConfig.map(
  ({ key, path, Component }) => ({
    key,
    href: path,
    Component,
  }),
);

export function getNavItems(locale: "zh" | "en") {
  const t = locale === "zh" ? zh : en;
  return [
    {
      title: t.gettingStarted,
      items: [navConfig[locale].introduction],
    },
    {
      title: t.componentsGroup,
      items: navConfig[locale].components,
    },
  ];
}

export function createRouter() {
  const locales = ["zh", "en"] as const;
  return createBrowserRouter([
    {
      path: "/",
      loader: () => {
        return new Response(null, {
          status: 302,
          headers: { Location: "/zh/" },
        });
      },
    },
    ...locales.map((locale) => ({
      element: <App locale={locale} />,
      children: [
        {
          path: `/${locale}/`,
          element: <introduction.Component locale={locale} />,
        },
        ...components.map((c) => ({
          path: `/${locale}${c.href}`,
          element: <c.Component locale={locale} />,
        })),
      ],
    })),
    {
      path: "/components/anchor/demo",
      element: <AnchorDemo />,
    },
  ]);
}

export function getComponentNav(
  currentHref: string,
  locale: "zh" | "en" = "zh",
) {
  const items = navConfig[locale].components;
  const index = items.findIndex((item) => item.path === currentHref);
  if (index === -1) return { prev: null, next: null, current: null };

  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
    current: items[index],
  };
}
