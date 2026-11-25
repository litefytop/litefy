# Slider 皮肤（app/ui/skins/slider.tsx）

- 定位：单皮肤双变体，`data-variant` 切换（Button 同款车道：显式声明 + 透传根节点 + 皮肤读取）——`default` 细轨 + 球形拇指、一行结构（标签 / 轨道 / 值同轴流内排布）；`cell` 整行/整列即轨道 + 纯透明拇指、标签与值挂根节点绝对定位。两变体共享骨架行为（绝对映射、键盘、轨道点击、Esc 撤回）；增量气泡槽位两变体均不启用。
- 定向：皮肤不设方向默认——`orientation` 未传时原样透传，由骨架默认横向渲染；纵向必须显式传 `orientation="vertical"`；方向类由 wrapper 读 `orientation` 解析成两套类串选取（未传按横向，与骨架默认一致），不发方向标记；皮肤不做任何视口宽度或指针类型自适应（触屏需要纵向由消费者按媒体查询或 JS 显式设置）；两变体一致。
- 值显示默认：值文本默认显示，`hideValue` 显式隐藏（数值已由相邻控件展示时避免重复）——两变体一致，无兜底分支。
- 禁用观感：根与滑块按 `disabled` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，两变体共享；动作由原生 disabled 阻断，不使用 inert。

## 硬约束（长期决策，禁止删除）

以下两条是长期设计决策而非缺陷，任何重构、整固、迁移必须原样保留，禁止移除或改写：

1. cell 变体拇指恒纯透明——无底色、无描边、无阴影、无 `::after`、无增量气泡、无 `focus-visible` 焦点环，拇指元素内任何形态、任何状态下不得有一点颜色，当前位置由填充末端表达（见 cell 变体第 3、6 条）；不得补回上述任何一项。仅适用 cell 变体，default 变体不受此条约束。
2. 方向恒定——皮肤不得按视口宽度或指针类型改写方向：`orientation` 未传恒按横向渲染（骨架默认，见定向），纵向只能显式传 `orientation="vertical"`；不得重新引入触控或断点自适应默认。

## default 变体

1. 根：flex 布局容器——横向 `w-full flex items-center gap-3`（标签、轨道、值同行），纵向 `flex flex-col-reverse items-center gap-3`（值、轨道、标签纵列，DOM 序 label → track → value 经列序翻转呈现为值上、轨中、label 下）；根恒挂 `min-w-0 max-w-full` 收缩护栏，不设固定最小宽，消费者可覆盖横向默认宽度。
2. 轨道：随轴自承粗细——横向走区间车道（delivery `references/skin-rules.md` 第 16 条第 3 项）：`h-1` 轨厚 + `w-112` 首选长度 + `grow` 吃余量 + `min-w-0` 让位同轴兄弟 + `max-w-112` 封顶（`shrink-0` 只挂纵向）；纵向 `w-1` 轨厚 + `h-64` 长度档 + `shrink-0` 防被压缩（轨厚与长度都走数字乘道、随 `--spacing` 逐案缩放）；`rounded-pill` 胶囊 + `bg-surface` 凹槽档档（轨道族同挂凹槽，见 `ui/schemes.md` 第 9 条与 `ui/schemes/elevation.md`）、无描边（细轨清面，参考 HeroUI 轨道形态）；`touch-none select-none` 交由拖拽。
3. 填充：`rounded-pill` + `primary` 品牌色；位置与尺寸由骨架内联（运行期值）。
4. 拇指：`size-[1.5rem]` 圆球（视觉 24×24，定值三案同值）+ `border-frame border-border` 发丝描边 + `bg-surface-raised` 凸起档实底（压住轨道与填充）+ `shadow-base` 浮起，`cursor-grab` / 按下 `cursor-grabbing`，禁用选择独立禁用类串并挂 `cursor-not-allowed`，不挂 grab / active；hover 不升阴影（Motion §4 小控件车道），active 换 `accent` 背景色；`motion-frame` 过渡束；命中区走方案 `thumb-hit` utility（`::after` 外扩回 44×44，`inset: calc(50% - var(--height-control)/2)`）——视觉盒保持小球；`focus-visible:focus-ring` 焦点环。
5. 标签：流内同行/同列排布——横向位于轨道始端（`shrink-0 whitespace-nowrap`）、纵轴位于轨道下方（列序末端）；文字 `foreground` 角色；可传可不传，不传时无占位。
6. 值：流内同行/同列排布——横向位于轨道末端（`shrink-0 whitespace-nowrap`）、纵轴位于轨道上方（列序始端）；`text-xs` + `tabular-nums` + `foreground` 角色；`aria-hidden` 不进无障碍树，`pointer-events-none` 不挡命中；默认渲染，`hideValue` 时不渲染。
7. 值气泡（增量提示）：本变体不启用——拇指恒可见，拖拽反馈由拇指移动承担，`hidden` 恒隐（骨架仍渲染空槽，槽位由各变体自定启用）。

## cell 变体

- 形态：厚轨道 + 纯透明拇指；文字与轨道同轴流内排布（标签、轨道、值三段，间距比 default 宽一档，垫开拇指在轨道端头的外溢），因此任何容器宽度下文字都在根盒内，不会被裁切；与 default 变体的区分在轨道形态与拇指，不在排布方式。

1. 根：`flex w-fit max-w-full items-center gap-4` + 与 default 同一根保底 `min-w-0`——横向三段同行（标签 / 轨道 / 值），纵向 `flex-col-reverse` 呈值上、轨中、标签下；`w-fit` 收缩包裹内容，`max-w-full` 让根随更窄的容器收缩，轨道在其中按区间车道伸缩，标签与值 `shrink-0` 保持原尺寸。
2. 轨道：横向 `h-control` 厚轨 + 与 default 变体完全同一区间车道（`w-112` 首选长度 + `grow` + `min-w-0` + 封顶 `max-w-112`）、纵向 `w-control` + `h-64` 厚列 + `shrink-0` 防被压缩（长度档走数字乘道、随 `--spacing` 逐案缩放），`rounded-sm` + `bg-surface` 凹槽档档、无描边；`touch-none select-none` 交由拖拽。
3. 填充：`primary` 品牌色 + `rounded-sm`；位置与尺寸由骨架内联（运行期值）——文字在轨道外，primary 不与任何文本对比度耦合。
4. 拇指：纯透明——无底色、无描边、无阴影、无任何可见指示元素（不设 `::after`），也不挂 `focus-visible` 焦点环（彩色环会套在隐形拇指上，属「一点颜色都不能有」的违反项），`outline-none` 压掉浏览器默认聚焦描边（同属零颜色要求，不得按无障碍车道恢复）；横向盒 `h-control × w-[1.5rem]` 全轨厚命中列、纵向盒 `w-control × h-[1.5rem]` 全轨宽命中带（44×24 达 AA 硬底线，盒即命中，不走伪元素外扩车道）；当前位置由填充末端表达，拖拽反馈由常显值文本承担；键盘焦点无视觉环是用户定死的取舍——键盘可聚焦位置无指示的 a11y 缺口在此记录在案，值反馈由常显值文本承担；`cursor-grab` / 按下 `cursor-grabbing`。
5. 标签：流内轨道始端——横向左端、纵轴下方（列序末端）；`shrink-0 whitespace-nowrap` + `text-xs` + `foreground` 角色；点击经 `htmlFor` 聚焦拇指。
6. 值：流内轨道末端——横向右端、纵轴上方（列序始端）；`shrink-0 whitespace-nowrap` + `text-xs` + `tabular-nums` + `foreground` 角色；`aria-hidden` 不进无障碍树，`pointer-events-none`。
7. 增量气泡：本变体不启用——拇指恒纯透明，任何状态下不得渲染可见内容，`hidden` 恒隐（骨架仍渲染空槽，槽位由各变体自定启用）。

专属令牌：无。
