# AnimatedContent 骨架（app/ui/components/animated-content.tsx）

- 职责：内容过渡容器——子内容进入视口时入场，或子内容变化时先退场再换入新内容；纯展示件，非可聚焦控件。

## 行为 / 状态

- 导出单件 `AnimatedContent`（类型 `AnimatedContentProps` / `AnimatedContentDirection` / `AnimatedContentDuration`），渲染根 `div[data-state="in" | "out"][data-direction][data-duration]`，children 直渲根内，不设包装层
- Props：`direction`（`"up" | "down" | "left" | "right"`，默认 `"up"`，语义为入场运动方向——`up` 即从下方升到位）、`distance`（像素，默认 `24`，示例值）、`duration`（`"sm" | "md" | "lg"` 时长档，默认 `"lg"`——大元素进场归最大档，取值权威在各案 `--duration-*`）、`delay`（毫秒，默认 `0`，编排延迟，总量由消费方按动效律控制）、`threshold`（IntersectionObserver 阈值，默认 `0.1`，示例值）、`once`（默认 `true`，入场一次后断开观察；`false` 时离屏退场、回屏再入场）；`className` / `style` / 其余 div props 透传根
- 内联样式两枚（值必须由内联表达）：`--animated-content-distance` 答 `${distance}px`（运行期数值几何，皮肤位移类读它）；`transitionDelay` 答 `${delay}ms`（编排参数，reduced 时归零）
- 视口触发：IntersectionObserver 观察根自身，首次 `isIntersecting` 置 `data-state="in"`；`once=true` 即断开，`once=false` 离屏置 `out`（内容换入的退场定时器运行中时不打断）；无 IntersectionObserver 环境直接置 `in`
- 内容签名：元素子节点按 `key ?? 类型名` 判定、文本/数字子节点按值判定，拼接为签名；签名变化即内容变化——元素内容要重播须给显式 `key`（同类型同 key 的 props 变化不触发，写进文档）
- 内容换入：签名变化时若当前 `in` → 置 `out` 播退场，按根元素计算样式的 `transitionDuration` 首值定时（读令牌即读减动效契约，令牌清零则立即换入），到点替换为最新 children 并置 `in`；退场途中再变只重置定时器与目标内容，不排队、不锁播完（CSS 过渡从当前视觉位置接续）；当前 `out`（未入场或离屏）则直接替换
- 减动效：`useMotionPreference().reduced`（契约见 `../utils/use-motion-preference.md`）为真时立即置 `in`、替换为最新内容、清退场定时器、延迟归零；服务端与挂载初渲染恒 `out`，两端一致无水合分叉
- 隐藏态无障碍：`data-state="out"` 时根挂 `inert`——退场与未入场内容不进焦点顺序与朗读流，入场即恢复
- 尺寸律：根本身不钉尺寸，内容换入引起的高度变化由消费方钉死外框（固定高卡片 / 预留道），骨架不做 JS 测量
- 卸载清观察器与定时器
- 外观交给皮肤：过渡束、时长档类、方向位移与隐藏透明度全由皮肤经 `data-*` 表达；骨架零样式 class