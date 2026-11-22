# Checkbox 骨架（app/ui/components/checkbox.tsx）

- 职责：复选框三件套（Root/Indicator/Label）、组合件 Checkbox 与多选组 CheckboxGroup。

## 行为 / 状态

- 基础件：`CheckboxRoot` 为 `input[type=checkbox]`，未传 `id` 时用 `useId` 补齐；`Enter` 键 `preventDefault` 并 `click()` 触发切换；`CheckboxIndicator`（span 容器）与 `CheckboxLabel`（label）均为纯透传
- `Checkbox`：label 包裹 indicator（内含 input 与按态渲染的内置图标：半选 `Minus`、选中 `Check`、未选中不渲染；消费方 `indicator` 插槽整体替换）+ children 文本；根 `className`/`style` 落在 label 上
- `lineThrough?: boolean`（默认 false）：开启时 children 包入文本层 `span[data-line]`（槽位 `classNames.text`），关闭时不渲染包装、DOM 与无此 prop 零差异；划线是纯 CSS 视觉——骨架不发状态，皮肤在文本层槽位类上以 `group-has-[:checked]/label` 组态变体从 label 取态作答（input 不是文本层的后代，文本层自身感知不到选中态，label 根挂 `group/label` 标记供其取态）；选中且非半选才划线，半选不划；`CheckboxGroup` 项级 `lineThrough` 直接透传（`CheckboxOptionConfig` 类型随 `CheckboxProps` 自带），组级 `common.lineThrough` 兜底、项级优先
- `indeterminate?: boolean`（默认 false）：`CheckboxRoot` 经 ref 写入原生 `indeterminate` property（DOM property 非 attribute，无法走 JSX 透传），并合并消费方 ref；全选钮用它表达半选，与 `checked` 相互独立
- `Checkbox` 受控：传 `checked` 即受控，否则内部状态（`defaultChecked` 起，默认 false）；变更时先透传 `onChange`，再回调 `onCheckedChange(next)`
- `CheckboxGroup`：`options` 支持平铺项（`CheckboxOptionConfig`：`label`/`value`）或分组项（`CheckboxOptionGroup`：`group` + 子 options，渲染 section 与分组标题 span）；每项渲染 `Checkbox`，`value` 作为 input 值
- `CheckboxGroup` 选中值：传 `value` 即受控，否则内部数组（`defaultValue` 起，默认 `[]`）；`selectedSet` 判选中，toggle 为增删后回调 `onChange(values)`；`disabled` 组级与项级取或
- `common` 为组级兜底：每项的 `classNames`/`styles`/`indicator`/`lineThrough` 优先项级、缺失回退 `common`
- 表单集成：有 `name` 时经 `FormContext`（./form）`registerField` 注册，外部写入时解析（null→`[]`、数组逐项 String、单值包数组）回写状态并触发 `onChange`；toggle 时同步 `setFormValues`；卸载时 `unregisterField`
- 组标签：`CheckboxGroup` 可选 `label`（ReactNode）与 `classNames.groupLabel`；有 `label` 时在选项之前渲染组标签 `<span>`（`useId` 生成 id，容器 `aria-labelledby` 指向该 id），无 `label` 时沿用可选 `aria-label`
- 键盘导航：根 div `role="group"` + 可选 `aria-label`；方向键（Down/Right +1、Up/Left -1）在未禁用的 checkbox 间循环移动焦点
- classNames 槽位：`Checkbox` 用 input/indicator/label/icon/text（text 仅 `lineThrough` 开启时出现在 DOM）；`CheckboxGroup` 用 root/groupLabel/section/label
