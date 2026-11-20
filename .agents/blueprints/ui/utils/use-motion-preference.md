# useMotionPreference（app/ui/utils/use-motion-preference.ts）

- 公开 hook，通过 utils 与 UI 根出口导出，返回 `{ mode, systemReduced, reduced, setMode }`。
- `mode` 为 `system | reduce | full`，默认 `system`，持久化键 `motion-preference-storage`；`system` 跟随 `prefers-reduced-motion`，`reduce` 强制 `true`，`full` 强制 `false`，`reduced` 是合并后的结果。
- 模块级 store 用 `useSyncExternalStore` 订阅；系统媒体变化时更新快照；服务端快照为 `system + true`，挂载后读存储与浏览器实际值。模块求值不访问 `window` 之外的宿主，不修改系统设置。
- 设置模式时把 `data-motion` 写到根元素（`system` / `reduce` / `full`），供皮肤 CSS 选择；不改系统设置。
- `useReducedMotion()` 仍是系统原始值；设置页和状态展示用两者区分来源。Banner 与 `useSpin` 使用合并后的 `reduced`。
- 安装与 API 正本为 `content/docs/utils/use-motion-preference.zh.mdx`，基础 demo 只显示模式、系统值与合并结果；面向用户的入口说明引用外观面板与 `motion` 纯文档页。
- Banner 契约见 `../components/banner.md`；皮肤响应见两套 `index.css` 与 `neo-showcase.css`。皮肤里现存的 `motion-safe:` 变体只看系统值，应用设 `full` 而系统要求减少时仍会隐藏；改这些变体前先定覆盖方案。
