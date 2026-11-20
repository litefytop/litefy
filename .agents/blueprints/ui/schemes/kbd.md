# Kbd 键帽（app/ui/schemes/<slug>/index.css 的 `@utility kbd`）

蓝图：schemes.md rule 8 第 ⑤ 块在本文件展开。

1. 定位：纯样式件不设组件、无导出、无安装——类名即约定（同 typo-* 先例），键名语义由消费方书写的原生 `kbd` 元素自带；三案在第 ⑤ 块声明同构 `@utility kbd`，本体逐字相同、只由数字乘道与令牌 var() 组成，随 `--spacing` 逐案缩放；静态件禁 hover 动效。
2. 形态：行内键帽，Command 皮肤的 `shortcut` 槽直接引用 `kbd` 类（同源单一正本）；行内贴排 `align-middle`、`h-5 min-w-5` 定档、`px-2 py-0`、`rounded-sm`、`border-frame` + `border-border` 描边、`bg-background` 配 `text-foreground`、`font-mono text-xs leading-4 font-strong tracking-label`、`shadow-subtle` 托底。
3. 专属令牌：无。
