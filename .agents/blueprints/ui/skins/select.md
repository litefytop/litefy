# Select 皮肤（app/ui/skins/select.tsx）

1. 触发件：`min-h-control` 命中、`w-55` 宽档 + `max-w-full` 上限，`rounded-md` + `border-frame` 描边 + `background` 背景色配 `foreground` 文字色 + `shadow-base` 浮起，`px-control-x py-1`、`text-sm` + `font-field`；`motion-frame` 束 + `focus-visible:focus-ring` 焦点环（字段族不铺 hover 色，反馈走焦点环）；`borderless / bordered` 档切换描边；占位态（`data-[placeholder-shown=true]`）文字转 `surface-fg`。
2. 值与箭头：值截断（ellipsis + nowrap）；chevron `size-4` + `surface-fg`，展开转 180°（`duration-sm`）。
3. 面板：宽度锁触发器（`data-float-match-width`）+ `max-h-64` 滚动浮层——`rounded-xl` + `border-frame` + `surface-raised` + `shadow-elevated`，内边距取圆角补偿带 `panelPadClass`（圆角答 0 的方案归零维持 0 间距贴边，选项自带 `px-3` 内边距；律见 `ui/schemes.md` 第 14 条）。
4. 组标签：`h-control` 固定 44px（与选项行等高，flex 居中）+ `text-label`/`leading-label` 角色令牌 + `font-label` 档 + label 两项 + `surface-fg`，`px-3`。
5. 选项行：`h-control` 固定 44px（flex 居中）+ `px-3` + `text-sm`；hover 与 `data-[highlighted=true]` 同吃 `accent` 对；选中（`data-[selected=true]`）只加最重字重不加色；禁用（`data-[disabled=true]`）压暗且不吃 hover。
6. 空态：`surface-fg` 小字。
7. cell 变体（`data-variant="cell"`）：设置行形态触发件——宽度与 default 同档（`w-55`）+ `min-h-control`、`rounded-md` + 字段族描边与底色（与 default 同脸，不用 `justify-between`，三节点两段布局）；`label` 由骨架直渲进触发件，皮肤包进自有 span 承担行首整形——cell 变体 `mr-auto truncate` 前置左端，default 变体裸 span 不加类；值收拢右端（`ml-auto mr-2`）、chevron 缀尾；popover 仍 `bottom` 居中。
8. 组合导出：`selectClasses` 供需要同观感触发件 / 面板 / 选项的宿主直递复用。
9. 专属令牌：无。
