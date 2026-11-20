# Paper 皮肤（app/ui/skins/paper.tsx）

1. 定位：固定真实纸张尺寸的打印排版面——屏显即白纸（恒亮，不随方案昼夜翻转），打印输出与纸面一致；正文排版由 `Typography` 组合承担，本件只管纸张。
2. 纯样式件（无骨架，同 Card / Callout）：导出单件 `Paper`，渲染根 `div[data-format]`；Props：`format?: "auto" | "a5" | "a4" | "letter"`（默认 `"auto"`）、`className` / `style` 透传根、`children` 直排。
3. 纸张档：auto `w-full`（宽度随容器、高度随内容，屏显排版面）；固定档 A5 `w-[148mm] min-h-[210mm]`、A4 `w-[210mm] min-h-[297mm]`、Letter `w-[8.5in] min-h-[11in]`——mm/in 直写属物理常量非自造档（真实纸张无令牌阶梯，蓝图注明豁免原因）；固定档 `min-height` 承内容增高，跨页分页归业务。
4. 恒亮纸面：机制值 `--paper-surface: white` / `--paper-ink: black`（三案 `:root` 同值——纸张白与墨黑是物理常量，非色板槽位，走 schemes.md 机制值先例）；皮肤 `bg-(--paper-surface) text-(--paper-ink)`，夜间模式屏显与打印均为白底黑字；对比 21:1。
5. 屏显与打印差异：屏显 `shadow-surface`（纸在桌面）+ `rounded-none`（物理纸无圆角）+ `p-8`（paper 的页边距由消费方或排版组件定，默认留内边距档）；打印 `print:shadow-none`，尺寸即真实尺寸。
6. 无障碍：非可聚焦件不挂环；接管 `print` media 需在方案层声明（perceivable 18）——三案 `index.css` 增加 `@media print` 车道：`color-scheme: light`（原生控件打印不进暗档）；全局令牌级亮色重映射另立任务，不在本件范围。
7. 专属令牌：`--paper-surface` / `--paper-ink`（机制值，三案同值，声明在 `:root`；`@media print` 亦读同值，无需重答）。
