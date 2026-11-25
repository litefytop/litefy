# ChipGroup 皮肤（app/ui/skins/chip-group.tsx）

1. 度量双轨：屏上一行 + 屏外测量副本（`-top-[9999px] -left-[9999px]`、`pointer-events-none`）——副本供溢出测量，必须与行同款排版，chip 外观经 `classNames.chip` 同时发给两轨；行只补收口的 `max-w-full overflow-hidden`。
2. Chip 槽：`min-h-5` 小条，`rounded-sm` 圆角 + `border-control` 边宽档 + `px-2` 内边距，`text-xs` + `leading-4` + label 两项（`tracking-label` / `case-label`，常规字重不加粗），不换行；基础底色 `bg-surface-raised` 配 `text-surface-raised-fg` 文字色（Chip 归凸起档——它是可点可删的控件面，不是承载内容的凹槽，见 `ui/schemes/elevation.md`）；链接 / 按钮形态（`:is(a,button)`）抬到 `min-h-control` 命中并接 accent 背景档悬停（并写它的配对前景 `accent-fg`）。
3. 变体纯皮肤态、JS 选择（button 范式，用户定 2026-11-23）：皮肤层定义 `chipVariants` 映射（surface / primary / outline / success / warning / danger / info，各一条扁平类串——背景档 + 配对 `*-fg` 文字色），skin wrapper 经 `pickVariant` 读组级 `data-variant` 取键、选 `chipVariants[key]` 一条并入 chip 槽发给所有 chip（默认 surface）。变体不是逻辑状态：不挂 data 属性做样式门控、不在 class 枚举 `data-[variant=...]`；骨架 `ChipItem` 不含 variant，变体不进骨架接口。链接 / 按钮形态抬 `min-h-control` 命中归基础 chip 串。
4. 溢出槽（more）：`inline-flex shrink-0`，装载省略 chip——同一 chip 类叠 `max-w-40` 截断。
5. 专属令牌：无。
