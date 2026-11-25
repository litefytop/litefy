# Banner 皮肤（app/ui/skins/banner.tsx）

1. 根（消费者 `className` 通道）：整宽 `bg-surface` 背景色 + `surface-fg` 文字色，`flex items-center` 排布视口与关闭钮；文字排版 `text-base` 字号加 `leading-relaxed` 行高，label 三项走 `font-field` / `tracking-label` / `case-label`；不描边、无阴影。
2. `closable` 为 true 时根条件补 `relative`（脱离文档流关闭钮的锚点）与 `min-h-control`（关闭钮 44 命中区整高）；为 false 不自带定位与最小高度。
3. 视口槽：`flex-1 min-w-0 overflow-hidden`——占满根宽、防轨道撑破、裁切溢出。
4. 轨道槽：`flex` 排成一行不换行、宽度由内容决定、垂直居中。
5. 条目槽：`inline-flex` 不被压缩、垂直居中，条目间 `gap-x-4`；`px-12` 内边距承担首尾节奏，尾部空档同时容纳关闭钮的命中区；骨架的尾随间距（撑满视口用）内联在同一元素上。
6. 关闭钮槽：复用 `buttonVariants.text` 文字钮——无 hover 反馈（下划线对纯图标不可见）、命中下限、焦点环、图标随控件文字均随变体；只叠加差异：`bg-surface text-surface-fg` 背景与文字配对，末端绝对定位 `end-0 top-1/2 -translate-y-1/2` 垂直居中、落在条目尾部内间距空档内。
7. 专属令牌：无。
