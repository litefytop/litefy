# Checkbox 皮肤（app/ui/skins/checkbox.tsx）

1. 命中区车道：label 行盒承担 44 下限（`min-h-control min-w-control`），隐藏 input 保持 `size-6` 小方块居中（`opacity-0`）——不把 input 放大到 44；隐藏 input 显式 `cursor-pointer`；禁用态由 `disabled` 选择独立禁用类串，input 与 label 显式挂 `cursor-not-allowed`。
2. 指示框：`size-4`（16px 可见盒）+ `rounded-xs` 方形小圆角（与 radio 圆环拉开形别，防误读；取值各方案令牌自答）+ `border-hair` 描边——三态同框：未选中空心（`bg-surface-raised` 凸起档不透明衬底只显描边——控件静置面归凸起（见 `ui/schemes/elevation.md`），衬底比画布亮一阶即自辨，落在斑马纹、hover 底等非画布底上也不随外底漂移，对比不靠衬底挣；不靠加粗描边救对比：状态间宽度跳变，且前景色描边对任意外底不保 3:1）+ `shadow-unchecked` 外环（画布色间隙 2px + `foreground` 外环 2px，与 `shadow-checked` 同构——足迹同 24px，点击只换色填充不跳尺寸；环色 `foreground` 比 `primary` 轻一档，层级不倒）；半选与选中同为实心，由骨架在 indicator 发布的 `data-selected` 取态——底色填 `bg-primary-solid`（纯色 primary，小图标渐变豁免档，契约见 schemes.md rule 4）吃满整盒、免边框（实心态去边框：neon 的 4px 边框档吃掉 16px 盒的上色空间——内空仅剩 8×8，check 无处容身，用户定 2026-11-22）、文字色换 `primary-fg`，共享 `shadow-checked` 双层光环（画布色间隙 + 主色外环，与 Radio / ColorSwatch 同一空心→实心语言），以图标区分：选中 Check、半选 Minus；`has-[:focus-visible]:focus-ring` 焦点环；`motion-frame` 过渡束。
3. 图标：`size-3`（实心态盒内无框，16 盒四边留 2px）+ `stroke-3`，`peer-checked` / `peer-indeterminate` 显形（透明度过渡 `duration-sm`）。
4. label 行：字号行高方案自答 + `font-field` + `gap-x-4`；禁用时以禁用类串替换正常文字、指示框与光标样式，使用 `disabled` / `disabled-fg`，保留布局。
5. 文本层（`lineThrough` 开启才出现在 DOM）：删除线在文本层自己的槽位类上作答——label 行挂 `group/label` 标记，`checkboxPartClasses.text` 以 `group-has-[:checked]/label:not-group-has-[:indeterminate]/label:line-through` 从 label 取态（decoration 色随文字色，直切不设过渡）；槽位类挂在文本层自身，宿主复用 `checkboxPartClasses` 时零回归。
6. 覆盖折入：headless 把 `classNames.label` 与 `className` 挂上同一元素，皮肤把消费方 `className` 折进 label 槽，避免同串挂两遍。
7. 组合导出：`checkboxPartClasses`（input / indicator / label）供 Transfer 行、Table 批量行等宿主复用。
8. CheckboxGroup：纵向紧贴栈（禁纵向间距）；组标签格式与 Field label 同档（`block w-full ps-2 mb-1 select-none text-sm control-label`），与选项间 4px（`mb-1`）；分节标题与小节标题是两个文字角色——分节 `text-sm` + `control-label` + `foreground`，小节标题同款但 `foreground` 文字色。
9. 专属令牌：无。
（frame 阴影）承载面阴影并入 `--shadow-unchecked`（引用 var(--shadow-frame)，随各案 frame 值走），不再单独挂 shadow-frame 类——可交互件必有阴影（neo design.md 阴影律）由令牌组合承担。
