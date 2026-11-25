# Progress 皮肤（app/ui/skins/progress.tsx）

1. 形态（读数与轨道同轴——slider 文字槽车道）：根 `group flex w-full min-w-0 items-center gap-2`，不设固定最小宽；轨道（`track` 槽）`grow min-w-0 h-2 rounded-pill bg-surface overflow-hidden`（8px 量具车道，轨道族「未填充底挂凹槽档 `surface`」，见 schemes.md 规则 9）；读数（`value` 槽）`shrink-0 min-w-11 text-right whitespace-nowrap text-xs tabular-nums text-foreground`（slider 同款文字槽、`aria-hidden`——值由 `role="progressbar"` + `aria-valuenow` 表达，读数是明眼低视力用户的可见替身；`min-w-11` 按数字件车道 11 的倍数预留 `100%` 全宽、`text-right` 恒贴右缘——读数 `0%` → `100%` 变宽不挤轨道，轨道宽度恒定）。
2. 填充条：`rounded-pill` + 门控颜色工具类（见 3）+ 宽度过渡 `duration-md`（各方案自己的中档时长）；无末端竖线——进度位置由读数文本承担。
3. 颜色通道（用户定 2026-11-23 禁动态改令牌值）：废 `--litefy-arc` / `--litefy-arc-fill` 别名设值；根已有 `group`，填充条直接门控颜色工具类动态使用令牌——缺省 `bg-primary`，`group-data-[abort=true]` → `bg-danger`、`group-data-[complete=true]` → `bg-success`、`group-data-[paused=true]` → `bg-warning`（状态为运行期，保留 CSS 门控免重渲染；正向进度不随值分档；paused 归 warning 族、不取 info），源序 abort > complete > paused；填充图由颜色工具类内置（`@utility bg-*` 已带 `background-image: var(--fill-*, none)`，不另挂任意值类，用户定 2026-11-24），纯色案答 `none` 自动回落纯色（进度填充无精确颜色传递职责，渐变案随族渐变，用户定 2026-11-22）。剩余量 / 倒计时读数不进本组件——量具分档归 Meter（默认阈值与本车道 20/60 同源）。
4. meter 档（`data-variant="meter"`）：轨道经 `group-data-[variant=meter]` 升 `h-3`（12px）+ `border-frame` 描边——带框仪表形态，显式选择才用；内联细条恒 `h-2`（8px）、meter 恒 `h-3`，两档高度都走数字乘道、随案缩放，不设消费者阶梯。
5. 专属令牌：无——`--litefy-percent` 为注册机制属性；弧色/填充图别名通道已废，颜色直接门控工具类。
