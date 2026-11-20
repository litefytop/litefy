# Popover 皮肤（app/ui/skins/popover.tsx）

1. 触发件：直接叠 `buttonVariants.outline`——按钮形披露件不重述按钮框。
2. 内容面板：`min-w-32 max-h-96` 界 + `overflow-auto`，容器零内边距——浮层最外层不设 padding，由消费者自定（圆角菜单类面板取圆角补偿带，内容类如 tabs 折叠面板自补 `p-4`）；`rounded-xl` 圆角 + `border-frame` 描边 + `surface-raised` 面 + `shadow-elevated` 浮起，`text-base` + `leading-relaxed`。
3. 组合导出：`popoverClasses`（trigger / content）与圆角补偿带 `panelPadClass`（`p-[min(var(--radius-xl),var(--spacing)*2)]`——律见 `ui/schemes.md` 第 14 条）供 DropdownMenu、ContextMenu、Tabs 折叠面板、Cascader 复用——浮层配方一处正本。
4. 专属令牌：无。
