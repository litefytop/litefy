# ComponentPreview 舞台（app/components/component-preview.tsx）

- 职责：组件 demo 的展示舞台（`展示` / `查看源码` 页签的 preview 面板内容），demo 以普通组件直接渲染在文档流里（不做 iframe 隔离——浮层属页面层，响应式验证由开发者缩放浏览器窗口完成）。
- 舞台外框：宽度始终与正文列一致（不做全出血外扩），不超过屏宽。外层容器挂 `@container`；`md` 及以上按 16:9 比例定窗，高度取 `round(up, calc(100cqw * 9 / 16), 1px)`——流式宽度下比例高度常落在小数，亚像素溢出会触发 1px 滚动，向上取整到整数像素消除；不在宽度侧取整（把舞台加宽到 16 的倍数需超出正文列，会被外框 `overflow-hidden` 裁掉边缘）；窄屏不锁比例，内容自然撑高并保留 `min-h-64` 下限。`overflow-auto`（内容超出可滚，不裁）、`p-2` 内边距（`p-4` 时 Row selection demo 的「5 行表格 + 44px 分页钮行」在矮窗口溢出）；子件以 `*:m-auto` 居中（溢出时 margin 归零，内容全程滚动可达，不用 items-center——那会把向上溢出的头部留在滚动区外）且 `*:min-w-0` / `*:max-w-full` 允许收缩。
- 待定项：无。
