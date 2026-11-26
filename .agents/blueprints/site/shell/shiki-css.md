# Shiki 渲染层（app/styles/shiki.css）

- 基础重置只由 Tailwind preflight 承担：`app/styles/` 不设手写 reset，入口不额外引入重置层。
- 业务层零令牌、零自定义 class：样式只写组件内 Tailwind 工具类；间距、圆角走皮肤 `@theme` 阶梯；断点 sm=40rem / md=48rem / lg=64rem；子代选择用 `[&>*]`；皮肤令牌值用 `(--token)`。
- 单文件承担全部 shiki 渲染规则，两段式排列：先 shiki 主题着色（fumadocs 代码块亮暗主题、diff / highlighted / 行号、注释对比度修正），后容器布局规则（`code`/`pre` 字体、`.code-stage` 4:3 定窗与内滚、`.code-stage .shiki` 融入容器、`.skill-command .shiki` 命令条高度与行距）；后段依赖同特异度下后来者胜出压过前段的缺省内边距与描边。
- Shiki 文字色遵 `site/shell/contrast.md`：代码token继续读亮暗主题，普通行号与注释读 `foreground`，增删行符号读 `success` / `danger`；`surface-fg` 与状态 `-fg` 不直接落在透明代码画布上。
