# Input 皮肤（app/ui/skins/input.tsx）

1. 字段壳（共享正本）：`min-h-control` 下限、`w-55` 缺省内在宽（宿主车道，消费方 `w-full` 接管即纯宿主形态）、`rounded-md` 圆角 + `border-frame` 描边 + `base` 阴影浮起 + `background` 背景色配 `foreground` 文字色 + 框距 `p-well`（方案井框距 `--padding-well`，0 即无框），`cursor-text`、`motion-frame` 过渡束；`borderless / bordered` 档切换描边有无。禁用态：壳级 `has-[:disabled]` 压暗（`opacity-50`）+ `cursor-not-allowed`——内层输入框原生禁用即整壳读作禁用，宿主（Input / Password / Number / Combobox / FilterCombobox）自动继承。
2. 焦点双通道（皮肤都声明、方案各自作答）：`focus-within` 换壳读法——一边由描边 + 阴影表达、一边真换背景色而边不动。
3. 无效态：`data-[invalid=true]` 边转 `danger-fg`，聚焦在焦点读法上叠危险档（方案自答）。
4. 内层井（输入元素）：`bg-well` 井底 + `shadow-well` 井内阴影 + 端帽式圆角——圆角只落在壳的前后缀两端，贴插件一侧恒为直角：井为壳内首件（无前缀插件）保留 start 侧两角、紧邻尾随插件（`data-field-trailing` 标记）时让出 end 侧两角、两侧皆有插件时四角归零，隐形浮件（聚焦提示卡等 absolute 垫底件）不计入几何；半径式不变（`max(0px, radius-md − frame 边宽)`，式见 delivery `references/skin-rules.md` 第 17 条），收编由壳级选择器执行（`&>input:not(:first-child)` 削 start 侧、`&>input:has(+[data-field-trailing])` 削 end 侧）+ 无边框（`min-w-0 grow basis-0 self-stretch`、`px-3` 文字内边距），字号行高方案自答 + `font-field`、`text-inherit` 跟壳换色；placeholder `surface-fg`；选区 `primary` 背景色 + `primary-fg` 文字色。井三角色逐案答案归蓝图 `ui/schemes.md` 第 9 条与各案 design.md `well` 块。
5. 前后置插件槽（leading / trailing）：`inline-flex` + `px-3` 呼吸 + `surface-fg` 文字色；内容自带尺寸，槽不撑大。压缩链（窄容器优先级，固定）：后缀最先让位（trailing `min-w-0 overflow-hidden`，可缩可裁剪）→ 内容区其次（`grow basis-0`，只吃后缀让完后的剩余空间）→ 前缀锁死（`shrink-0`，图标位不动）；外壳 `max-w-full min-w-0` 钳制缺省宽度档（`w-55` 在窄容器自动收敛，示例墙不破格）。
6. 浮动提示（`fieldHintClasses`）：字段右上绝对定位的底色浮签——`surface-raised` 背景色 + 发丝边 + `text-xs` + label 两项（`tracking-label` / `case-label`）+ `shadow-subtle`，由 `peer-focus-visible` 显形，`pointer-events-none`。
7. 多行域（`fieldTextareaClasses`）：同字段框自承一盒、自身即井——`min-h-20`、`resize-y`、`bg-well` 井底（自承一盒只有一枚 box-shadow：容器档 `shadow-frame` 浮起在位，井内阴影让位——多行域的凹感只走井底色）、字号行高方案自答；焦点与无效读法与壳一致（`aria-invalid` 直挂自身）。
8. 组合导出：`fieldGroupClasses` / `fieldInputClasses` / `fieldAddonClasses` / `fieldHintClasses` / `fieldTextareaClasses` / `inputPartClasses` 供 Password、Number、MultiSelect、FormItem、Command 等宿主装配。
9. 专属令牌：无。
