# Breadcrumb 皮肤（app/ui/skins/breadcrumb.tsx）

1. 整条：`text-sm` 字号加 label 声（`control-label`：大写 / 最重字重 / 最宽字距），行高 `leading-relaxed`；属行内文字豁免车道，链接不撑高行盒。
2. 列表与条目：`flex` 行内流、随容器换行、去列表标记，条目与分隔符之间 `gap-x-4`。
3. 链接：平时无下划线，`foreground` 文字色；悬停加下划线（`underline-offset-4`，文字型 hover 规范，与 button text 角色一致），按下压平。
4. 当前页：最重字重（`font-strong`）+ `foreground` 文字色，无框、无悬停。
5. 分隔符：`foreground` 文字色，内置 chevron 内容 14（`size-3.5`）；消费者传入的 `children` 图标自带尺寸，槽不定大小。
6. 专属令牌：无。
