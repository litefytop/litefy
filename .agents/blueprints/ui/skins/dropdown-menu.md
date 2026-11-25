# DropdownMenu 皮肤（app/ui/skins/dropdown-menu.tsx）

1. 组合：popover 触发钮 + popover 面板收窄到菜单档（`w-48` + 圆角补偿 `p-[var(--radius-md)]`，律见 `ui/schemes.md` 第 12 条），菜单各件接共享 Menu 皮肤；`itemButton` 复用 `menuItemButtonClasses` 状态解析器，禁用子菜单项不保留正常态 `data-[has-sub]:cursor-default`，`itemClassName` 仍叠 `menuClasses.itemButton`。
2. 专属令牌：无。
