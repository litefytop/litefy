# Thought Line 皮肤（app/ui/skins/thought-line.tsx）

1. 行件：`inline-flex items-center gap-x-2 text-sm font-field text-foreground`；glyph 槽 `size-4 shrink-0`（`dot` 形态为 `rounded-pill bg-current` 圆点；默认 `lattice` 形态走 lattice 槽——`LatticeLoader` 皮肤根类 + `shrink-0`，并经 `latticeClassNames` 直通 LatticeLoader 皮肤槽位包，波形与定格对勾的外观由 LatticeLoader 皮肤供给）；body 槽 `grid` 叠放锚（label 与 done 同占一格，列宽取两句较大者，timer 落第二列——交叉淡变零位移，timer 永不被句子压字）；timer 槽 `font-mono text-xs text-surface-fg`（工作态随秒跳动，定格后并入完成句）；chevron 槽 `size-4 text-surface-fg`，`data-open` 翻转朝向（`duration-sm` 档）。
2. 呼吸：根挂 `group/thought`；`data-working=true` 时 glyph 槽与 label 槽各自 `motion-safe:group-data-[working=true]/thought:animate-pulse`（方案重答的脉冲档：minimal 柔和两极、neo 硬切两档）；定格后无呼吸。
3. 定格：完成句与工作句在 body 槽 grid 同格叠放（`col-start-1 row-start-1`）；完成句是皮肤经 `renderLabel` 包装的自有 span（工作句原样直过），用户自带 `renderLabel` 时由其接管整形；`data-working` 翻转时两层交叉淡变（`duration-sm` 档——minimal 150ms 内完成、neo 即 0ms 硬切），被换下层带轻模糊退场（`blur-xs` 挂在隐藏态变体上，显形层不挂模糊）；timer 槽数字冻结即定格。
4. 步骤列表：折叠用 `grid-template-rows` 法（`data-open` 在 `0fr/1fr` 间切换，`duration-md` 档——minimal 300ms、neo 150ms，折叠高度豁免）；`stepsShell` 槽（折叠壳，0fr 技巧的直接 grid 子项）挂 `min-h-0 overflow-hidden`，轨道才能真实收缩；`li` 行 `flex items-center gap-x-2 text-sm`，已完成步 marker 为内置 `Check` 图标 + `text-surface-fg` 弱化，进行中步 marker 为 `rounded-pill bg-current` 小点 + 全 `foreground` 文字色；步骤整体相对 label 缩进对齐（`pl-6`，即 glyph 宽 + 行内距）。
5. 无障碍下限：行件焦点环按律挂 `focus-visible:focus-ring`（可聚焦形态才有）；`prefers-reduced-motion` 下呼吸与扫光停摆，定格改为直接换文案。
6. 专属令牌：无（呼吸与定格时长都读方案既有动效档）。
