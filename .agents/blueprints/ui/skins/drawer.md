# Drawer 皮肤（app/ui/skins/drawer.tsx）

1. 壳（root）：dialog 元素即全视口透明滚动壳——`h-dvh w-full max-w-none max-h-none m-0 border-0 bg-transparent p-0 outline-none` + `overflow-y-auto overflow-x-hidden` + `overscroll-behavior: contain` 吃掉并断链滚轮/触摸（≥1px 可滚区间由 stage 提供），`[scrollbar-width:none]` 隐藏壳自身滚动条；`group/drawer` 标记承载业务 `data-duration` 档。backdrop 遮罩为平色蒙层，底色走 veil 档（方案自答）——不挂 backdrop-blur：引用未立卡变量的滤镜链会把 backdrop 推进异常合成层，丢掉其后 fixed 层（横幅背景被丢成透明、内容瓦片重影）。
2. 定界层（stage）：`grid h-[calc(100dvh+1px)] w-full`（定值高度——面板与内容的高度链靠 `h-full` 逐层解析，定界层只给 min-height 时整条链失效，内容长高会把面板撑出视口、把面板内的固定工具区推出屏幕；功能性 1px 常量保证壳恒有可滚区间）+ 按 `data-placement` 对齐——left `items-stretch justify-items-start`、right `items-stretch justify-items-end`、top `items-start justify-items-stretch`、bottom `items-end justify-items-stretch`；`pointer-events-none` 不接指针——满幅层只作对齐与滚程几何，幕布点击穿透到壳，由骨架 `target === currentTarget` 判背景关闭。
3. 面板（wrapper）：流内网格项（去 fixed/inset 定位），`pointer-events-auto` 接回指针（指针事件沿子树继承，面板内容交互不受定界层穿透影响），`rounded-xl` 圆角 + `border-frame` 发丝描边 + `border-border` 描边色 + `surface-raised` 背景色 + `shadow-elevated` 浮起，位移过渡（`duration-md`，随 `group-data-[duration=*]` 换档）；主轴长度走定档车道 `--litefy-pane-size` 默认 96 单位、`data-size` 换 sm 80 / lg 128，交叉轴保底左右 `min(100%,--spacing(64))` / 上下 `min(100%,--spacing(48))`；左右向 `h-full` 拉满定界层（底端 1px 沉到折叠线下，视觉整高），四向 placement 各答网格对齐与 flex 方向，把手贴外沿；`@container` 挂面板。
4. 把手：`w-4 / h-4` 细条 + `border-x/y-frame` 分隔边，内置 grab 短棒（`rounded-sm` + `surface-fg` 色，横 12×1 / 竖 1×12）。
5. 内容：`flex-1` 滚动列，不设内边距，间距由内容自行管理，`text-base` + `leading-body`；纵向 placement 水平居中。
6. 焦点：面板接 `group-focus-visible/drawer:outline-2`——焦点可见性由根的 focus-visible 驱动。
7. 专属令牌：无。
