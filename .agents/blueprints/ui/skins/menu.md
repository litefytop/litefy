# Menu 皮肤（app/ui/skins/menu.tsx）

1. 根与条目：裸列表；条目间 `border-b-hair` 分隔。
2. 组标签：底色条——`px-3 py-snug` 与行同高 + `text-sm leading-5` 与行同节奏 + `font-label`（label 比交互正文大）+ `tracking-label` + `case-label` + `surface-fg` 文字色，同款下分隔（条底色方案自答）。
3. 行（`itemButton`，经公开 `itemClassName` 挂载）：整宽左对齐，`px-3 py-snug` + `text-sm` + 常规字重（组眉字重比正文大，见组标签）；hover 换 `hover` 对；按下沿共享 `--translate-crush` 压平；激活（`data-[active=true]`）换 `active` 对；带子菜单（`data-[has-sub]`）转两端对齐、不截断、不触发行动作、点击展开子菜单（hover 不是唯一入口）；禁用压暗（`opacity-50` + `cursor-default`）。
4. 子菜单面板：`w-48` 浮层——`rounded-xl` + `border-frame` + `surface-raised` + `shadow-elevated`，内边距取圆角补偿带 `panelPadClass`（圆角答 0 的方案自然归零、维持贴边；律见 `ui/schemes.md` 第 14 条）。
5. 子菜单标记：行尾 ChevronRight 右箭头图标，`size-4 shrink-0` + `text-surface-fg` 文字色（比行文字弱一档，同 Cascader 箭头惯例）。
6. 组合导出：`menuClasses` 供 DropdownMenu、ContextMenu 复用；`itemButton` 走 `itemClassName` 通道（非 `classNames` 键），消费方仍获胜。
7. 面板不滚动：菜单一次性全显，不设 max-h 与 overflow-auto；条目过多改用 List（列表才配滚动）。
8. 专属令牌：无。
