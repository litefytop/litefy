# DropdownMenu 皮肤（app/ui/skins/dropdown-menu.tsx）

1. 组合：popover 触发钮 + popover 面板收窄到菜单档（`w-48` + 圆角补偿带 `panelPadClass`——圆角答 0 的方案自然归零、维持贴边），菜单各件接共享 Menu 皮肤，`itemClassName` 叠 `menuClasses.itemButton`。
2. 专属令牌：无。
