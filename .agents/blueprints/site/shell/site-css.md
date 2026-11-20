# 业务样式（app/styles/site.css）

- 业务层零令牌、零自定义 class：样式只写组件内 Tailwind 工具类。
- 间距、圆角走皮肤 `@theme` 阶梯；断点 sm=40rem / md=48rem / lg=64rem；子代选择用 `[&>*]`；皮肤令牌值用 `(--token)`。
- 本文件只保留 shiki 渲染块无法用单元素工具类表达的规则：`code`/`pre` 字体、`.code-stage` 4:3 定窗与内滚、`.code-stage .shiki` 融入容器、`.skill-command .shiki` 命令条高度与行距。
