# useSpin 旋转指示（app/ui/utils/use-spin.ts）

1. 职责：Web Animations 无限旋转 ref hook——`rotate(0deg) → rotate(360deg)` 线性循环，默认一圈 1000ms；加载指示器内核。
2. 减动效：`useMotionPreference().reduced` 为真不启动动画、已播的随偏好变化取消；`enabled = false` 同样不转。
3. 卸载取消动画；ref 挂到需要旋转的元素上，不注入任何样式类。
4. 消费方：Toast（loading 态图标）；无独立文档页。
