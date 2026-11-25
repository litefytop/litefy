# NavBar 皮肤（app/ui/skins/nav-bar.tsx）

1. 根：`w-full min-w-0`（跟随父容器并允许收缩，布局与固定间距由骨架内联表达）。
2. 条目：`whitespace-nowrap`（消费方 renderItem 自带钮形）。
3. More 触发钮：**文字按钮**（`buttonVariants.text` + `group/more`）+ 尾随 chevron 槽位；箭头 `shrink-0`，`size` 随字，经 `group-data-[open]/more:rotate-180` 翻转，过渡只作用于 `transform`——不是描边钮；它是下拉菜单的触发器（x 轴自由车道）。
4. 面板：**菜单形态**（第 14 条 x 轴自由车道）——`w-48 min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))]` + `rounded-xl` + `border-frame` + `bg-surface-raised`，`max-h-96` 滚动，条目通宽左对齐；宽度受 320px 与视口边沟封顶，不复用浮层盒配方。
5. 专属令牌：无。
