# Card 皮肤（app/ui/skins/card.tsx）

1. Card（静态卡）：根默认 `w-full min-w-0 max-w-[24rem]`，使用 `size` 选择 `sm` 20rem / `md` 24rem（默认）/ `lg` 28rem / `xl` 32rem；`className` 可覆盖默认宽度。其余外观为 `rounded-lg` + `bg-surface-raised` 内容容器底（明度分层契约见 `ui/schemes.md` 第 21 条——卡是「比画布更亮一档」的内容承载件，亮档 `--surface-raised` 独立后必须显式挂才有明度阶，禁回落 `bg-background` / `bg-surface`）+ `border-frame` 描边 + `shadow-block`；边框与阴影是第二道线，不承担主要分离；内层包一件 `flex flex-col gap-4` 的内容包裹层——自带默认纵向 gap（数字乘道，紧凑档随 `--spacing` 基础值缩到 14px），内边距固定 `p-4`（`classNames.inner` 可整体换串）；无交互态、无 hover 动效。
2. CardButton（可点卡）：与 Card 共用尺寸 prop、同一默认 `md` 与同一 `bg-surface-raised` 卡底；单件无内层，自身 `p-4`；同卡框叠按钮态——单一 outline 外观，无变体；`motion-frame` 过渡束，hover `lift` 抬升 + `shadow-block-hover`，`focus-visible:focus-ring` 焦点环，`active:crush` 压平 + `shadow-frame-active`；`plain` 容器适配退透明底无阴影（含 `bg-surface-raised` 一并退掉），hover 才补描边。
3. 专属令牌：无。
