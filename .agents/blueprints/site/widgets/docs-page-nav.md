# 文档页底部跳转块（app/components/docs-page-nav.tsx）

- 层：界面域·交互件——文档正文列末尾的上一页 / 下一页跳转块。壳与滚动模型归 `site/shell/navigation.md`，正文归 `content/guide.md`，示例墙页归 `site/pages/overview.md`。
- 数据：只读 `pageTrees` 与 `findNeighbour(tree, url)`，`url` 取 `stripSchemePrefix(pathname)` 去尾斜杠；块内不复制标题、不另建顺序表。前后邻页都缺时整块不渲染。
- 排布：`flex flex-wrap items-center justify-between gap-2 mt-8 sm:mt-12`——两枚 chip 同一行，上一页在首、下一页在尾；下一页 chip 挂 `ms-auto`，单侧缺页时仍守方向位置；不再用两列卡片，也不铺满整行。
- chip：复用 `chipClasses`（`app/ui/skins/chip-group.tsx`）挂在 `Link` 上，经 `cn` 覆盖底色为 `bg-background`，与画布同色；边框、圆角、命中区与 hover 全部由 chip 契约承担，本件不自贴边框 / 阴影 / hover；缺的一侧不渲染禁用仿件。
- chip 单行：不渲染「上一页 / 下一页」文字与键帽，chip 内只有方向箭头 + 页名。上一页 `ArrowLeft` → 页名（起端），下一页 页名 → `ArrowRight`（末端）；页名 `max-w-40 truncate` 防长标题撑破，视觉顺序即 DOM 顺序，不用 `flex-row-reverse`。
- 方向词转可访问名：方向文字不进视觉，但链接必须挂 `aria-label`（`上一页：X` / `下一页：X`，X 为目标页名）；方向图标 `aria-hidden`，读屏仍知方向与去向。
- 键帽：本块不渲染 `kbd`；`Ctrl+←/→` 的提示归浮导航方向按钮的 `title`（`site/shell/navigation.md`），本块只给可点入口。
- 列宽：块不设自身宽度，随所在正文列（`article.typography` 的 `max-w-160`）同宽，不重复挂阅读列宽档；与正文末尾的间距 `mt-8`、`sm:mt-12`（层级律见 delivery `references/skin-rules.md` 13.1）。
- 排版隔离：块在 `article.typography` 域内挂 `not-typography` 退出，链接不吃正文链接排版。
- 键盘通路：`Ctrl+↑↓←→` 四键只在浮导航一处绑定（`site/shell/navigation.md`），本件不重复监听——两处绑定会双触发。
