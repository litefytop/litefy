# Toggle 皮肤（app/ui/skins/toggle.tsx）

1. 按下按钮（Toggle）：文字钮形态——`min-h-control min-w-0` + px 基础档 + `gap-x-2` + `text-sm` + `control-label` + `text-foreground` + `cursor-pointer select-none` + `rounded-sm`；按下（`aria-[pressed=true]`，骨架两态都写）换 primary 背景色 + primary-fg 前景色（无加粗、无下划线，选中标记即色块）；无 hover（2026-11-20 文字钮形态用户裁定）；选中态切换为颜色瞬时对调，过渡走 `motion-frame`；禁用选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / active。
2. 用法分工：互不绑定的独立开关（粗体 / 倾斜一类）逐个使用本件；一组相关选项用组条 ToggleGroup，见 `ui/skins/toggle-group.md`。
3. 专属令牌：无。
