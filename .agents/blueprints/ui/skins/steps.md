# Steps 皮肤（app/ui/skins/steps.tsx）

1. 条根：`flex` 行 + 顶对齐 + `text-foreground`；纵向翻转轴、条目拉伸——轴向在皮肤内解析成两套类串（`stepsRootClasses(orientation)` / `stepsPartClasses(orientation)`，wrapper 按 orientation prop 选一套经槽位下发，默认横向），不用后代选择器。
2. 标记：`size-6` 圆形 + `border-frame border-border` 描边，`text-xs` + 最重字重 + `grid place-items-center`（place-items 居中图形与数字），内置图形 `size-3.5`；状态单极律——基态铺 `primary` 对（背景色 + 配对文字色，completed / current 共用），未到（`data-[state=upcoming]`）单极覆盖底色透明 + `text-inherit`（继承条根 `foreground` 文字色）；可点时（`data-[clickable=true]`）`::after` 外扩 44 命中（`inset: calc(50% - var(--height-control)/2)`）、hover：已到步（`primary` 填充）留在同族换 `primary-accent` 档，未到步吃 `accent` 背景档，文字色一律不动——点与标题开同一步；不可点步（标记 `disabled`）选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover 类。无 finished 态（用户定 2026-11-23，只区分完成与未完成）。
3. 连接线：横排 `h-px` 跨到下一标记、纵排 `w-px flex-1`；走过侧（completed / current）铺 `primary`、未到（upcoming）转 `bg-border`（用户定 2026-11-26：凹槽 `bg-surface` 与背景同色看不见，轨道一律用 border 色可见）。
4. 文本列与行文：横向居中排（标题 `text-xs`、描述 `text-xs` + `font-field` + `foreground`），纵向左对齐（标题 `text-sm`）；标题未到转 `foreground`；步内容 `text-base` + `leading-body`。
5. 组合导出：`stepsRootClasses(orientation)` / `stepsPartClasses(orientation)`（按方向选一套），供使用方自行组合复用。
6. 专属令牌：无。
