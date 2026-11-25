# Select 皮肤（app/ui/skins/select.tsx）

1. 触发件：`h-control` 命中、`w-full min-w-0` 缺省宽度（父容器提供宽度），`rounded-md` + `border-frame` 描边 + `bg-surface-raised` 凸起档背景色配 `text-surface-raised-fg` 文字色（控件静置面归凸起，见 `ui/schemes/elevation.md`）+ `shadow-base` 浮起，`px-control-x`、`text-sm leading-5` + `font-field`；`motion-frame` 束 + `focus-visible:focus-ring` 焦点环（字段族不铺 hover 色，反馈走焦点环）；Select 不发射描边档属性，不保留无效的 `borderless / bordered` 状态类；占位态（`data-[placeholder-shown=true]`）读同档前景，不单列覆盖类。
2. 值与箭头：值截断（ellipsis + nowrap）；chevron `size-4` + `foreground`，展开转 180°（`duration-sm`）。
3. 面板：宽度锁触发器（`data-float-match-width`）+ `max-h-64` 滚动浮层——`rounded-md` + `border-frame` + `surface-raised` + `shadow-elevated`，内边距自带圆角补偿 `p-[var(--radius-md)]`（与面板圆角档等值，圆角答 0 的方案归零贴边，选项自带 `px-3` 内边距；律见 `ui/schemes.md` 第 12 条）。
4. 组标签：`h-control` 固定 44px（与选项行等高，flex 居中）+ `control-text` 整档捆绑 + `foreground`，`px-3`。
5. 选项行：`h-control` 固定 44px（flex 居中）+ `px-3` + `text-sm`；hover 与 `data-[highlighted=true]` 共用 `listOptionHoverClasses` 同吃 `accent` 背景档（并写它的配对前景 `accent-fg`）；选中（`data-[selected=true]`）只加最重字重不加色；禁用（`data-[disabled=true]`）选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover 类；动作由骨架 JavaScript 守卫阻断。
6. 空态：`foreground` 小字。
7. cell 变体（`data-variant="cell"`）：设置行形态触发件——宽度与 default 同档（`w-full min-w-0`）+ `min-h-control`、`rounded-md` + 字段族描边与底色（与 default 同脸，不用 `justify-between`，三节点两段布局）；`label` 由骨架直渲进触发件，皮肤包进自有 span 承担行首整形——cell 变体 `mr-auto truncate` 前置左端，default 变体裸 span 不加类；值收拢右端（`ml-auto mr-2`）、chevron 缀尾；popover 仍 `bottom` 居中。
8. 组合导出：`selectClasses` 供需要同观感触发件 / 面板 / 选项的宿主直递复用。
9. 专属令牌：无。
