# Radar 骨架（app/ui/components/radar.tsx）

- 职责：雷达图，多系列多边形叠加、图例切换显隐与悬停高亮。

## 行为 / 状态

- 导出 `Radar`；`axes: string[]`、`series[{ label, values, color? }]`、`max?`、`levels` 默认 4、`showLegend` 默认 true、`ariaLabel`
- 轴数 `count = max(3, axes.length)`，半径 80，`viewBox="0 0 240 220"`，绘图组平移至 `(120, 110)`
- 网格：`radarRings(count, radius, levels)` 逐圈渲染，最后一圈带 `data-outer`；`radarSpokes(count, radius)` 渲染辐条（utils/chart-kit）
- 量程 `ceiling = max ?? max(1, ...可见系列 values 前 count 项)`，hidden 系列不参与计算；多边形由 `radarPolygon(values.slice(0, count), ceiling, radius)` 生成，按比例截断到半径内
- hidden 命中的系列不渲染；`data-hovered` / `data-dimmed` 由 hover 索引标记，`mouseenter/leave` 维护 hover
- 轴标签取 `axes.slice(0, count)`，按 `polar` 落在半径 +14，依 cos / sin 是否超过 0.35 选择 `textAnchor` 与 `dominantBaseline`
- 颜色：`series.color` 优先，否则 `useChartPalette`（`probeParentRef` 指向根）按 index 取模；`stroke` 与 `fill` 同色
- 图例复用 `ChartLegend`，`onToggle` 翻转 hidden、`onHover` 写入 hover；自身仅持有 `hover` 与 `hidden`
- `svg` 仅在传 `ariaLabel` 时 `role="img"`，否则 `role="presentation"`
- 槽位：`classNames: root / svg / grid / ring / spoke / label / polygon / legend`；`styles: root / svg / grid / label / polygon / legend`
