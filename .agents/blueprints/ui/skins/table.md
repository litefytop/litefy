# Table 皮肤（app/ui/skins/table.tsx）

1. 条根：`@container` 容器查询载体 + 横向滚动容器（`overflow-x-auto`、`scrollbar-gutter:stable`），`border-control` 边宽档 + `surface-raised` 背景色 + `shadow-surface` 浮起；列数由骨架内联 `--litefy-cols` 发布，头与体各自以 `6rem × 列数` 锁条宽下限（1 只是手工装配兜底）——列宽不随视口缩水，宽容器触底即自然横向滚动。
2. 表基：`w-full` + `border-collapse` + `text-sm` + 等宽数字；自带表格重置——reading scope 里的散文表规则（满边框、块外距）会被压制。移动端不换形：列宽不缩水、只横向滚动，表格语义原样保留（WCAG 1.4.10 数据表二维滚动豁免），同列对比不丢，筛选行与排序表头在移动端原样可用。
3. 表头：行 `bg-surface` 底 + `border-b-hair` 分隔；头格 `h-control` 高、`px-3`、`text-sm` + `font-label` 档 + label 两项 + `surface-fg` 文字色，对齐随 `data-align`；可排序（`data-[sortable]`）`cursor-pointer` + hover 换 `accent` 对；排序图标 `size-3.5` 平时 40% 显，激活（`data-[active=true]`）全显转 `foreground` 文字色。
4. 行与格：行 `border-b-hair` 分隔（末行无线）+ hover 换 `accent` 对；格 `px-3 py-2`、对齐随 `data-align`、断词。
5. 空态：居中 `surface-fg`。
6. 批量行：格内操作条 `flex min-h-control items-center gap-x-3 px-3`——计数 `text-sm font-strong`、标签与清除钮 `text-sm text-surface-fg`（清除钮 `ms-auto` + 悬停转 `foreground` 加下划线 + 焦点环）、`bulkActions` 容器 `flex items-center gap-x-2`（消费方按钮自带样式）；复选框经 `checkbox` 槽整包装 Checkbox 零件（`checkboxPartClasses`）。
7. 专属令牌：无。
