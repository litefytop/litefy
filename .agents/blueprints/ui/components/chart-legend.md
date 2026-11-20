# ChartLegend 骨架（app/ui/components/chart-legend.tsx）

- 职责：图表系列图例，点击切换显隐、悬停回调。

## 行为 / 状态

- `items`（`label` + `color`）逐项渲染 `<button type="button">`：swatch span 背景色取 `item.color`、带 `data-shape`（`"line" | "square"`，默认 `"line"`）+ label 文本
- `hidden`（`ReadonlySet<number>`）命中索引的项输出 `data-hidden`，否则不输出
- 回调均可选：点击 `onToggle(index)`；mouseenter/mouseleave 触发 `onHover(index | null)`
- 纯受控展示件，自身不持有显隐状态；状态由父级 Chart 的 `hidden` 集合管理
- classNames 槽位：root/item/swatch；根元素合并 `classNames.root + className`，`style` 透传
