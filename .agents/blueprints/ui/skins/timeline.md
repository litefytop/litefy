# Timeline 皮肤（app/ui/skins/timeline.tsx）

1. 两向（皮肤 wrapper `orientation` prop 解析成两套类串，骨架根上发 `data-orientation`；默认 `vertical`）：
   - `vertical`：裸列表纵排（`flex-col`），条目 `pb-6` 节奏（末条 `pb-0`）。
   - `horizontal`：`flex-row items-start`，条目转纵向列（脊柱在上、内容在下），条目间距 `pr-6`（末条 `pr-0`）。
2. 脊柱：点与线的轴（`items-center`）；连接线以负缘延伸进条目间距空档、与下一项圆点相接（末条无连接线），成连续线而非一段段，圆点 `z-10` 盖住交接处——纵向 `w-px flex-1 -mb-6`，横向 `h-px flex-1 -mr-6`；`border` 描边色。
3. 标记：默认 `size-3` 实心点——`rounded-pill` + `border-control` 边宽档 + `primary` 背景色配 `primary-fg` 文字色；条目自带图标（`:has(svg)`）换大号带环 treatment——`size-5` + `border-frame` 边 + 底色方案自答。
4. 内容列：`gap-0.5`；时间 `text-xs` + 等宽数字 + `font-label` + label 两项 + `surface-fg` 文字色；标题 `text-sm` + 最重字重 + `foreground`；描述 `text-sm` + `font-label` + `surface-fg` 文字色。
5. 专属令牌：无。
