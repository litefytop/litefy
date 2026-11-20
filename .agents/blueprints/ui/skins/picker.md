# Picker 皮肤（app/ui/skins/picker.tsx）

1. 组合：锚字段 + 手动 popover 面板（面板对齐字段宽）。字段是只读观感的文本框——`min-h-field`、`rounded-md` + `border-frame` 描边 + 底色方案自答（一边透明）+ `shadow-base` 浮起，字号行高方案自答 + `font-field`，placeholder `surface-fg`。
2. 焦点与无效：聚焦读法方案自答；`aria-invalid` 边转 `danger-fg`，聚焦在焦点读法上叠危险档（方案自答）+ `focus-ring-danger` 危险环。
3. 尾随图标槽：绝对定位于输入右缘内缩一档（`right-sm`；`data-[trailing=true]` 时输入右侧补 `pr-9`），`surface-fg`、不接指针。根容器无内边距——根宽即输入宽。
4. 面板：面板宽度经 `matchWidth` 锁宿主（根无内边距，根宽即输入宽，同宽车道）——宿主根 `w-55` 宽档——`rounded-xl` + `border-frame` + `surface-raised` + `shadow-elevated`，`p-1`；宿主塞入更宽内容（日历 7 × 44 格）时经自身 `popover` 覆盖重报宽度（见 DatePicker）；内嵌列表保几何，`border` 档决定去留自身的框。
5. 组合导出：`pickerClasses` / `pickerPartClasses` / `pickerRootClasses` 供 Combobox、DatePicker 复用。
6. 专属令牌：无。
