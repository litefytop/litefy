# Meter 皮肤（app/ui/skins/meter.tsx）

- 定位：连续条量具（模仿原生 meter 形态，与 Progress 拉开——量具是区间读数、Progress 是任务进度），单形态无变体。
- 结构（读数与轨道同轴——slider 文字槽车道）：根 `flex w-full items-center gap-2`；轨道（`track` 槽）`grow min-w-0 h-2 rounded-pill bg-surface overflow-hidden`（轨道族「未填充底 surface」，见 schemes.md 规则 9）；指示条（`fill` 槽）`h-full rounded-pill` + 宽度过渡 `duration-md`（值变化过渡，非 hover 动效）；读数（`value` 槽）`shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground`（`aria-hidden`——值由 `role="meter"` + `aria-valuenow` 表达），内容为原始读数（量程内实际值，非百分比）。
- 颜色通道：填充读 `--litefy-arc`（zone 改道语义背景色档 `var(--success/--warning/--danger)`，300 / 200 档）——对 `surface` 亮档不足 3:1 是既接受项（读数文本替身在，1.4.11 不适用于非必需图形；量具类不强制 1:3，用户定则）；皮肤持弧色通道（历史车道），骨架只发宽度 inline。
- 专属令牌：无——`--litefy-arc` 为皮肤内部通道。
