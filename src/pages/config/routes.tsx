import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { zh, en } from "./i18n";
import Home from "../Home";
import Button from "../button";
import Accordion from "../accordion";
import Anchor from "../anchor";
import Checkbox from "../checkbox";
import Description from "../description";
import Input from "../input";
import Password from "../password";
import Radio from "../radio";
import DropdownMenu from "../dropdown-menu";
import { ComingSoon, Layout } from "@/component";

const introduction = { key: "introduction", path: "/", Component: Home };

const componentRouteConfig = [
  { key: "button", path: "/components/button", Component: Button },
  { key: "accordion", path: "/components/accordion", Component: Accordion },
  { key: "anchor", path: "/components/anchor", Component: Anchor },
  { key: "input", path: "/components/input", Component: Input },
  { key: "checkbox", path: "/components/checkbox", Component: Checkbox },
  { key: "radio", path: "/components/radio", Component: Radio },
  { key: "dropdown-menu", path: "/components/dropdown-menu", Component: DropdownMenu },
  { key: "password", path: "/components/password", Component: Password },
  { key: "slider", path: "/components/slider", Component: ComingSoon },
  { key: "textarea", path: "/components/textarea", Component: ComingSoon },
  { key: "select", path: "/components/select", Component: ComingSoon },
  { key: "loading", path: "/components/loading", Component: ComingSoon },
  { key: "empty", path: "/components/empty", Component: ComingSoon },
  { key: "skeleton", path: "/components/skeleton", Component: ComingSoon },
  { key: "separator", path: "/components/separator", Component: ComingSoon },
  { key: "theme", path: "/components/theme", Component: ComingSoon },
  { key: "title", path: "/components/title", Component: ComingSoon },
  { key: "text", path: "/components/text", Component: ComingSoon },
  { key: "description", path: "/components/description", Component: Description },
  { key: "field", path: "/components/field", Component: ComingSoon },
  { key: "spin", path: "/components/spin", Component: ComingSoon },
  { key: "img", path: "/components/img", Component: ComingSoon },
  { key: "watermark", path: "/components/watermark", Component: ComingSoon },
  { key: "show", path: "/components/show", Component: ComingSoon },
  { key: "label", path: "/components/label", Component: ComingSoon },
  { key: "form", path: "/components/form", Component: ComingSoon },
  { key: "search", path: "/components/search", Component: ComingSoon },
  { key: "sidebar", path: "/components/sidebar", Component: ComingSoon },
  { key: "paper", path: "/components/paper", Component: ComingSoon },
  { key: "pagination", path: "/components/pagination", Component: ComingSoon },
  { key: "transfer", path: "/components/transfer", Component: ComingSoon },
  { key: "toast", path: "/components/toast", Component: ComingSoon },
  { key: "overlay", path: "/components/overlay", Component: ComingSoon },
  { key: "table", path: "/components/table", Component: ComingSoon },
  { key: "sheet", path: "/components/sheet", Component: ComingSoon },
];

function getLabel(t: typeof zh, key: string): string {
  return t.components[key as keyof typeof t.components] || key;
}

const navConfig = {
  zh: {
    introduction: { key: "introduction", path: "/", href: "/", title: zh.introduction },
    components: componentRouteConfig
      .slice()
      .sort((a, b) => (a.key || "").localeCompare(b.key || ""))
      .map(item => ({
        key: item.key,
        path: item.path,
        href: item.path,
        title: getLabel(zh, item.key),
      })),
  },
  en: {
    introduction: { key: "introduction", path: "/", href: "/", title: en.introduction },
    components: componentRouteConfig
      .slice()
      .sort((a, b) => (a.key || "").localeCompare(b.key || ""))
      .map(item => ({
        key: item.key,
        path: item.path,
        href: item.path,
        title: getLabel(en, item.key),
      })),
  },
};

export const components = componentRouteConfig.map(({ key, path, Component }) => ({
  key,
  href: path,
  Component,
}));

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
      element: <Layout locale={locale} />,
      children: [
        {
          path: `/${locale}/`,
          Component: introduction.Component,
        },
        ...components.map((c) => ({
          path: `/${locale}${c.href}`,
          Component: c.Component as React.ComponentType<{ locale?: string }>,
        })),
      ],
    })),
  ]);
}

export function getComponentNav(currentHref: string, locale: "zh" | "en" = "zh") {
  const items = navConfig[locale].components;
  const index = items.findIndex(item => item.path === currentHref);
  if (index === -1) return { prev: null, next: null, current: null };

  return {
    prev: index > 0 ? items[index - 1] : null,
    next: index < items.length - 1 ? items[index + 1] : null,
    current: items[index],
  };
}
