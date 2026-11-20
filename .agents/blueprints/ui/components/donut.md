# Donut 骨架（app/ui/components/donut.tsx）

- 职责：环形/饼图，图例切换显隐、悬停联动中心读数。

## 行为 / 状态

- 导出 `Donut`；`data[{ label, value, color? }]`、`variant` 默认 `donut`（`pie` 时内半径取 0）、`gap` 默认 2（扇区间角度留白）、`showLegend` 默认 true、`valueFormatter` 默认 `toLocaleString`、`ariaLabel`
- 颜色：`datum.color` 优先，否则 `useChartPalette`（utils/use-chart-palette，`count = max(1, data.length)`、`probeParentRef` 指向根）按 index 取模
- 自身状态：`hover` 索引与 `hidden` 索引集；hidden 项的值归零后交 `donutLayout(visible, -90, gap)`（utils/chart-kit），total 只累加可见值；`end <= start` 的扇区不渲染
- 扇区路径 `arcPath(100, 100, innerRadius, 96, start, end)`，坐标系 `viewBox="0 0 200 200"`；`fill` 取 colorOf，`mouseenter/leave` 维护 hover，`data-dimmed` 在 focus 存在且非本扇区时输出
- `focus = hover != null && !hidden.has(hover) ? hover : null`；中心读数在 focus 时显示该项 label + 格式化值，否则显示格式化 total；center 容器恒渲染并带 `data-variant`
- `svg` 仅在传 `ariaLabel` 时 `role="img"`，否则 `role="presentation"`
- 图例复用 `ChartLegend`（`swatch="square"`），`onToggle` 翻转 hidden，`onHover` 写入 hover
- 根 className 为 `classNames.root + className`，style 取 `styles.root`，其余 div 属性透传
- 槽位：`classNames: root / svg / svgInner / segment / center / centerLabel / centerValue / legend`；`styles: root / svg / segment / legend`
