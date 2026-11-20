# Card 皮肤（app/ui/skins/card.tsx）

1. Card（静态卡）：根 `@container` + `rounded-lg` + `border-frame` 描边 + `shadow-block`；内层包一件 `flex flex-col gap-4` 的内容包裹层——自带默认纵向 gap（数字乘道，紧凑档随 `--spacing` 基础值缩到 14px），再叠 `p-4` 起步、容器 ≥36rem 升 `p-6`、≥56rem 升 `p-8` 的容器查询阶梯（`classNames.inner` 可整体换串）；无交互态、无 hover 动效。
2. CardButton（可点卡）：单件无内层，自身 `p-4`；同卡框叠按钮态——单一 outline 外观，无变体；`motion-frame` 过渡束，hover `lift` 抬升 + `shadow-block-hover`，`focus-visible:focus-ring` 焦点环，`active:crush` 压平 + `shadow-frame-active`；`plain` 容器适配退透明底无阴影，hover 才补描边。
3. 专属令牌：无。
