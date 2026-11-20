# Toggle 皮肤（app/ui/skins/toggle.tsx）

1. 按下按钮（Toggle）：outline 同款脸——44 命中方（`min-h-control min-w-control`）+ `rounded-pill` + pill 补偿 px（`--radius-pill` 同式算式，见 `ui/schemes.md` 第 14 条）+ `py-1`，`border-hair` 边宽档（minimal 1px 可见、neo 同 stroke）+ `bg-background` 底色 + `shadow-frame` 静止阴影，`text-sm` + `font-label` 档 + label 两项 + `foreground`；hover（非禁用）换 `accent` 对 + `shadow-frame-hover`，`active:crush` 压平 + `shadow-frame-active`；按下（`aria-[pressed=true]`，骨架两态都写）换 `primary` 背景色 + `primary-fg` 前景色；`motion-frame` 过渡束；禁用无 hover。
2. 组条（ToggleGroup）：网格等宽列（`grid w-full grid-flow-col auto-cols-fr`）+ `overflow-hidden` + `rounded-pill` 收口——外壳 owns 圆角，条目项转 `rounded-none` 同框、随列等宽，px 退回基础档（补偿归零，第 14 条）。
3. 专属令牌：无。
