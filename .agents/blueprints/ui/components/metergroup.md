# MeterGroup 骨架（app/ui/components/metergroup.tsx）

- 职责：只读分组量表——把多项占比渲染为同一条轨道上的相连段（形态参考 PrimeVue MeterGroup），发布 meter 语义；无交互。

## 结构 / 槽位

- 导出 `MeterGroup`（根 div + 轨道 div + N 个段 div + 图例列）；props：
  - `value: Array<{ label: string; value: number; color?: string }>`——段色缺省由色板 hook 按序抽取（语义同款 300 / 200 档），显式 `color` 直通覆盖（PrimeVue 同法）
  - `min=0`；`max` 缺省取各项 `value` 之和（整组占满轨道），显式传入按刻度计
  - 其余 `div` 属性透传（含 `aria-label`）
- 根元素 `role="meter"` + `aria-valuemin` / `aria-valuemax` / `aria-valuenow`（now = 钳后的各项和，可访问名由消费者经 `aria-label` 提供）+ `aria-valuetext`（缺省串接各项 `label 占比%`，以 `, ` 连接，把逐段占比读给朗读端；消费者显式 `aria-valuetext` 优先）——轨道与图例仍 `aria-hidden`，分项语义由根 `aria-valuetext` 承担，不引入可聚焦件（守 robust 5）
- 结构：根 > 轨道（`data-track`）> N 段（`aria-hidden`）+ 图例列（每项：色点 + `label` + 百分比；`aria-hidden`——语义由根 meter 承担）
- 段宽 = `value / (max − min) × 100`%，inline `width` 由骨架发布（运行期值）；inline 背景色同由骨架发布（hook 色 = 运行期值，机制值先例同 `--litefy-percent`）；零值段不渲染；段宽总和超出轨道由轨道裁剪
- 每段发布 `data-tip`（`label · percent%`，与图例同源）供皮肤 hover 提示；提示内容与图例恒同源，信息不依赖 hover（1.4.13 由图例常显满足）
- 根元素输出 `data-orientation="horizontal"`（首版恒横向）

## 行为 / 状态

- 各项 `value` 钳入 `[min, max]` 后计宽；骨架不做 JS 补间，段宽随渲染直接跳变（过渡由皮肤表达）

## 待定项

- 纵向 `orientation`、`labelOrientation` / `labelPosition`、`showMin` / `showMax` 端标、每项 `icon`——PrimeVue 均有，首版不设，需要时另立蓝图任务。
