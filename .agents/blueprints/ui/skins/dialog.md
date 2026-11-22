# Dialog 皮肤（app/ui/skins/dialog.tsx）

1. 壳（root）：dialog 元素即全视口透明滚动壳——`h-dvh w-full max-w-none max-h-none m-0 border-0 bg-transparent p-0` 覆写 UA 定宽限高，`overflow-y-auto` + `overscroll-behavior: contain` 吃掉并断链全部滚轮/触摸（≥1px 可滚区间由 stage 提供），`[scrollbar-width:none]` 隐藏壳自身的 1px 滚动条。锁滚零 JS——top layer 命中测试挡背景滚动条与指针，原生 showModal 挡焦点。backdrop 遮罩为平色蒙层走 veil 档（与 Drawer 同款角色，方案自答）——不挂 backdrop-blur，理由同 Drawer（空变量滤镜链引发合成伪影）。
2. 定界层（stage）：`grid min-h-[calc(100dvh+1px)] w-full place-items-center`——比视口高 1px（功能性常量，非视觉取值）保证壳恒有可滚区间，卡片在视口内居中；`pointer-events-none` 不接指针——满幅层只作居中与滚程几何，幕布点击穿透到壳，由骨架 `target === currentTarget` 判背景关闭。
3. 面板（content）：流内卡片（去 fixed 定位，改 `relative` 承载右上角骑线关闭钮），`pointer-events-auto` 接回指针（指针事件沿子树继承，卡片内容交互不受定界层穿透影响），宽度走浮层车道 `w-full max-w-[min(100%_-_--spacing(8),--spacing(112))]`——默认档 112 单位，视口两侧留 8 单位边沟，窄视口由 `min()` 自动让位，不写死下限（写死的 `min-w` 在更窄视口会撑破）；宽形态由消费方把上限档换 128。`my-4` 呼吸（超出视口的卡片由壳滚动到达），`rounded-xl` 圆角 + `border-frame` 描边 + `surface-raised` 面 + `shadow-elevated` 浮起，面板内边距固定 `p-4`（紧凑档随 `--spacing` 收缩，体量差异由圆角档承担），`text-base` + `leading-body`。
4. 头行：两端对齐 + `mb-3`；标题 `text-h3` + `leading-head` + 最重字重（strong）+ `case-label`，截断（ellipsis + nowrap），`mr-auto` 给关闭钮让位。
5. 关闭钮：两种形态共享文字钮底子——引用 `buttonVariants.text` 再叠差异：`hover:no-underline`（下划线会划过键帽，hover 反馈交给 focus-ring 与钮面本身）、`data-[inline=true]:static data-[inline=true]:shrink-0` 回文档流；钮内节点由骨架渲染、皮肤经槽逐节点着装——kbd 形态键帽走 `closeKey` 槽落 `kbd` 工具类，icon 形态 X 图标走 `closeIcon` 槽落 `size-4`；44 命中由文字钮 `h-control` 承担，不另写定位与描边。
6. 状态图标：标题行内 `data-status` 装饰件，`size-4`，按语义取 `success-fg` / `danger-fg` / `warning-fg` / `info-fg` 文字色——状态色当文字色不当背景色。
7. 组合导出：`dialogPartClasses` 供 Command 面板等宿主装配；`dialog.success / error / warning / info` 命令入口整包接入同一皮肤。
8. 专属令牌：无。
