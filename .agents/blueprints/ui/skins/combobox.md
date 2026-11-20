# Combobox 皮肤（app/ui/skins/combobox.tsx）

1. 组合：内部装配 Picker（字段 + 面板）与 List，皮肤整包供给两者外观——字段半接 `pickerClasses`（root / input / trailing / panel），行半接 `listClasses`。
2. 面板内视口：面板已画框，内边距取圆角补偿带 `panelPadClass`（圆角答 0 的方案归零维持贴边；律见 `ui/schemes.md` 第 14 条），内嵌列表只留滚动半（`listViewportClasses`）+ `max-h-64` 上限——去 List 自己的框（`border-0`）并继承面板圆角（`rounded-[inherit]`）。
3. 专属令牌：无。
