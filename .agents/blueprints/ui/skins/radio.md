# Radio 皮肤（app/ui/skins/radio.tsx）

1. 命中区车道：label 行盒承担 44 下限（`min-h-control`），隐藏 input 保持 `size-6` 小方块居中（`opacity-0`）；隐藏 input 显式 `cursor-pointer`；禁用态由 `disabled` 选择独立禁用类串，input 与 label 显式挂 `cursor-not-allowed`。
2. 圆环：`size-4`（16px 可见环，与 Checkbox 指示框同档）+ `rounded-pill` + `border-hair` 描边——未选中空心（`bg-surface-raised` 凸起档不透明衬底只显描边，理由同 Checkbox 指示框第 2 条）+ `shadow-unchecked` 外环（画布色间隙 2px + `surface-fg` 外环 2px，与 `shadow-checked` 同构——足迹同 24px，点击只换色填充不跳尺寸；环色取 `surface-fg`：比 `primary` 选中环轻一档，层级不倒）；选中实心（`:has(:checked)`）免边框、`bg-primary-solid`（纯色 primary，小图标渐变豁免档，同 Checkbox，契约见 schemes.md rule 4）填满 16px 全盘（neon 4px 边框档只留 8px 内点，实心态去边框，用户定 2026-11-22）+ 共享 `shadow-checked` 双层光环（画布色间隙 + 主色外环，与 ColorSwatch 激活态同一角色），无圆点零件；`has-[:focus-visible]:focus-ring` 焦点环；`motion-frame` 过渡束。
3. label 行：字号行高方案自答 + `font-field` + `gap-x-4`；禁用（`:has(:disabled)`）选择独立禁用类串，使用 `disabled` / `disabled-fg` 与 `cursor-not-allowed`。
4. RadioGroup：方向为皮肤 wrapper 自有 `orientation` prop（骨架不收方向），解析成两套类串——纵向默认紧贴栈（禁纵向间距）；横向换行铺开，横向允许 `gap-x-4`。
5. 组标签：格式与 Field label 同档（`block ps-2 select-none text-sm control-label`），与选项间 4px（`mb-1`）；横向取向时 `w-full` 独占首行。
6. 覆盖折入：Radio 的 `className` 折进 label 槽、Group 的外观合进每个 option——自装式的选项仍保圆环。
7. 专属令牌：无。
（frame 阴影）承载面阴影并入 `--shadow-unchecked`（引用 var(--shadow-frame)，随各案 frame 值走），不再单独挂 shadow-frame 类——可交互件必有阴影（neo design.md 阴影律）由令牌组合承担。
