# Field 内部机制（app/ui/components/field.tsx）

- 职责：表单字段内部机制，被 Input / Password / NumberInput / Select 等控件内部组装——不面向消费者导出为包装组件。字段能力由控件 props（`name` / `label` / `description` / `validate` / `validateTrigger`）直接表达，控件单独使用即具备完整字段行为。

## 行为 / 状态

- 导出 `Field`（render-prop）与类型 `FieldValidateResult` / `FieldClassNames`（root / label / required / description / error）/ `FieldRenderInfo`
- props：`name`、`label?`、`description?`、`required?`、`validate?`、`validateTrigger?`（`submit` 默认）、`id?`（外部指定则不生成）、`fieldClassNames?`、`fieldStyles?`、`children: (info: FieldRenderInfo) => ReactNode`
- `FieldRenderInfo = { id; name; hintId; alertId; invalid; describedBy }`——控件在 render 函数里自行把 id / name / `aria-describedby` / `aria-invalid` / `data-invalid` 接到自己的值载体与焦点元素上；无 cloneElement 注入、无 DOM 契约，接线全部显式
- 校验判读：`true | null | undefined` 过；`string` 硬错误；`false` 标红无文案；`{ message, invalid? }` 取 message，`invalid !== false` 才标红；Promise 异步落地
- 触发：默认 `submit`——Form.action 收集 values 后执行全部已注册字段的 validate，任一失败则不调消费者 `onSubmit` 并派发错误；字段已有错误时，壳上原生 `input` / `change` 委托监听即重验（改好即消红）；`change` / `blur` 档走同一委托与 focus 周期
- 值读取：壳 `querySelector("input, select, textarea")` → `register(name, el)` 写入 FormContext（各控件自渲染 name 载体：原生 input 或隐藏域）；焦点回位 `getElementById(id)`，兜底壳内 button/[tabindex]
- `label` 只渲染 chrome 标签（`htmlFor=id`）；Select 等自带行内 label 的控件不传 label、只传 description / validate
- 槽位：`fieldClassNames: { root; label; required; description; error }`，由控件皮肤从 `skins/field.tsx` 的 `fieldChromeClasses` 常量透传
