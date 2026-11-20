# Password 皮肤（app/ui/skins/password.tsx）

1. 壳：共享字段框（Input 的 `fieldGroupClasses`）+ `relative`——浮动提示的常驻锚点（此组合必有开关，无需条件判断）。
2. 内层输入：字段输入串 + `appearance-none peer`——原生 reveal 消音，提示靠 `peer-focus-visible` 显形。
3. 显隐开关：`rounded-sm` 小钮 + `p-1` + `surface-fg`，hover 换 `accent` 对；`::after` 把命中区外扩到字段右缘整格（`calc(50% - var(--height-control)/2)`）——一字段一指针目标，光标不落在开关帽上。
4. 开关图标：`size-4` 默认图标档。
5. 浮动提示：接共享 `fieldHintClasses`。
6. 组合导出：`passwordShellClasses` / `passwordPartClasses` 供 FormItem 装配。
7. 专属令牌：无。
