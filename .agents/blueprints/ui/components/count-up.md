# CountUp 骨架（app/ui/components/count-up.tsx）

- 职责：数字递增展示：元素进入视口才从起点值滚动到目标值，播完定格；纯展示件，非可聚焦控件。

## 行为 / 状态

- 导出单件 `CountUp`，渲染根 `span[data-status="idle" | "playing" | "done"]`，内部两层：动画文本 `span[aria-hidden="true"]`（rAF 每帧经 ref 写 `textContent`，不走组件 state，避免逐帧重渲染）+ 视觉隐藏的终值 `span`（稳定容器，朗读端只读终值一次，中间帧不进朗读流）；隐藏类归皮肤，结构归骨架
- Props：`to`（目标值，必传）、`from`（起点，默认 `0`）、`duration`（秒，默认 `2`）、`delay`（秒，默认 `0`，进入视口后的延迟）、`decimals`（小数位，默认 `0`）、`separator`（千分位分隔符，默认 `","`，空串关闭）、`decimal`（小数点符号，默认 `"."`）、`prefix` / `suffix`（默认空串）、`easing`（`"linear" | "out"`，默认 `"out"`，`out` 即 easeOutCubic）、`format`（`(value: number) => string` 整体接管格式化，提供时 `decimals` / `separator` / `decimal` / `prefix` / `suffix` 不参与）；`className` / `style` 透传根 span
- 槽位：`classNames.value`（动画文本层）与 `classNames.final`（终值层，皮肤经此注入视觉隐藏类）
- 格式化按 `decimals` / `separator` / `decimal` 手写拼接，不经第三方库
- 触发：IntersectionObserver 观察根元素自身，首次 `isIntersecting` 即启动并断开观察（一次性）；进入视口前定格起点值的格式化文本，`data-status="idle"`
- 服务端与挂载初渲染恒为起点值文本（服务端不判动效偏好，两端一致，无水合分叉）；进入视口那刻读 `useMotionPreference().reduced`（契约见 `../utils/use-motion-preference.md`）：reduced 直接定格终值、不播动画
- 动画：rAF 按 easing 插值，`from` 到 `to` 走 `duration`，`delay` 以起点时间偏移实现；播放中 `data-status="playing"`，播完 `data-status="done"`
- 值变化：`to` 变化时已播过则从当前显示值滚到新 `to`（时长重走 `duration`）、未播过只更新目标；`from` 仅未播过时可改起点；reduced 下值变化直接定格新终值
- 卸载取消 rAF 与观察器
- 外观交给皮肤：字体、等宽数字、终值层的视觉隐藏类由皮肤表达；骨架零样式 class，只发 `data-status`
