# NumberInput 骨架（app/ui/components/number-input.tsx）

- 职责：带前后缀装饰的数值输入，数值行为复用 `useNumberCore`。

## 行为 / 状态

- 导出 `NumberInput`；输入校验、失焦归一、步进、千分位与 `aria-valuemin|max|now` 均来自 `./number-field` 的 `useNumberCore`，渲染用同文件的 `NumberRoot`
- 默认值：`min` 缺省 0、`max` 缺省 99（NumberField 缺省 999）、`step = 1`、`thousands = false`、`indicator = true`、`positiveInteger = false`；宽度走宿主车道
- 结构：根 div（`className` / `style` / `data-invalid` / `data-border`）→ 可选 leading → input（`classNames.root` / `styles.root`）→ trailing
- leading 在 `prefix`、`classNames.leading`、`styles.leading` 任一存在时渲染，`prefix` 包进 `InputLeading`
- trailing 条件渲染：`suffix` 为真值或 `indicator` 不为 false 时渲染（槽元素经共享 `InputTrailing` 自带 `data-field-trailing` 端角判定标记）——有真值 `suffix` 时直渲（无包装节点，字符串整形由皮肤承担），否则输出 `aria-hidden` 装饰 span，内含 `ChevronUp` / `ChevronDown`；两者皆无时不渲染 trailing，不留空白插件槽
- 壳内恒渲染聚焦提示（与 NumberField 同律，不随 indicator / suffix 取舍）：右上角浮动卡片（`hint` 槽，id 接入 `aria-describedby`），内容 `↑ ↓` 纯文本，与 NumberField 提示同文同构，显隐随输入 `peer-focus-visible`
- 指示图标纯装饰，不绑点击或步进行为；数值调整走键盘方向键与聚焦后的滚轮（内核承担）
- 字段 props：`label` / `description` / `validate` / `validateTrigger` 任一传入即组装内部 Field 机制（render-prop，input 上接线 `id` / `name` / `aria-describedby` / `aria-invalid` / `data-invalid`），控件单独使用即具备完整字段行为；全部未传保持纯数值输入 DOM
- `invalid` 输出 input `aria-invalid` 与根 div `data-invalid`
- 槽位：`classNames: leading / trailing / root / indicator / indicatorIcon / hint`；`styles: leading / trailing / root / indicator / indicatorIcon / hint`
