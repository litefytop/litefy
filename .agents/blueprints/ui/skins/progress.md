# Progress 皮肤（app/ui/skins/progress.tsx）

1. 形态（读数与轨道同轴——slider 文字槽车道）：根 `group flex w-full items-center gap-2`；轨道（`track` 槽）`grow min-w-0 h-2 rounded-pill bg-surface overflow-hidden`（8px 量具车道，轨道族「未填充底 surface」，见 schemes.md 规则 9）；读数（`value` 槽）`shrink-0 whitespace-nowrap text-xs tabular-nums text-foreground`（slider 同款文字槽、`aria-hidden`——值由 `role="progressbar"` + `aria-valuenow` 表达，读数是明眼低视力用户的可见替身）。
2. 填充条：`rounded-pill` + `bg-(--litefy-arc)` + 宽度过渡 `duration-md`（各方案自己的中档时长）；无末端竖线——进度位置由读数文本承担。
3. 颜色通道：皮肤持弧色通道（历史车道，骨架只发宽度 inline）——`--litefy-arc` 缺省 `primary`，`data-[abort=true]` → `danger`、`data-[complete=true]` → `success`、`data-[paused=true]` → `warning`（正向进度不随值分档；paused 是需要注意的中间态，归 warning 族、不取 info），源序 abort > complete > paused。剩余量 / 倒计时读数不进本组件——量具分档归 Meter（默认阈值与本车道 20/60 同源）。
4. meter 档（`data-variant="meter"`）：轨道经 `group-data-[variant=meter]` 升 `h-3`（12px）+ `border-frame` 描边——带框仪表形态，显式选择才用；内联细条恒 `h-2`（8px）、meter 恒 `h-3`，两档高度都走数字乘道、随案缩放，不设消费者阶梯。
5. 专属令牌：无——`--litefy-percent` 为注册机制属性；`--litefy-arc` 为皮肤内部通道。
