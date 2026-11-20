# Steps 皮肤（app/ui/skins/steps.tsx）

1. 条根：`flex` 行 + 顶对齐；纵向（`data-[orientation=vertical]`）翻转轴、条目拉伸——轴向在皮肤内解析成两套类串（`stepsPartClasses()`，横竖两套槽位类以 `data-[orientation=…]` 前缀并存、随运行期 `data-orientation` 切换，皮肤层不持静态方向），不用后代选择器。
2. 标记：`size-6` 圆形 + `border-frame border-border` 描边，`text-xs` + 最重字重，内置图形 `size-3.5`；状态填色——完成 / 当前 / 终点铺 `primary` 对（背景色 + 配对文字色），未到底色透明、只转 `surface-fg` 文字色；终点（`data-[state=finished]`）额外叠 `shadow-checked` 强调环，区别于普通完成；可点时（`data-[clickable=true]`）`::after` 外扩 44 命中（`inset: calc(50% - var(--height-control)/2)`）、hover 换 `accent` 对——点与标题开同一步。
3. 连接线：横排 `h-px` 跨到下一标记、纵排 `w-px flex-1`；走过侧（completed / current / finished）铺 `primary`、未到（upcoming）转 `surface`。
4. 文本列与行文：横向居中排（标题 `text-xs`、描述 `text-xs` + `font-field` + `surface-fg`），纵向左对齐（标题 `text-sm`）；标题未到转 `surface-fg`；步内容 `text-base` + `leading-body`。
5. 组合导出：`stepsRootClasses` / `stepsPartClasses()`（无参，双套并存）供 Wizard、InlineWizard 复用。
6. 专属令牌：无。
