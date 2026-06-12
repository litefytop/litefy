import type { Route } from "./+types/docs";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { getPageMarkdownUrl, source } from "@/lib/source";
import browserCollections from "collections/browser";
import { baseOptions } from "@/lib/layout.shared";
import { gitConfig } from "@/lib/shared";
import { deserializePageTree } from "fumadocs-core/source/client";
import { useMDXComponents } from "@/components/mdx";
import { i18n } from "@/lib/i18n";
import { Link, useParams } from "react-router";

import type { Folder, Item } from "fumadocs-core/page-tree";

const docsIndexI18n = {
  en: {
    title: "Components",
    description:
      "Here you can find all the components available in the library. We are working on adding more components.",
    categoryDefaultDescription: "View related component documentation",
    footerText:
      "Can't find what you need? Try the [Registry Directory](/docs/directory) for community-maintained components.",
  },
  zh: {
    title: "组件",
    description: "这里可以找到库中所有可用的组件。我们正在持续添加更多组件。",
    categoryDefaultDescription: "查看相关组件文档",
  },
} as const;

export async function loader({ params }: Route.LoaderArgs) {
  const locale = (params as { lang?: string }).lang || i18n.defaultLanguage;
  const wildcard = (params as { "*"?: string })["*"];
  const slugs = wildcard
    ? wildcard.split("/").filter((v: string) => v.length > 0)
    : [];

  if (slugs.length === 0) {
    const pageTree = await source.serializePageTree(source.getPageTree(locale));
    return {
      mode: "index" as const,
      pageTree,
      locale,
    };
  }

  const page = source.getPage(slugs, locale);
  if (!page) throw new Response("Not found", { status: 404 });

  return {
    mode: "page" as const,
    path: page.path,
    markdownUrl: getPageMarkdownUrl(page).url,
    pageTree: await source.serializePageTree(source.getPageTree(locale)),
    locale,
  };
}

const clientLoader = browserCollections.docs.createClientLoader({
  component(
    { toc, frontmatter, default: Mdx },
    {
      markdownUrl,
      path,
    }: {
      markdownUrl: string;
      path: string;
    },
  ) {

    
    return (
      <DocsPage toc={toc}>
        <title>{frontmatter.title}</title>
        <meta name="description" content={frontmatter.description} />
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover
            markdownUrl={markdownUrl}
            githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
          />
        </div>
        <DocsBody>
          <Mdx components={useMDXComponents()} />
        </DocsBody>
      </DocsPage>
    );
  },
});

function ComponentsList({
  categories,
  locale,
  t,
}: {
  categories: (Folder | Item)[];
  locale: string;
  t: typeof docsIndexI18n.en | typeof docsIndexI18n.zh;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => {
        const url =
          category.type === "folder"
            ? category.index?.url || `/${locale}/docs`
            : category.url;

        const key = category.$id ?? category.name ?? index;

        return (
          <Link
            key={String(key)}
            to={typeof url === "string" ? url : "/"}
            className="group p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-fd-muted-foreground line-clamp-2">
                {category.description || t.categoryDefaultDescription}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default function Docs({ loaderData }: Route.ComponentProps) {
  const params = useParams<{ lang: string }>();
  const currentLocale =
    params.lang || loaderData.locale || i18n.defaultLanguage;
  const t =
    docsIndexI18n[currentLocale as keyof typeof docsIndexI18n] ||
    docsIndexI18n.en;
  const tree = deserializePageTree(loaderData.pageTree);

  if (loaderData.mode === "page") {
    return (
      <DocsLayout {...baseOptions(currentLocale)} tree={tree}>
        {clientLoader.useContent(loaderData.path, {
          markdownUrl: loaderData.markdownUrl,
          path: loaderData.path,
        })}
      </DocsLayout>
    );
  }

  const categories = tree.children.filter(
    (node): node is Folder | Item =>
      node.type === "folder" || node.type === "page",
  );

  return (
    <DocsLayout {...baseOptions(currentLocale)} tree={tree}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-fd-muted-foreground">{t.description}</p>
        </div>

        <ComponentsList categories={categories} locale={currentLocale} t={t} />
      </div>
    </DocsLayout>
  );
}
