# CountUp 皮肤（app/ui/skins/count-up.tsx）

1. 根（消费者 `className` 通道）：行内元素即用即排，不加盒模型与背景色；数字排版挂 `tabular-nums`（逐帧滚动时防宽度抖动），文字色继承上下文，不显式设色。
2. 终值层（朗读端文本）：视觉隐藏——绝对定位 + `size-px` + `opacity-0` + `pointer-events-none`（库内既有隐藏写法，同 checkbox / switch 皮肤的隐藏输入件）；非可聚焦件，不挂焦点环。
3. 无状态分支：静置即终态样式，`data-status` 仅作皮肤扩展钩子；减动效由骨架判读（reduced 直接定格终值），皮肤无动画职责。
4. 专属令牌：无。
