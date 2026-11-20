# MDX 渲染层（app/components/mdx.tsx）

- 层：界面域·壳层——映射文档正文 MDX 的通用组件：标题锚点、表格、代码块、预览件、链接本地化等；改动影响全部文档路由。
- 锚点定位：标题与表格不再逐个挂 `scroll-mt`——滚动容器（docs-shell 的 main，见 `site/shell/navigation.md`）以 `scroll-pt` 一个声明承担全部锚点落点的呼吸空隙，main 列内无覆盖层。
- 表格：表体 `w-full` 定宽撑满正文列，不挂滚动容器与最小宽度，不裁切——超宽由表内换行机制兜底；3 列表挂 `colgroup` 权重 `[1, 2, 3]`、4 列表 `[1, 2, 1, 2]`（宽度权重属结构几何，定值在组件内），配 `table-fixed`；无权重的表不挂固定布局。
- 表内换行：单元格内行内 `code` 在渲染时自动按词界插入 `<wbr>`——小写→大写驼峰界（`defaultActiveKeys` → `default|Active|Keys`）与 `.` `-` `_` `/` 之后；正文层（docs-shell）另挂 `overflow-wrap` 兜底无词界长串；MDX 源码不手写 `<wbr>`。
- 待定项：无。
