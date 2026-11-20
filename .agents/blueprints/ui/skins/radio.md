# Radio 皮肤（app/ui/skins/radio.tsx）

1. 命中区车道：label 行盒承担 44 下限（`min-h-control`），隐藏 input 保持 `size-6` 小方块居中（`opacity-0`）。
2. 圆环：`size-4`（16px 可见环，与 Checkbox 指示框同档）+ `rounded-pill` + `border-2` 描边——未选中空心（透明底只显描边）；选中实心（`:has(:checked)`）底色填 `primary` + 共享 `shadow-checked` 双层光环（画布色间隙 + 主色外环，与 SwatchPicker 激活态同一角色），无圆点零件；`has-[:focus-visible]:focus-ring` 焦点环；`motion-frame` 过渡束。
3. label 行：字号行高方案自答 + `font-field` + `gap-x-4`；禁用（`:has(:disabled)`）禁指针 + 压暗转 `surface-fg`。
4. RadioGroup：纵向紧贴栈（禁纵向间距）；横向（`data-[orientation=horizontal]`）换行铺开，横向允许 `gap-x-4`。
5. 覆盖折入：Radio 的 `className` 折进 label 槽、Group 的外观合进每个 option——自装式的选项仍保圆环。
6. 专属令牌：无。
（neo 阴影）承载面挂 shadow-frame——可交互件必有阴影（neo design.md 阴影律），minimal 无此工具类不渲染、零回归。
