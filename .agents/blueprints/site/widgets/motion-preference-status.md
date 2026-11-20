# 动画偏好状态（app/components/motion-preference-status.tsx）

- 在 `motion` 纯文档页内联显示三行状态：系统偏好（`reduce` / `no-preference`）、应用内设置（跟随系统 / 减弱 / 完整）、两者合并后的实际结果（暂停 / 播放）。
- 数据来自公开 `useMotionPreference()`（应用设置 + 系统）与 `useReducedMotion()`（原始系统值），不读写存储、不修改系统偏好。
- 三行随系统偏好或应用设置实时更新；文案随路由语言。
- 使用场景与正文见 `content/guide.md` 的 `motion` 篇。
