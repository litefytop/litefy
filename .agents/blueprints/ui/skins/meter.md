# Meter 皮肤（app/ui/skins/meter.tsx）

- 定位：连续条量具（模仿原生 meter 形态，与 Progress 拉开——量具是区间读数、Progress 是任务进度），单形态无变体。
- 结构（读数与轨道同轴——slider 文字槽车道）：根 `flex w-full items-center gap-2`；轨道（`track` 槽）`grow min-w-0 h-2 rounded-pill bg-surface overflow-hidden`（轨道族「未填充底挂凹槽档 `surface`」，见 schemes.md 规则 9）；指示条（`fill` 槽）`h-full rounded-pill` + 宽度过渡 `duration-md`（值变化过渡，非 hover 动效）；读数（`value` 槽）`shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground`（`aria-hidden`——值由 `role="meter"` + `aria-valuenow` 表达），内容为原始读数（量程内实际值，非百分比）。
- 颜色通道（用户定 2026-11-23 禁动态改令牌值）：废 `--litefy-arc` / `--litefy-arc-fill` 别名设值；根挂 `group/meter`，填充条直接门控颜色工具类动态使用令牌——缺省 `bg-success`，`group-data-[zone=warning]/meter` → `bg-warning`、`group-data-[zone=danger]/meter` → `bg-danger`（zone 为运行期状态，保留 CSS 门控免重渲染）。对 `surface` 亮档不足 3:1 是既接受项（读数文本替身在，1.4.11 不适用于非必需图形；量具类不强制 1:3，用户定则）；填充图由颜色工具类内置（`@utility bg-*` 已带 `background-image: var(--fill-*, none)`，不另挂任意值类，用户定 2026-11-24），纯色案答 `none` 自动回落纯色、渐变案随族渐变（量具填充无精确颜色传递职责，读数有文本替身，用户定 2026-11-22）。
- 专属令牌：无（弧色/填充图别名通道已废，颜色直接门控工具类）。
