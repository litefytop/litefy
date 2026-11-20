# Checkbox 皮肤（app/ui/skins/checkbox.tsx）

1. 命中区车道：label 行盒承担 44 下限（`min-h-control min-w-control`），隐藏 input 保持 `size-6` 小方块居中（`opacity-0`）——不把 input 放大到 44。
2. 指示框：`size-4`（16px 可见盒）+ `rounded-sm` + `border-2` 描边——三态同框：未选中空心（透明底只显描边）；半选（`:has(:indeterminate)`）与选中（`:has(:checked)`）同为实心——底色填 `primary`、描边换 `foreground`、文字色换 `primary-fg`，以图标区分：选中 Check、半选 Minus；不挂 `shadow-checked` 光环（光环是 Radio / SwatchPicker 的空心→实心语言）；`has-[:focus-visible]:focus-ring` 焦点环；`motion-frame` 过渡束。
3. 图标：`size-3`（吃满 16 盒减双边框的内空）+ `stroke-3`，`peer-checked` / `peer-indeterminate` 显形（透明度过渡 `duration-sm`）。
4. label 行：字号行高方案自答 + `font-field` + `gap-x-4`；禁用（`:has(:disabled)`）禁指针 + 压暗转 `surface-fg`。
5. 文本层（`lineThrough` 开启才出现在 DOM）：删除线由 label 行作答——`has-[:checked]` 且非半选时对 `span[data-line]` 后代加 `line-through`（decoration 色随文字色，直切不设过渡）；选择器挂在 label 上、目标不存在即无效果，宿主复用 `checkboxPartClasses.label` 时零回归。
6. 覆盖折入：headless 把 `classNames.label` 与 `className` 挂上同一元素，皮肤把消费方 `className` 折进 label 槽，避免同串挂两遍。
7. 组合导出：`checkboxPartClasses`（input / indicator / label）供 Transfer 行、Table 批量行等宿主复用。
8. CheckboxGroup：纵向紧贴栈（禁纵向间距）；分节标题与小节标题是两个文字角色——分节 `text-sm` + `font-label` 档 + label 两项 + `foreground`，小节标题同款但 `surface-fg` 文字色。
9. 专属令牌：无。
（neo 阴影）承载面挂 shadow-frame——可交互件必有阴影（neo design.md 阴影律），minimal 无此工具类不渲染、零回归。
