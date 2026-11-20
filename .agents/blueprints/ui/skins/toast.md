# Toaster 皮肤（app/ui/skins/toast.tsx）

1. 视口：顶部居中固定（`top-4`、`max-w-112` 定档、`px-4` 边沟），`z-100`，平铺纵列 `gap-1` + `items-center`——无收起堆叠、无悬停展开（触屏没有 hover，hover-only 展开违 a11y 车道 17）；`pointer-events-none` 视口 + 卡 `pointer-events-auto`，不挡页面点击；视口背景透明（`bg-transparent`）；原生 popover 的 UA 样式显式中和——`overflow-visible` + `m-0` + `bg-transparent` + `border-0`（UA 默认 `Canvas` 底与 `solid` 边会白块显形）。
2. 卡（单行 chip）：`w-fit` 宽随内容 + `max-w-full` 移动端收窄 + `px-3 py-2` + `items-center`（图标随行居中）+ `rounded-xl` + `border-frame` + `shadow-hint`（轻提示层——minimal 答 elevated 档、neo 答 `none`）+ `pointer-events-auto`；`cursor-pointer`——点击切换展开态（`data-tapped`，骨架发）：
   - 语义色（与 callout 同法）：卡底常铺语义背景色档配 `*-fg` 文字色——缺省 info 对（`bg-info`/`text-info-fg`，loading 与无 type 同随缺省），`data-type=success` / `error→danger` / `warning` 切对应配对（`bg-success`/`text-success-fg` 一族）；图标与描述继承卡的文字色。
   - 不透明垫底：卡 `isolate` + `::before`（`-z-10`，`rounded-[inherit]`）铺一层 `background`，语义背景色始终合成在不透明画布色上，观感与 callout 落在页面一致。
   - 悬停不换色：卡面配色恒定——语义浅底与配对文字色常驻（与 callout 一致，语义消息面不因交互换色）；可点击示能由 `cursor-pointer` 与关闭钮的悬停显现承担。
   - 单行：标题 `truncate` 一行放不下即省略；描述默认 `hidden`，`data-tapped` 展开后显形——内容超出隐藏、点击展开。
   - 无倒计时条：卡内不承载任何动态进度内容——自动消失时长由 `duration` 控制、悬停 / 点击暂停计时（行为不随视觉删除），显眼动效会捕捉注意力、文本读数在单行 chip 上也无处安放（1.4.11 不适用于非必需图形）；`loading` 与 `duration: Infinity` 无自动关闭。
   - 关闭钮：默认 `opacity-0`，hover 卡（`group-hover/toast`）或展开（`group-data-[tapped]/toast`）浮现为 `opacity-100`，右侧垂直居中，文字色继承卡、hover 换 `accent` 对。
   - 计时暂停：视口 hover（骨架 `data-expanded`）或卡被点击（`data-tapped`）任一即暂停倒计时。
3. 图标：按 `data-type` 取语义文字色——success / error / warning 各配 `*-fg`；info 不另染。
4. 内容列：纵列 `min-w-0`；标题 `font-medium`；描述 `mt-1` + `text-sm`、文字色继承卡（与第 2 条一致）；卡内有动作按钮时内容右侧让位（`group-has-[button]/toast:pr-5`）。
5. 关闭钮：右上角 `p-1` 小钮 + `rounded-sm`，文字色继承卡、hover 换 `accent` 对（同第 2 条）；`::after` 外扩 44 命中。
6. 装配：`Toaster.success / error / warning / info / loading / promise` 命令入口整包递入同一 `skinClassNames`；退场时长随 `--duration-lg`（方案自答）。
7. 专属令牌：无。
