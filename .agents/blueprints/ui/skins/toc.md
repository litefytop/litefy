# Toc 皮肤（app/ui/skins/toc.tsx）

1. 双形态：桌面 rail（`hidden xl:block sticky top-8 w-56`）与窄屏披露（`xl:hidden` 浮层）同在 DOM，档位显示由方案裁决——80rem 是文档阅读列自己的分界，不占 Layout 三档断点。
2. rail：`border-l-frame` 左缘线；标题 `font-strong` + `mb-3`；列表声明 `text-inherit`，条目正文继承列表文字色（常规字重、默认字距、不变形），一级目录（`data-depth` 1–2）叠 label 声（`control-label`）——层级靠字声差 + 缩进梯双通道读出；hover 吃 `accent` 背景档（并写它的配对前景 `accent-fg`）；缩进梯随 `data-depth`（3–6 级每级递进 0.75rem）。激活呈现两变体（`variant`，默认 `fill`）：`fill` 激活行整行铺 `primary` 对（背景填充式）；`line` 激活行不铺色、只换 `foreground`，位置由左缘滑标独占表达（线条式）。
3. 滑标：左缘 2px 竖条 + `rounded-sm` + `primary` 底色；`transform` 由骨架内联（测量 offset + scale），类只声明锚点（`origin-top`）与节奏（`duration-sm`）。
4. 窄屏状态条：`max-xl` 固定右上角浮签——`surface-raised` 背景色 + `foreground` 文字色 + 发丝边 + `rounded-xl` + `text-xs` + `font-field`，进度环、当前标题与 chevron 三节取 `gap-x-2`（经验规则：行式组合内图标与文字同档），当前标题子节点 `text-inherit`，可点，hover 吃 `accent` 背景档（并写它的配对前景 `accent-fg`），`focus-visible:focus-ring` 焦点读法；当前标题单行截断。
5. 窄屏面板：浮层配方（`rounded-xl` + `border-frame` + `surface-raised` + `shadow-elevated`），自滚动（`max-h-[min(24rem,60vh)]`）。
6. 进度环：`size-5`；轨描边走 `border`（用户定 2026-11-26：轨道族一律 `border`，细线读对比不读凹槽明度）、弧走 `primary`；`-rotate-90` 起点朝上，弧长过渡 `duration-sm`。
7. chevron：`size-4` + `text-inherit`，展开翻转。
8. 专属令牌：无。
9. 变体通道：`variant?: "fill" | "line"` 为皮肤层 prop（纯外观，骨架不感知），默认 `fill`。
10. 形态槽锁死：`rail` / `status` / `panel` 三槽承载双形态的断点几何（`hidden xl:block` / `max-xl:fixed` / `xl:hidden` 与定宽），属完整组件的形态关键槽——皮肤合并消费方 `classNames` / `styles` 前先剔除这三键，消费方覆盖一律忽略，三槽恒取皮肤常量；其余装饰槽（title / scroll / list / item / thumb / ring / ringTrack / ringProgress / current / chevron）仍开放覆盖（ui-rules usage 5：完整组件形态类名按形态分离、形态关键槽不开放覆盖）。
