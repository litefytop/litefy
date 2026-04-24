import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "@/pages/component/layout";
import Home from "@/pages/Home";
import Button from "@/pages/button";
import Accordion from "@/pages/accordion";
import Anchor from "@/pages/anchor";
import InputDemo from "@/pages/InputDemo";
import Checkbox from "@/pages/checkbox";
import SliderDemo from "@/pages/SliderDemo";
import TextareaDemo from "@/pages/TextareaDemo";
import SelectDemo from "@/pages/SelectDemo";
import LoadingDemo from "@/pages/LoadingDemo";
import EmptyDemo from "@/pages/EmptyDemo";
import SkeletonDemo from "@/pages/SkeletonDemo";
import SeparatorDemo from "@/pages/SeparatorDemo";
import ThemeDemo from "@/pages/ThemeDemo";
import { zh, en } from "@/pages/i18n";
import ComingSoon from "@/pages/ComingSoon";

const components = [
  { key: "button", Component: Button, href: "/components/button" },
  { key: "accordion", Component: Accordion, href: "/components/accordion" },
  { key: "anchor", Component: Anchor, href: "/components/anchor" },
  { key: "input", Component: InputDemo, href: "/components/input" },
  { key: "checkbox", Component: Checkbox, href: "/components/checkbox" },
  { key: "slider", Component: SliderDemo, href: "/components/slider" },
  { key: "textarea", Component: TextareaDemo, href: "/components/textarea" },
  { key: "select", Component: SelectDemo, href: "/components/select" },
  { key: "loading", Component: LoadingDemo, href: "/components/loading" },
  { key: "empty", Component: EmptyDemo, href: "/components/empty" },
  { key: "skeleton", Component: SkeletonDemo, href: "/components/skeleton" },
  { key: "separator", Component: SeparatorDemo, href: "/components/separator" },
  { key: "theme", Component: ThemeDemo, href: "/components/theme" },
  { key: "title", Component: ComingSoon, href: "/components/title" },
  { key: "text", Component: ComingSoon, href: "/components/text" },
  { key: "description", Component: ComingSoon, href: "/components/description" },
  { key: "field", Component: ComingSoon, href: "/components/field" },
  { key: "spin", Component: ComingSoon, href: "/components/spin" },
  { key: "img", Component: ComingSoon, href: "/components/img" },
  { key: "watermark", Component: ComingSoon, href: "/components/watermark" },
  { key: "show", Component: ComingSoon, href: "/components/show" },
  { key: "input-group", Component: ComingSoon, href: "/components/input-group" },
  { key: "radio", Component: ComingSoon, href: "/components/radio" },
  { key: "label", Component: ComingSoon, href: "/components/label" },
  { key: "form", Component: ComingSoon, href: "/components/form" },
  { key: "search", Component: ComingSoon, href: "/components/search" },
  { key: "sidebar", Component: ComingSoon, href: "/components/sidebar" },
  { key: "paper", Component: ComingSoon, href: "/components/paper" },
  { key: "pagination", Component: ComingSoon, href: "/components/pagination" },
  { key: "transfer", Component: ComingSoon, href: "/components/transfer" },
  { key: "toast", Component: ComingSoon, href: "/components/toast" },
  { key: "overlay", Component: ComingSoon, href: "/components/overlay" },
  { key: "table", Component: ComingSoon, href: "/components/table" },
  { key: "sheet", Component: ComingSoon, href: "/components/sheet" },
  { key: "dropdown-menu", Component: ComingSoon, href: "/components/dropdown-menu" },
  { key: "password", Component: ComingSoon, href: "/components/password" },
  { key: "code-block", Component: ComingSoon, href: "/components/code-block" },
];

export function getNavItems(locale: "zh" | "en") {
  const t = locale === "zh" ? zh : en;
  return [
    {
      title: t.gettingStarted,
      items: [
        { key: "introduction", title: t.introduction, href: "/" },
      ],
    },
    {
      title: t.componentsGroup,
      items: components.map((c) => ({
        key: c.key,
        title: t.components[c.key as keyof typeof t.components],
        href: c.href,
      })),
    },
  ];
}

function createRouter() {
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
          Component: Home,
        },
        ...components.map((c) => ({
          path: `/${locale}${c.href}`,
          Component: c.Component,
        })),
      ],
    })),
  ]);
}

const router = createRouter();

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
