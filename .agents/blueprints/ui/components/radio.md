# Radio 骨架（app/ui/components/radio.tsx）

- 职责：单选按钮组合件与字符串选项单选组。

## 行为 / 状态

- 导出 `Radio`、`RadioGroup` 与基础件 `RadioRoot`（`input[type=radio]`，缺 `id` 时 `useId` 补齐）/ `RadioIndicator`（span）/ `RadioLabel`（label）
- `Radio` 结构：label 包 indicator（input 与可选 `indicator` 插槽内容，骨架不内置圆点——选中态由皮肤以实心填充表达）再包 children 文本；label 同时消费根 `className` 与 `classNames.label`
- `Radio` 传 `checked` 即受控，否则内部状态（`defaultChecked`，默认 false）；`onChange` 先透传，再仅在选中时回调 `onCheckedChange(true)`，取消选中不回调
- `RadioGroup`：`options` 项为 `{ label, value }` + 可选 `id` / `disabled` / `classNames` / `styles` / `indicator`，逐项渲染 `Radio`，`checked` 由 `value === option.value` 推出，`orientation` 输出 `data-orientation`
- 组值：`value` 受控 / `defaultValue` 非受控；点选经 `handleSelect`：非受控落状态、始终 `onValueChange`，有 `name` 时同步 `setFormValues`
- 表单集成：有 `name` 时经 `FormContext`（./form）`registerField` 注册，外部写入解析为 null/undefined → undefined、数组取首项、其余 String；卸载 `unregisterField`
- `disabled` 组级与项级取或；`common` 提供组级 `classNames` / `styles` / `indicator` 兜底，项级优先
- 组标签：`RadioGroup` 可选 `label`（ReactNode）与 `classNames.label`；有 `label` 时在选项之前渲染组标签 `<span>`（`useId` 生成 id，容器 `aria-labelledby` 指向该 id），无 `label` 时沿用可选 `aria-label`
- 无障碍：容器 `role="radiogroup"`，方向键移动依赖原生同名 radio 分组
- 槽位：`classNames: root / groupLabel / label / input / indicator`；`styles: indicator / label`
