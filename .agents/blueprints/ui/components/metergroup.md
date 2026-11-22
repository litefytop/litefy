# MeterGroup 骨架（app/ui/components/metergroup.tsx）

- 职责：只读分组量表——把多项占比渲染为同一条轨道上的相连段（形态参考 PrimeVue MeterGroup），发布 meter 语义；无交互。
- 构建：四层律（blueprint.md 第 8 条）——原子骨架 `MeterTrack` / `MeterSegment` / `MeterLegend`，组合骨架 `MeterGroup` 组装并承担计量计算。

## 结构 / 槽位

1. 原子骨架（零样式零布局，`className` 直通，可独立取用）：
   1. `MeterTrack`：轨道容器 div，`data-track` + `aria-hidden` 自带，children 即段
   2. `MeterSegment`：单段 div，`data-item` 自带；props `percent`（0–100 数）、`color?`、`tip?`——inline `width`（`percent%`）与 inline `backgroundColor`（运行期值，机制值先例同 `--litefy-percent`）由原子发布；`tip` 传入时发布 `data-tip`
   3. `MeterLegend`：图例块 div，`data-legend` + `aria-hidden` 自带；props `items: Array<{ label; percent; color? }>` 与自有元素槽 `classNames: { item?, swatch?, label?, percent? }`——每项渲染项 div（`data-legend-item`）> 色点 span（`data-swatch`，inline 背景）+ 名称 span（`data-label`）+ 百分比 span（`data-percent`）
2. 组合骨架 `MeterGroup`：
   - props：`value: Array<{ label; value; color? }>`、`min=0`、`max` 缺省取各项 `value` 之和；其余 `div` 属性透传（含 `aria-label`）
   - 自有元素槽 `classNames: { track?, segment?, legend?, legendItem?, swatch?, label?, percent? }` 逐槽下发到原子件（blueprint.md 第 10 条）
   - 根 `role="meter"` + `aria-valuemin` / `aria-valuemax` / `aria-valuenow`（now = 钳后的各项和，可访问名由消费者经 `aria-label` 提供）+ `aria-valuetext`（缺省串接各项 `label 占比%`，以 `, ` 连接；消费者显式 `aria-valuetext` 优先）——分项语义由根 `aria-valuetext` 承担，不引入可聚焦件（守 robust 5）
   - 根输出 `data-orientation="horizontal"`（首版恒横向）
   - 各项 `value` 钳入 `[min, max]` 后计宽，宽 = `value / (max − min) × 100`%，算好的 `percent` 传给 `MeterSegment`；零值段不渲染；段宽总和超出轨道由轨道裁剪
   - 段色缺省由色板 hook 按序抽取（语义同款 300 / 200 档），显式 `color` 直通覆盖（PrimeVue 同法）；图例色点与对应段同源同色
   - 段 `tip` = `label · percent%`，与图例同源，信息不依赖 hover（1.4.13 由图例常显满足）
3. 行为：骨架不做 JS 补间，段宽随渲染直接跳变（过渡由皮肤表达）

## 待定项

- 纵向 `orientation`、`labelOrientation` / `labelPosition`、`showMin` / `showMax` 端标、每项 `icon`——PrimeVue 均有，首版不设，需要时另立蓝图任务。
