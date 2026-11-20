# Avatar 皮肤（app/ui/skins/avatar.tsx）

1. 外框：44×44，`disc` 圆角，`border` 描边（颜色走 `border` 令牌）+ `shadow-base` 抬起，`bg-surface` 背景色，裁切溢出。
2. 图片槽：铺满整格。
3. 缺省加载占位：调用方未传 skeleton 时，皮肤渲染自有的 shimmer 块（自带样式：铺满整格、背景色 + `motion-safe:animate-pulse`，`data-motion="reduce"` 下压平）。
4. 缺省失败占位：调用方未传 fallback 时，皮肤渲染自有的空底格子（自带样式：铺满整格、静态背景色）。
5. 文字 fallback：调用方传字符串时，皮肤包进自有的居中文字 span（`p-3` 居中，`text-base` + label 三项，文字色取与外框背景色配对的 `surface-fg`）；传元素时原样渲染，外观归调用方。
6. 专属令牌：`disc` 圆角，取值见各方案 `design.md` 的 `rounded.disc`。
