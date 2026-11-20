"use client";
import * as React from "react";
import type { MDXComponents } from "mdx/types";
import { Link, useLocation, useParams } from "react-router";
import { toSchemeHref } from "@/lib/style-templates";
import { CodeSurface, DocsCodeBlock } from "./docs-codeblock";
import { IconAdapterPlayground } from "./icon-adapter-playground";
import { Installation } from "./installation";
import { PackageManagerTabs } from "./package-manager-tabs";
import { ComponentPreview } from "./component-preview";
import { MotionPreferenceStatus } from "./motion-preference-status";
import { Source } from "./source";
import { useSiteSkin } from "./site-skin";
import { i18n } from "@/lib/i18n";
import { tabsScrollLabels } from "@/lib/shared";

const STATIC_HREF = /\.(md|mdx|txt|xml|json|webp|png|jpe?g|svg|ico|css|js)$/iu;
function MdxLink({ href, download, ...props }: React.ComponentProps<"a">) {
  const { lang } = useParams<{ lang?: string }>();
  const { pathname } = useLocation();
  if (download || (href && STATIC_HREF.test(href))) {
    return <a href={href} download={download} {...props} />;
  }
  const locale = lang && (i18n.languages as readonly string[]).includes(lang) ? lang : i18n.defaultLanguage;
  const localized =
    href && href.startsWith("/") && !new RegExp(`^/(${i18n.languages.join("|")})/`, "u").test(href)
      ? `/${locale}${href}`
      : (href ?? "#");
  return <Link to={toSchemeHref(pathname, localized)} {...props} />;
}

function DocsTab(_props: { value?: string; children?: React.ReactNode }) {
  return null;
}

interface DocsTabsProps {
  items?: string[];
  children?: React.ReactNode;
  className?: string;
}

function DocsTabs({ items, children, className }: DocsTabsProps) {
  const { Tabs } = useSiteSkin();
  const { lang } = useParams<{ lang?: string }>();
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<{ value?: string; children?: React.ReactNode }> =>
      React.isValidElement(child) && child.type === DocsTab,
  );
  const options = tabs.map((tab, i) => ({
    label: items?.[i] ?? tab.props.value ?? `Tab ${i + 1}`,
    value: tab.props.value ?? String(i),
    content: tab.props.children,
  }));
  if (options.length === 0) return null;
  return <Tabs {...tabsScrollLabels(lang === "zh")} options={options} className={className} defaultValue={options[0].value} />;
}

function mdxHeading(tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function MdxHeading(props: React.ComponentPropsWithoutRef<"h1">) {
    return React.createElement(tag, props);
  };
}

const COL_WEIGHTS: Record<number, { key: string; weight: number }[]> = {
  3: [
    { key: "col-1", weight: 1 },
    { key: "col-2", weight: 2 },
    { key: "col-3", weight: 3 },
  ],
  4: [
    { key: "col-1", weight: 1 },
    { key: "col-2", weight: 2 },
    { key: "col-3", weight: 1 },
    { key: "col-4", weight: 2 },
  ],
};

function headerCells(children: React.ReactNode): number {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement(child)) continue;
    if (child.type === "tr") {
      return React.Children.toArray((child.props as { children?: React.ReactNode }).children).filter(
        (c) => React.isValidElement(c) && c.type === "th",
      ).length;
    }
    const nested = headerCells((child.props as { children?: React.ReactNode }).children);
    if (nested) return nested;
  }
  return 0;
}

const LOWER = /[a-z0-9]/u;
const BOUNDARY_CHARS = /[._\-/]/u;
const UPPER = /[A-Z]/u;

function splitCodeToken(token: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let buffer = "";
  let prev = "";
  for (const ch of token) {
    if (buffer && ((LOWER.test(prev) && UPPER.test(ch)) || BOUNDARY_CHARS.test(prev))) {
      parts.push(buffer, <wbr key={parts.length} />);
      buffer = "";
    }
    buffer += ch;
    prev = ch;
  }
  if (buffer) parts.push(buffer);
  return parts;
}

function withCodeBreaks(node: React.ReactNode): React.ReactNode {
  if (Array.isArray(node)) return node.map((child) => withCodeBreaks(child));
  if (!React.isValidElement(node)) return node;
  const props = node.props as { children?: React.ReactNode };
  if (node.type === "code" && typeof props.children === "string") {
    return React.cloneElement(node, {}, splitCodeToken(props.children));
  }
  return React.cloneElement(node, {}, withCodeBreaks(props.children));
}

function MdxTable({ children, className, ...props }: React.ComponentPropsWithoutRef<"table">) {
  const count = headerCells(children);
  const weights = COL_WEIGHTS[count];
  const total = weights ? weights.reduce((sum, w) => sum + w.weight, 0) : 0;
  return (
    <div>
      <table
        {...props}
        className={[weights ? "table-fixed" : "", className].filter(Boolean).join(" ")}
      >
        {weights && (
          <colgroup>
            {weights.map(({ key, weight }) => (
              <col key={key} style={{ width: `${((weight * 100) / total).toFixed(3)}%` }} />
            ))}
          </colgroup>
        )}
        {withCodeBreaks(children)}
      </table>
    </div>
  );
}

export function useMDXComponents(components?: MDXComponents) {
  const { Button } = useSiteSkin();
  return {
    Tabs: DocsTabs,
    Tab: DocsTab,
    Button,
    a: MdxLink,
    h1: mdxHeading("h1"),
    h2: mdxHeading("h2"),
    h3: mdxHeading("h3"),
    h4: mdxHeading("h4"),
    h5: mdxHeading("h5"),
    h6: mdxHeading("h6"),
    table: MdxTable,
    pre: DocsCodeBlockShaped,
    ComponentPreview,
    MotionPreferenceStatus,
    PackageManagerTabs,
    Source,
    Installation,
    IconAdapterPlayground,
    Link,
    ...components,
  } satisfies MDXComponents;
}

function DocsCodeBlockShaped(props: React.ComponentProps<"pre">) {
  const code = extractText(props.children);
  const isCompiledShiki =
    typeof props.className === "string" && props.className.includes("shiki");
  if (isCompiledShiki) {
    return (
      <CodeSurface code={code}>
        <pre {...props} />
      </CodeSurface>
    );
  }
  const lang = /language-(\w+)/u.exec(String(props.className ?? ""))?.[1] ?? "text";
  return (
    <CodeSurface code={code}>
      <DocsCodeBlock code={code} lang={lang} />
    </CodeSurface>
  );
}

function extractText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map((child) => extractText(child)).join("");
  if (React.isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children);
  }
  return "";
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof useMDXComponents>;
}
