# NumberInput 骨架（app/ui/components/number-input.tsx）

- 职责：带前后缀装饰的数值输入，数值行为复用 `useNumberCore`。

## 行为 / 状态

- 导出 `NumberInput`；输入校验、失焦归一、步进、千分位与 `aria-valuemin|max|now` 均来自 `./number-field` 的 `useNumberCore`，渲染用同文件的 `NumberRoot`
- 默认值：`min` 缺省 0、`max` 缺省 99（NumberField 缺省 999）、`step = 1`、`thousands = false`、`indicator = true`、`positiveInteger = false`；宽度走宿主车道
- 结构：根 div（`className` / `style` / `data-invalid` / `data-border`）→ 可选 leading → input（`classNames.root` / `styles.root`）→ trailing
- leading 在 `prefix`、`classNames.leading`、`styles.leading` 任一存在时渲染，`prefix` 包进 `InputLeading`
- trailing 恒渲染：有 `suffix` 时直渲（无包装节点，字符串整形由皮肤承担）；否则 `indicator` 为真时输出 `aria-hidden` 装饰 span，内含 `ChevronUp` / `ChevronDown`
- 指示图标纯装饰，不绑点击或步进行为，数值调整只走键盘方向键
- 字段 props：`label` / `description` / `validate` / `validateTrigger` 任一传入即组装内部 Field 机制（render-prop，input 上接线 `id` / `name` / `aria-describedby` / `aria-invalid` / `data-invalid`），控件单独使用即具备完整字段行为；全部未传保持纯数值输入 DOM
- `invalid` 输出 input `aria-invalid` 与根 div `data-invalid`
- 槽位：`classNames: leading / trailing / root / indicator / indicatorIcon`；`styles: leading / trailing / root / indicator / indicatorIcon`
