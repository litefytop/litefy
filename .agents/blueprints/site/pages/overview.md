# 总览页（content/docs/overview.*.mdx · /:lang/docs/overview）

- 层：界面域·功能页——页面主体只有示例墙（`site/widgets/example-wall.md`），无正文文案、无文档页头（DocsArticle 的标题、描述、复制 Markdown 工具条一律不渲染，页题由示例墙自身标题承担）。
- `content/docs/overview.mdx` 与 `overview.zh.mdx` 是元数据宿主：只保留 frontmatter（title/description），供侧栏树与搜索编目；正文不渲染，路由不预取该页（`preloadDocsPage` 跳过 overview）。
- 页面 head 元数据（title/description/social tags）由路由按 `docsIndexI18n` 直出。
- 不进 llms 集合：`docs-view.tsx` 对 `overview` 直接跳过全文输出；本页不维护组件清单，新增组件自动上墙。
- 侧栏位置由 `content/docs/_meta.ts` 决定，壳与入口归 `site/shell/navigation.md`。
