# ToggleGroup 皮肤（app/ui/skins/toggle-group.tsx）

1. 组条无变体，唯一形态为描边条，承载一组相关选项的多选：外壳 owns 边框与圆角——`grid w-full grid-flow-col auto-cols-fr` + `rounded-pill` + `border-hair border-border` + `overflow-hidden` + `bg-surface-raised` 凸起档配 `text-surface-raised-fg`（方角裁切裁不出沿弧描边，边框必须由外壳自绘才沿圆角连续）；条目项 `flex`、透明底、随列等宽、`rounded-none`、px 退回基础档，去外框与静止阴影（外壳 owns 后条目阴影被裁无效）；hover（非禁用）吃 accent 背景档（并写它的配对前景 `accent-fg`），按下换 primary 背景色 + primary-fg 前景色并在悬停时留在同族 `primary-accent` 档，`active:crush` 保留；相邻条目间 `not-first:border-l-hair` 分隔线，避免相邻选中项的 primary 填充糊成一片；条目按 `disabled` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / active。
2. 互不绑定的独立开关不用组条——逐个使用 `Toggle`（见 `ui/skins/toggle.md`）。
3. 专属令牌：无。
