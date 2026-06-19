import browserCollections from "collections/browser";
import type { Folder, Item } from "fumadocs-core/page-tree";
import { deserializePageTree } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import { Link, useParams } from "react-router";
import { getMDXComponents } from "@/components/mdx";
import { pageTrees } from "@/generated/page-trees";
import { i18n } from "@/lib/i18n";
import { baseOptions } from "@/lib/layout.shared";
import { buildMarkdownUrl } from "@/lib/markdown-url";
import { gitConfig } from "@/lib/shared";
import type { Route } from "./+types/docs";

type Locale = keyof typeof pageTrees;

const docsIndexI18n = {
  en: {
    title: "Documentation",
    description:
      "Browse our comprehensive documentation to learn about all available features.",
    categoryDefaultDescription: "View related documentation",
    footerText:
      "Can't find what you need? Try the [Registry Directory](/docs/directory) for community-maintained components.",
  },
  zh: {
    title: "文档",
    description: "浏览我们全面的文档，了解所有可用功能。",
    categoryDefaultDescription: "查看相关文档",
  },
} as const;

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
          <Mdx components={getMDXComponents()} />
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
    <div className="space-y-12">
      {categories.map((category, index) => {
        if (category.type === "folder") {
          const folder = category;
          const items = folder.children.filter(
            (child): child is Item => child.type === "page",
          );

          if (items.length === 0) return null;

          const key = folder.$id ?? folder.name ?? index;

          return (
            <div key={String(key)} className="space-y-4">
              <h2 className="text-2xl font-bold">{folder.name}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, itemIndex) => {
                  const url = item.url || `/${locale}/docs/${item.name}`;
                  const itemKey = item.$id ?? item.name ?? itemIndex;

                  return (
                    <Link
                      key={String(itemKey)}
                      to={typeof url === "string" ? url : `/${locale}/docs`}
                      className="group p-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div>
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-fd-muted-foreground line-clamp-2">
                          {item.description || t.categoryDefaultDescription}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        const url = category.url || `/${locale}/docs/${category.name}`;
        const key = category.$id ?? category.name ?? index;

        return (
          <div key={String(key)} className="space-y-4">
            <h2 className="text-2xl font-bold">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to={typeof url === "string" ? url : `/${locale}/docs`}
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
            </div>
          </div>
        );
      })}
    </div>
  );
}

function resolveLocale(input: string | undefined): Locale {
  if (input && input in pageTrees) return input as Locale;
  return i18n.defaultLanguage as Locale;
}

export default function Docs({ params }: Route.ComponentProps) {
  const routeParams = useParams<{ lang: string; "*"?: string }>();
  const locale = resolveLocale(
    (params as { lang?: string }).lang ?? routeParams.lang,
  );
  const wildcard = (params as { "*"?: string })["*"] ?? routeParams["*"] ?? "";
  const slugs = wildcard
    ? wildcard.split("/").filter((v: string) => v.length > 0)
    : [];

  const t = docsIndexI18n[locale] || docsIndexI18n.en;
  const tree = deserializePageTree(pageTrees[locale]);

  if (slugs.length > 0) {
    const basePath = slugs.join("/");
    const fullPath = locale === "zh" ? `${basePath}.zh.mdx` : `${basePath}.mdx`;
    const PageContent = clientLoader.getComponent(fullPath);

    if (PageContent) {
      const markdownUrl = buildMarkdownUrl(locale, slugs).url;
      return (
        <DocsLayout {...baseOptions(locale)} tree={tree}>
          <PageContent markdownUrl={markdownUrl} path={fullPath} />
        </DocsLayout>
      );
    }
  }

  const categories = tree.children.filter(
    (node): node is Folder | Item =>
      node.type === "folder" || node.type === "page",
  );

  return (
    <DocsLayout {...baseOptions(locale)} tree={tree}>
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-lg text-fd-muted-foreground">{t.description}</p>
        </div>

        <ComponentsList categories={categories} locale={locale} t={t} />
      </div>
    </DocsLayout>
  );
}
