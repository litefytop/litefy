# Picker 皮肤（app/ui/skins/picker.tsx）

1. 组合：锚字段 + 手动 popover 面板（面板对齐字段宽）。字段是只读观感的文本框——`min-h-field`、`rounded-md` + `border-frame` 描边 + 底色方案自答（一边透明）+ `shadow-base` 浮起，字号行高方案自答 + `font-field`，placeholder `foreground`；输入显式 `cursor-pointer`，禁用态选择独立禁用类串并挂 `cursor-not-allowed`。
2. 焦点与无效：聚焦读法方案自答；无效挂 `field-invalid` 角色类（`aria-invalid` hook 纳入：边转 `danger-fg` + focus-within 危险环，定义见 `ui/schemes.md` 第 9 条），文字转 `danger` 单轴自挂。
3. 尾随图标槽：绝对定位于输入右缘内缩一档（`right-sm`；`data-[trailing=true]` 时输入右侧补 `pr-9`），`foreground`、不接指针。根容器无内边距——根宽即输入宽。
4. 面板：面板宽度经 `matchWidth` 锁宿主（根无内边距，根宽即输入宽，同宽车道）——宿主根 `w-full min-w-0 max-w-[20rem]`，跟随父容器但封顶 320px；面板 `w-fit min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))]`，复用 `pickerContentLayoutClasses` 的 `rounded-md` + `border-frame` + `surface-raised` + `shadow-elevated` + `p-[var(--radius-md)]` 圆角补偿；宿主塞入更宽内容（日历 7 × 44 格）时经自身 `popover` 用 `calendarPopoverWidthClasses` 覆盖宽度并覆盖 `p-3`（见 DatePicker）；内嵌列表保几何，`border` 档决定去留自身的框。
5. 组合导出：`pickerClasses` / `pickerPartClasses` / `pickerRootClasses` / `pickerContentLayoutClasses` 供 Combobox、DatePicker、DateRangePicker 复用。
6. 专属令牌：无。
7. 禁用观感：根按 `disabled` 选择独立禁用变体，替换正常颜色、焦点与光标类；交互阻断由骨架负责，不用 inert 代替禁用样式。
