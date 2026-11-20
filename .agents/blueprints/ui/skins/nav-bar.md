# NavBar 皮肤（app/ui/skins/nav-bar.tsx）

1. 根：无基类（布局与固定间距由骨架内联表达）。
2. 条目：`whitespace-nowrap`（消费方 renderItem 自带钮形）。
3. More 触发钮：**文字按钮**（`buttonVariants.text`）+ 尾随 chevron（`size` 随字、`data-[open]` 翻转）——不是描边钮；它是下拉菜单的触发器（x 轴自由车道）。
4. 面板：**菜单形态**（第 14 条 x 轴自由车道）——`w-48` + `rounded-xl` + `border-frame` + `bg-surface-raised`，`max-h-96` 滚动，条目通宽左对齐；不复用浮层盒配方。
5. 专属令牌：无。
