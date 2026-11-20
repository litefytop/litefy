# Banner 骨架（app/ui/components/banner.tsx）

- 职责：跑马灯：内容集横向无缝循环滚动，可换向、可暂停、可关闭。

## 行为 / 状态

- 导出五件：`Banner`（组合）、`BannerViewport`（`div` + `aria-roledescription="marquee"`）、`BannerTrack`（动画轨）、`BannerItem`（条目 `span`）、`BannerClose`（关闭钮零件：原生 `<button type="button">`，内容为骨架渲染的内置 X 图标）
- `BannerTrack` 用 Web Animations API 在 `translateX(0) ↔ translateX(-50%)` 间线性无限循环；`duration`（秒，下限 1）或 `direction`（`left`/`right`）变化即重建动画，卸载时 `cancel`
- `BannerTrack` 通过公开 `useMotionPreference().reduced` 订阅有效动效偏好，契约见 `../utils/use-motion-preference.md`：reduced 或 `playing=false` 时 `pause`；偏好恢复后仍遵守播放与悬停状态；reduced 下停在轨道起点，多个 Banner 同时静止时只露首屏，不做静态列表回退
- 覆盖只发生在应用级：`useMotionPreference().setMode("full")` 可在系统减弱时仍播放；Banner 本身不提供覆盖参数，也不读写存储
- 暂停原因与设置说明由应用根部横幅提供；骨架不包含业务文案、路由或设置入口
- `Banner` 不收 children，内容来自 `items`（`{key?, content}`）；固定渲染 2 份 set，`-50%` 位移恒等于一份宽，任何内容长度都无缝，首份带测量 ref，第二份 `aria-hidden`
- 填充不变式：无缝且视口任意时刻都被内容覆盖，当且仅当单份 set 宽 ≥ 视口宽；不足时按 `stretch = 视口宽 − set 自然宽` 均分给每份 set 内各条目的尾随 `marginRight`（`stretch / items.length`），set 撑满视口宽，两份接缝处条目节奏一致
- 测量：ResizeObserver 同时观察视口与首份 set，依赖 `items`；自然宽 = 实测宽 − 当前 stretch（stretch 同步记入 ref 供下次扣除），防止加间距→重测的振荡；`styles.item` 用户传入时覆盖骨架的尾随间距，即显式接管节奏
- 离屏暂停：`IntersectionObserver` 观察视口，离屏时 track 动画暂停、回屏恢复；恢复仍受 `playing` / 悬停 / 减动效约束（motion.md：持续动画只在可见时运行）
- `pauseOnHover`（默认 true）：hover 经内部 `hovering` 状态令 track 暂停；`onMouseEnter`/`onMouseLeave` 用户回调先透传；悬停监听落在根，整条区域（含关闭钮）都触发暂停
- 组合结构：根为普通包装 `div`（消费者 `className` / `style` / 其余 props 落此层），内部依次为 `BannerViewport`（占满根宽）与可选 `BannerClose`；关闭钮脱离文档流，根是其定位锚——提供 `onClose` 时根必须可作锚点，此为结构契约，定位类由皮肤槽位给出
- `closable?: boolean`（默认 false）：为 true 渲染内置关闭钮；`onClose?: () => void`：关闭钮被点击时触发，未提供则点击无操作（仅展示）；横幅不自带隐藏态、不读写存储，卸载与否由消费者决定
- `closeLabel?: string`（默认 `"Close"`）：关闭钮的 `aria-label`
- 槽位：`classNames.viewport` / `classNames.track` / `classNames.item` / `classNames.close` 与同名 `styles`
