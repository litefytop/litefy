# Sparkline 骨架（app/ui/components/sparkline.tsx）

- 职责：微型内联走势图，纯 SVG、无交互。

## 行为 / 状态

- 导出 `Sparkline`；`data: number[]`、`variant` 默认 `line`（`line | area | bar`）、`smooth` 默认 false，其余 `svg` 属性透传
- 坐标系固定 `viewBox="0 0 100 32"` + `preserveAspectRatio="none"`；y 轴由 `scaleLinear([min, max], [29, 3])`（utils/chart-kit）映射，空数据按 `[0, 0]` 兜底（域跨度为 0 时取量程中点）；极值单趟 reduce 求得，不以展开实参列表传 `Math.min/max`（长数组无栈溢出风险）；点集与路径按 `data` / `variant` / `smooth` 经 `useMemo` 缓存
- line / area：x 步长 `100 / max(1, len - 1)`，点集交 `linePath`，`smooth` 走单调三次曲线；折线带 `vectorEffect="non-scaling-stroke"`
- area：额外渲染 `areaPath(points, 31, smooth)` 闭合到底边，再叠加同一条折线
- bar：`slot = 100 / len`，柱宽 `max(0.5, slot * 0.7)` 居中，柱高 `max(0.5, 32 - top)`
- 槽位类分别落在 `classNames.bar`（rect）、`classNames.area`（面积 path）、`classNames.line`（折线 path）
- 无坐标轴、图例、tooltip、hover；显示尺寸完全由外层 CSS 拉伸
- 槽位：`classNames: bar / area / line`；无 styles
