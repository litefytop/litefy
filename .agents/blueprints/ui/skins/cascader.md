# Cascader 皮肤（app/ui/skins/cascader.tsx）

1. 组合：根（字段框 + 面包屑行）+ 每层一个 `PopoverContent` 面板（内嵌 List，面板与字段框等宽——`placement.matchWidth`；面板复用 `popoverClasses.content` 叠圆角补偿 `p-[var(--radius-md)]`（律见 `ui/schemes.md` 第 12 条），内嵌列在补偿内边距内排布）；crumb 是 text 角色的文本按钮（`aria-expanded` 开合、`aria-current="step"` 当前级），选项行复用 List 的行。
2. 宽度契约：深度由 tree 自动推导；根使用字段车道 `w-full min-w-0 max-w-[20rem]`，不设固定最小宽。`width` prop 可选，传入时根内联 `max-width: min(100%, width)` 覆盖默认上限（运行期值、类表达不了——内联例外，蓝图 rule 6 注明；不引入任何组件 CSS 变量）；未传时使用 320px 默认上限。面包屑行 grid 列数由骨架按当前 path + selected 动态计算（`repeat(cols, minmax(64px, 1fr))`），初始 1 列铺满字段，每增一级多一列，每列最小 64px，超长 ellipsis、行内滚动兜底。
3. 禁用观感：根与选项行分别选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，移除正常 hover / active 类；面包屑触发钮在 prop 禁用时同样替换正常变体。交互由原生 `disabled` 或骨架 JavaScript 守卫阻断，不使用 inert 或 `pointer-events: none` 实现禁用。
4. 文字色：根 `bg-surface-raised` 凸起档配 `text-surface-raised-fg`（控件静置面归凸起，见 `ui/schemes/elevation.md`）；面包屑与箭头默认 `text-foreground`，当前级只加字重，不用无背景的 `hover:text-accent-fg`；禁用态用独立禁用类串。
5. 专属令牌：无。
