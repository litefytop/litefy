# FloatingToc 皮肤（app/ui/skins/floating-toc.tsx）

- 触发器：fixed 贴视口侧缘、垂直居中；横条纵向排布；`data-placement=right/left` 决定贴哪侧与横条对齐方向；focus-visible 焦点环
- 横条：2px 线 + 12px 行距（h-3.5 + py-1.5 + bg-clip-content 技法）；`data-depth` 宽度梯——1 级最长，逐级递减；`data-active` 横向放大并着品牌色，生长原点随 `data-placement`；过渡 transform + 背景色
- 面板：浮层配方（边框、圆角、阴影、抬升背景、前景文字）自带圆角补偿 `p-[var(--radius-md)]`（律见 ui/schemes.md 第 12 条），限宽限高可滚动
- 条目：文本尺寸行高同 Toc 条目语言；hover 着 accent 底；不带行级圆角（圆角归面板，hover 由面板内边距兜住）；`data-active` 品牌色 + 加粗；`data-depth` 缩进梯，逐级右移
