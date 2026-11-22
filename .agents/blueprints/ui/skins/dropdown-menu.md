# DropdownMenu 皮肤（app/ui/skins/dropdown-menu.tsx）

1. 组合：popover 触发钮 + popover 面板收窄到菜单档（`w-48` + 圆角补偿 `p-[var(--radius-md)]`，律见 `ui/schemes.md` 第 12 条），菜单各件接共享 Menu 皮肤，`itemClassName` 叠 `menuClasses.itemButton`。
2. 专属令牌：无。
