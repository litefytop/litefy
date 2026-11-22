# NumberField 骨架（app/ui/components/number-field.tsx）

- 职责：数值输入共享内核 `useNumberCore`，与带上下步进按钮的 NumberField。

## 行为 / 状态

- 导出 `NumberField`、基础件 `NumberStepper`（button）/ `NumberRoot`（input）、千分位函数 `groupThousands`、内核 `useNumberCore`（`NumberInput` 复用）
- 内核值形态：内部存原始字符串；`value` 受控 / `defaultValue` 非受控（默认 ""）；`positiveInteger` 默认 false，`min` 缺省 0、`max` 缺省 999（步进件三字符量级；NumberInput 仍缺省 99；负数与更大界走 props）、`step` 缺省 1
- 输入校验：剥掉千分位逗号后，正整数只放行 `^\d*$`，否则放行 `^-?[0-9]*\.?[0-9]*$`；不合法击键直接丢弃且不发事件
- `onValueChange` 载荷：`positiveInteger` 输出 number，否则输出 string；空串统一为 undefined
- 失焦归一：trim → parseFloat，非数字清空；正整数向下取整且下限 0；再 clamp 到 min/max；仅值变化时补发一次
- 步进 `stepDelta(±step)`（`ArrowUp` / `ArrowDown`、按钮与聚焦后的滚轮共用）：空值或非数字按 0 起算，正整数取整，小数按 `step` 的小数位数缩放后回除，结果 clamp
- 滚轮步进：`onFocus` 时捕获输入节点，聚焦期间挂原生 `wheel` 监听（`passive: false`），`deltaY < 0` 加、`> 0` 减、0 忽略，命中即 `preventDefault` 阻断页面滚动；`readOnly` 不响应（`disabled` 无法聚焦，自然豁免）
- 输入属性：`type=text`、`role=spinbutton`、`inputMode` 随 `positiveInteger` 取 numeric / decimal、`aria-valuemin|max`（仅有限值时有）与 `aria-valuenow`
- `thousands` 只在未聚焦时按千分位显示，聚焦显示原串
- `canDecrement` / `canIncrement` 由当前值（空按 0）与 min/max 比较，`disabled` 时均为 false
- `NumberStepper`：`type=button`、`tabIndex=-1`，`aria-label` 缺省 `Increase` / `Decrease`，图标 `Plus` / `Minus`（`aria-hidden`）
- `NumberField` 顺序：decrement 按钮 → input → increment 按钮 → 提示 span（`↑ ↓`，id 拼入 `aria-describedby`）；`incrementLabel` / `decrementLabel` 覆盖按钮标签，`invalid` 输出组 `data-invalid` 与 input `aria-invalid`；外壳零内联几何——宽度全由皮肤静态档承担（数字件车道值区与步进钮同宽 `w-control`），值区宽度不随 min / max / step / thousands 运行期计算，开发者改大 max 自行经 `classNames.root` 加宽值区
- 槽位：`classNames: root / stepper / stepperIcon / hint`；`styles: root / stepper / hint`
