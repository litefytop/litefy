# ChipGroup 皮肤（app/ui/skins/chip-group.tsx）

1. 度量双轨：屏上一行 + 屏外测量副本（`-top-[9999px] -left-[9999px]`、`pointer-events-none`）——副本供溢出测量，必须与行同款排版，chip 外观经 `classNames.chip` 同时发给两轨；行只补收口的 `max-w-full overflow-hidden`。
2. Chip 槽：`min-h-5` 小条，`rounded-sm` 圆角 + `border-control` 边宽档 + `px-2` 内边距，`text-xs` + `leading-4` + label 两项（`tracking-label` / `case-label`，常规字重不加粗），不换行；基础底色 `bg-surface` 配 `text-surface-fg` 文字色；链接 / 按钮形态（`:is(a,button)`）抬到 `min-h-control` 命中并接 `hover` 对。
3. 变体随 `data-variant`（消费方声明的开关）：`primary` 背景色 + `primary-fg` 文字色；`outline` 透明底配 `foreground` 文字色；四个状态变体铺方案状态背景档、文字取配对 `*-fg`。
4. 溢出槽（more）：`inline-flex shrink-0`，装载省略 chip——同一 chip 类叠 `max-w-40` 截断。
5. 专属令牌：无。
