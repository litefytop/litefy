# Menu 皮肤（app/ui/skins/menu.tsx）

1. 根与条目：裸列表；条目间 `border-b-hair` 分隔。
2. 组标签：底色条——`px-3 py-snug` 与行同高 + `text-sm leading-5` 与行同节奏 + `control-label`（label 比交互正文大） + `foreground` 文字色，同款下分隔（条底色方案自答）。
3. 行（`itemButton`，经公开 `itemClassName` 挂载）：整宽左对齐，`px-3 py-snug` + `text-sm` + 常规字重（组眉字重比正文大，见组标签）；hover 吃 `accent` 背景档（并写它的配对前景 `accent-fg`）；按下沿共享 `--translate-crush` 压平；激活（`data-[active=true]`）换 `active` 对；带子菜单（`data-[has-sub]`）转两端对齐、不截断、不触发行动作、点击展开子菜单（hover 不是唯一入口），箭头光标态 `data-[has-sub]:cursor-default`；禁用行按 `disabled` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / active。
4. 子菜单面板：`w-48` 浮层——`rounded-md` + `border-frame` + `surface-raised` + `shadow-elevated`，内边距自带圆角补偿 `p-[var(--radius-md)]`（律见 `ui/schemes.md` 第 12 条）。
5. 子菜单标记：行尾 ChevronRight 右箭头图标，`size-4 shrink-0` + `text-inherit` 文字色（随行读 `foreground`）。
6. 组合导出：`menuClasses` 供 DropdownMenu、ContextMenu 复用；`itemButton` 走 `itemClassName` 通道（非 `classNames` 键），消费方仍获胜。
7. 面板不滚动：菜单一次性全显，不设 max-h 与 overflow-auto；条目过多改用 List（列表才配滚动）。
8. 专属令牌：无。
9. 禁用观感：条目钮与根分别选择独立禁用类串，保留布局与边框结构；原生 disabled 与 JavaScript 守卫阻断动作，不使用 inert 或 `pointer-events: none`。
