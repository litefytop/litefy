# Cascader 皮肤（app/ui/skins/cascader.tsx）

1. 组合：根（字段框 + 面包屑行）+ 每层一个 `PopoverContent` 面板（内嵌 List，面板与字段框等宽——`placement.matchWidth`；面板直接复用 `popoverClasses.content`——浮层容器零内边距，选项行贴边排布）；crumb 是 text 角色的文本按钮（`aria-expanded` 开合、`aria-current="step"` 当前级），选项行复用 List 的行。
2. 宽度契约：深度由 tree 自动推导；整体宽度走 `width` prop（默认 24rem，容器尺度 sm 档），根内联 `max-width: min(100%, width)`（运行期值、类表达不了——内联例外，蓝图 rule 6 注明；不引入任何组件 CSS 变量）；根为块级自适应父宽、上限即整体宽度；面包屑行 grid 列数由骨架按当前 path + selected 动态计算（`repeat(cols, minmax(64px, 1fr))`），初始 1 列铺满字段，每增一级多一列，每列最小 64px，超长 ellipsis、行内滚动兜底。
3. 专属令牌：无。
