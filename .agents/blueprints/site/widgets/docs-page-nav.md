# 文档页底部跳转块（app/components/docs-page-nav.tsx）

- 层：界面域·交互件——文档正文列末尾的上一页 / 下一页跳转块。壳与滚动模型归 `site/shell/navigation.md`，正文归 `content/guide.md`，示例墙页归 `site/pages/overview.md`。
- 数据：只读 `pageTrees` 与 `findNeighbour(tree, url)`，`url` 取 `stripSchemePrefix(pathname)` 去尾斜杠；块内不复制标题、不另建顺序表。前后邻页都缺时整块不渲染。
- 排布：`grid gap-4 sm:grid-cols-2`，上一页锁 `sm:col-start-1`、下一页锁 `sm:col-start-2`——单侧缺页空出的是那一列，剩余卡片不换位，方向与左右位置恒定绑定；窄档单列按 DOM 序上下堆叠，阅读顺序与视觉顺序一致。
- 卡片：复用 `CardLink`（`app/components/card-link.tsx`），可点态、边框、投影与 hover 位移全由 `cardClasses` + `cardButtonClasses` 承担，本件不自贴 hover / 边框 / 阴影串；缺的一侧不渲染禁用仿件，也不留空位。
- 卡内两行：次行是目标页标题，首行是方向图标（`ArrowLeft` / `ArrowRight`，`aria-hidden`）+ 方向文字 + 键帽；两行衔接 `gap-1`。左卡整列 `start` 对齐、键帽 `ms-auto` 顶到列尾；右卡整列 `end` 对齐（`items-end` + `text-end`，经 `cn` 消解 `cardButtonClasses` 的 `text-left`），首行写成满宽的 `flex-row` 并把 DOM 序排为 键帽 → 文字 → 图标、键帽 `me-auto` 顶到列首——视觉顺序即 DOM 顺序，不用 `flex-row-reverse` 调换（`ui-rules` `understandable.md` 2）。
- 键帽：原生 `kbd` 元素挂 `kbd` 类（`ui/schemes/kbd.md` 同源），写 `Ctrl ←` / `Ctrl →`，挂 `aria-hidden`——键帽是视觉提示，键盘通路已在全局键位；链接可访问名只由「方向 + 目标页标题」构成。
- 列宽：块不设自身宽度，随所在正文列（`article.typography` 的 `max-w-160`）同宽，不重复挂阅读列宽档；与正文末尾的间距 `mt-12`，大于卡间 `gap-4`（层级律见 delivery `references/skin-rules.md` 13.1）。
- 排版隔离：块在 `article.typography` 域内挂 `not-typography` 退出，链接不吃正文链接排版。
- 键盘通路：`Ctrl+↑↓←→` 四键只在浮导航一处绑定（`site/shell/navigation.md` 13），本件只显式提示、不重复监听——两处绑定会双触发。
