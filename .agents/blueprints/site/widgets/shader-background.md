# ShaderBackground 着色器背景（app/components/shader-background.tsx）

- 职责：展示区装饰底层——WebGL 极光流场铺在容器底部，不承担语义；装饰边界、预算与减动效契约见 delivery `references/decoration.md`，本蓝图只答本件目标态。
- 定位：站点装饰件（site/widgets），不进 `app/ui` 组件库、不进 registry；当前唯一消费处为 neon showcase hero（同屏只跑一处重量级装饰）。

## 行为 / 状态

- 导出单件 `ShaderBackground`，渲染 `div[aria-hidden="true"]` 容器（`pointer-events-none size-full`），effect 在容器内自建并追加 `canvas[aria-hidden="true"]`——每次挂载拿独立上下文：React 重挂载时若复用同一 canvas 节点，清理期 `WEBGL_lose_context` 已释放的旧上下文会被二次 `getContext` 原样取回，编译必败；定位由消费方承担（`absolute inset-0` 包装）；Props：`speed`（时间流速，默认 `0.12`，示例值）、`strength`（装饰与画布色的最大混合比，默认 `0.25`，示例值——封顶保上层文字对比）、`className` 透传
- 颜色全出令牌：底色读 `--surface`（与消费面 `bg-surface` 同令牌，保 `surface-fg` 文字对比配对；读画布色 `--background` 会让表面档文字落在画布档底色上），流场四色读 `--primary` / `--primary-accent` / `--info` / `--accent`；运行期经计算样式取值，用 1×1 canvas 2d 采样转 sRGB（oklch / hex 一律可解），文件内不写一个色值
- 渲染：全屏三角形 + simplex fbm 域扭曲流场，四色按噪声场插值后以 `strength` 封顶混入底色，叠轻微噪点打散色带；片元内插值在感知均匀空间近似（oklab 混合权重），长距离渐变不出现色带
- 预算：分辨率上限 `min(devicePixelRatio, 1.5) × 0.75`；IntersectionObserver 离屏即停 rAF，`document.visibilitychange` 隐藏即停；ResizeObserver 随容器重设背板尺寸
- 减动效：`useMotionPreference().reduced` 为真停循环、只渲一帧静态画面（不整体消失）；偏好恢复即回循环
- 主题切换：MutationObserver 观察根元素 `class`（日夜档）→ 重新采样令牌色
- 兜底：WebGL 上下文不可用 → 不渲 canvas，改渲 `bg-surface` 填充车道 div（令牌渐变，静态）
- 卸载：取消 rAF、断开全部观察器、移除自建 canvas、`WEBGL_lose_context` 释放上下文