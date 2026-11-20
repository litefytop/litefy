# Chart 骨架（app/ui/components/chart.tsx）

- 职责：Canvas 2D 折线/面积/柱状图表，带图例、tooltip、悬停十字线与拖拽缩放。

## 行为 / 状态

- `data` 为 `[x 轴数组, ...各系列数组]` 元组；`series` 配置 `label`/`type`（`line|area|bar`）/`stroke`/`width`/`fill`/`value`（数值格式化）/`show`；`height` 默认 240，`time` 默认 true
- 无障碍：canvas 输出 `role="img"` 与 `aria-label`——`label` prop 优先，缺省取各系列 `label` 以 `, ` 连接，全空回退 `"Chart"`；canvas 不可聚焦，逐点读取由 tooltip 与图例承担
- 系列颜色：`config.stroke` 优先，否则由 `useChartPalette`（utils/use-chart-palette）按 index 取调色板色；`show === false` 或 `hidden` 集合命中的系列不参与绘制与 tooltip
- 绘制管线 `draw`：DPR 适配（backing 尺寸 + `setTransform`）；x 域取 `viewRef` 缩放视窗，否则取数据首尾（非 time 模式外扩 0.5）；`dataWindow`/`computeYDomain`/`niceTicks`/`niceTimeTicks`/`scaleLinear`/`seriesPoints`/`decimate`/`minPositiveDelta`/`nearestIndex` 均来自 utils/chart-kit
- y 轴：`computeYDomain` 求域后用 `niceTicks` 扩展并生成刻度，刻度数随 `height` 调整；绘图矩形与网格/标签绘制用 utils/chart-paint 的 `computePlotRect`/`drawYAxisGrid`/`drawXAxisLabels`/`drawAxes`（坐标轴颜色取 `--border`）
- x 轴刻度：time 模式用 `niceTimeTicks`（文本 `m/d`），否则 `niceTicks` 数字标签；刻度数随绘图宽度钳制 2–8
- 柱状：`fill === true` 用 stroke 半透明（alpha 0.18），`fill` 为字符串用指定色；柱宽取窗口内 `minPositiveDelta`
- 线/面积：`seriesPoints` + `decimate` 按绘图宽度采样；`type === "area"` 或 `fill === true` 半透明填充，`fill` 字符串则指定色
- 主题色探测：`--border`/`--foreground`/`--background`/`--primary` 按 `themeTick` 缓存；`MutationObserver` 监听 `document.documentElement` class/style 变化自增 `themeTick` 触发重绘
- 悬停与点击通用 `pickAt(px, py)`：判断绘图区内、`nearestIndex` 求最近数据点索引；绘制管线统一读 `hoverRef.current`
- 悬停：pointermove 命中绘图区时更新 hoverRef、绘制十字线 + 各系列圆点、更新 tooltip（DOM 直改：header 为 x 标签，每可见系列一行 swatch/label/value，`value` 可格式化、缺值显示 `-`）；pointermove 触发的绘制与 tooltip 更新经 rAF 合帧，每帧至多一次；tooltip 位置以 transform 表达并钳制在 wrap 内；tooltip 尺寸读取按内容签名缓存，仅内容变化时重测，几何读与样式写分离（不先写后读引发强制布局）；移出绘图区隐藏
- 点击：pointerdown 立即调 `pickAt` 设置 hoverRef，使触屏 tap 也能显示 tooltip + crosshair；pointerup 时若无显著位移（≤8px）则保持"钉住"状态，tooltip 继续显示；pointercancel 清除全部悬停/拖动状态（系统手势中断兜底）
- 双击还原：原生 `onDoubleClick` 桌面端有效；移动端用 `lastTapRef`（时间 + 坐标）检测 350ms 内同位置连续两指 tap → `viewRef = null` 还原全范围，同时清除 hover
- 拖拽缩放：pointerdown 在绘图区设置 `dragRef` + `setPointerCapture`，pointermove 更新选区重绘（`drawSelection`）；pointerup 时位移 >8px 换算为新视窗写入 `viewRef` 并清除 tooltip，否则视为点击钉住；双击清空视窗还原
- 副作用：`ResizeObserver` 监听容器重绘；每次渲染后绘制，首次绘制完成触发一次 `onReady`
- 结构：body（canvasWrap > canvas、tooltip div）→ `ChartLegend`（依赖 ./chart-legend，传 label/color/hidden/onToggle，默认画布下方）→ hint 提示行（最末）；`legendPlacement: "top" | "bottom"` 可把图例置顶（提示恒在末行）；提示行为调用方内容直渲（骨架不设包装节点）：`zoomHint: React.ReactNode`，空串隐藏，缺省提示节点由皮肤提供
- classNames 槽位：legend（`ChartLegendClassNames`）/body/canvasWrap/canvas/tooltip/tooltipHeader/tooltipRow/tooltipSwatch/tooltipValue
