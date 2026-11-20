# ComponentPreview 舞台（app/components/component-preview.tsx）

- 职责：组件 demo 的展示舞台（`展示` / `查看源码` 页签的 preview 面板内容），demo 以普通组件直接渲染在文档流里（不做 iframe 隔离——浮层属页面层，响应式验证由开发者缩放浏览器窗口完成）。
- 舞台外框：比例定窗——`aspect-video`（16:9）全宽随正文列，宽度始终与正文列一致（不做全出血外扩），手机端随容器收窄不超过屏宽；`overflow-auto`（内容超出可滚，不裁）、`p-4` 内边距；子件以 `*:m-auto` 居中（溢出时 margin 归零，内容全程滚动可达，不用 items-center——那会把向上溢出的头部留在滚动区外）且 `*:min-w-0` / `*:max-w-full` 允许收缩。
- 待定项：无。
