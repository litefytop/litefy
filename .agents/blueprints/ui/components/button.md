# Button 骨架（app/ui/components/button.tsx）

- 职责：`ButtonRoot` 是按钮本身，`Button` 是成品——status 配置即网格、[icon, children] 双格格式内置，外观归皮肤。

## 行为 / 状态

- `ButtonRoot`：`<button>` 本体，`children` 承担任意内容；`children` 为空时发射 `data-pure-icon`（纯图标形态的 data 钩子，可显式传入覆盖）；自身零样式零布局，属性的样式作答归四案 utility `pure-icon`
- `Button`（成品）：内容恒为 [icon, children] 顺序渲染，无任何包裹层。`status` 对象 `{ icon, active }`（`ButtonStatus`）配置即发射 `data-status` 并自带 `data-[status]:inline-grid`——specificity 胜过皮肤帧类的 flex 基础流，确定性切换为网格布局；未配置 `status` 时不发射，按钮维持帧类基础流
- 网格模式内的格子：`icon` 已传 → 两格恒在，`active` 为真时 icon 格原位换成 `status.icon`（皮肤强制统一图标尺寸，零位移）；`icon` 未传 → 闲置仅 children 一格居中，`active` 为真时 icon 格出现变两列
- status 语义边界：纯展示格，不置 `aria-busy`、不禁用按钮；状态由消费方逐实例自管（每个实例独立的 state，不共用），等待期禁用与播报由消费方声明（`FormSubmit` 内置 `disabled` + `aria-busy` + 默认旋转 `Loader2`，见 form 蓝图）
- 类型：`ButtonProps` = `ButtonRootProps` + `icon` / `status`
- 禁用遵循 `ui/schemes.md` 第 8 条：原生 `disabled` 阻断交互；皮肤在 `disabled`、`aria-disabled=true` / `"true"` 时选择完整禁用类串，text 变体用 `disabledText`，其余用 `disabled`，替换正常颜色与 hover/active/focus 类但保留帧、圆角、边框与纯图标布局，并显式禁用色与 `cursor-not-allowed`
