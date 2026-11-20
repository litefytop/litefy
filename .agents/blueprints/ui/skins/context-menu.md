# ContextMenu 皮肤（app/ui/skins/context-menu.tsx）

1. 组合：面板取 Popover 浮层收窄到菜单档（`w-48` + 圆角补偿带 `panelPadClass`——圆角答 0 的方案自然归零、维持贴边），菜单各件（root / item / label / itemButton / sub / chevron）原样接共享 Menu 皮肤——不重述行。
2. `ContextMenu` 原样透传；`ContextMenuHost` 经 `mergeSlots` 合并默认类串，消费方逐件覆盖生效。
3. 专属令牌：无。
