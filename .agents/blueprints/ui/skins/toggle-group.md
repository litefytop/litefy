# ToggleGroup 皮肤（app/ui/skins/toggle-group.tsx）

1. 变体 prop `variant?: "outline" | "text"`，缺省 outline；变体属皮肤层，骨架不变。
2. outline：外壳 owns 边框与圆角——`grid w-full grid-flow-col auto-cols-fr` + `rounded-pill` + `border-hair border-border` + `overflow-hidden` + `bg-background`（方角裁切裁不出沿弧描边，边框必须由外壳自绘才沿圆角连续）；条目项透明底、随列等宽、`rounded-none`、px 退回基础档（`ui/schemes.md` 第 14 条），去外框与静止阴影（外壳 owns 后条目阴影被裁无效）；hover（非禁用、未按下）换 accent 对，按下换 primary 背景色 + primary-fg 前景色，`active:crush` 保留；相邻条目间 `not-first:border-l-hair` 分隔线，避免相邻选中项的 primary 填充糊成一片。
3. text：无壳无下划线——条目走等宽网格（`grid w-fit min-w-control grid-flow-col auto-cols-fr`，列宽取最宽条目，子项 `min-w-0`）；条目为文字钮形态（与 `buttonVariants.text` 同形但无 hover——text 变体无 hover 是 2026-11-20 用户裁定，故不引用 button 变体，手写脸：`min-h-control min-w-0` + px 基础档 + `text-sm` + `font-label` 档 + label 两项 + `text-surface-fg` + `cursor-pointer select-none`）+ `rounded-sm`；按下（`aria-[pressed=true]`）换 primary 背景色 + primary-fg 前景色（无加粗、无下划线，选中标记即色块）；选中态切换为颜色瞬时对调，过渡走 `motion-frame`。
4. 专属令牌：无。
