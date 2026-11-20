# useReducedMotion（app/ui/utils/use-reduced-motion.ts）

- 公开无参数 hook，通过 utils 与 UI 根出口导出，返回 `boolean`；`true` 表示浏览器报告 `prefers-reduced-motion: reduce`。
- 只报告系统原始值，不读取应用内设置；需要合并应用设置时用 `useMotionPreference()`（见 `use-motion-preference.md`），其 `reduced` 才是动画组件应遵守的有效值。
- `useSyncExternalStore` 读取媒体查询快照并订阅 `change`，卸载移除对应监听；不依赖皮肤、路由、文案或全局配置。
- 服务端与 hydration 初始快照为 `true`，保守抑制动画；挂载后使用浏览器实际偏好，模块求值不访问 `window`。
- 只检测，不修改系统、不持久化、不自动播放；使用者决定暂停、减弱动画或显示提示。
- BannerTrack 不再直接使用本 hook，改用 `useMotionPreference().reduced`；本 hook 供文档站状态展示与开发者自行判断。
- 安装与 API 正本为 `content/docs/utils/use-reduced-motion.zh.mdx`，基础 demo 只显示实时偏好，不模拟或覆盖系统偏好；面向用户的设置步骤引用 `content/guide.md` 的 `motion` 篇。
