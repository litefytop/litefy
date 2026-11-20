# Calendar 皮肤（app/ui/skins/calendar.tsx）

1. 框体：`rounded-lg` 圆角、`border` 描边、`background` 背景色 + `shadow-surface` 阴影、`foreground` 文字色，`p-3` 内边距、纵向紧贴节奏（禁纵向间距）；宽度占满宿主容器并按网格自然宽封顶（`w-full`，上限 `7 × --width-control + 14px + 6 × --spacing`，14px = 7 列 × 两侧各 1px 净距），窄容器随之收缩、不设横向最小宽；宿主已画框（DatePicker 面板）走无框变体，只留纵向排布与节奏，不套第二层框。
2. 头部：两端对齐；前后翻页钮复用按钮的框与 text 角色底（透明背景色），44 方格（`size-control`），内置 chevron 16（`size-4`）。
3. 标题钮：同一按钮底，`min-h-control` 加 `px-2`，`text-sm` 加最重字重；悬停换 `accent` 对，激活（`data-[active=true]`，展开了对应的年 / 月视图）换 `primary` 对。
4. 网格：一套网格类服务日 / 月 / 年三视图，不设 gap——1px 净距由日期格自身 margin 提供，表头与格子共享同一 1fr 轨道、对齐不依赖 gap；轨道宽 = `--width-control + 2px`，格占 44 居中；框宽按网格自然宽封顶；周历 `grid-cols-7` 均分，月 / 年层（`data-[cols=3]`）换 3 列。
5. 星期表头：`h-8` 居中，`text-xs` 加 label 档（`font-label` / `tracking-label` / `case-label`），`surface-fg` 文字色。
6. 日期格：高度固定 44（`h-control`），宽度上限 44（`max-w-[var(--width-control)]`）+ `justify-self-center`——轨道均分填满容器，按钮在每列中限宽居中，桌面端呈正方形，移动端轨道压缩时按钮宽度随 `w-[calc(100%-2px)]` 拉窄但高度保持 44；相邻格净距 1px（`m-px` + `w-[calc(100%-2px)]` 消化 margin、避免溢出轨道；框体上限已含 14px 净距，桌面端仍正方形）；命中区宽度按 AA 硬底线 24 验收（2.5.8）；`rounded-md` 圆角，`text-sm`、`font-field`、等宽数字（`tabular-nums`）；悬停换 `accent` 对；`aria-selected` 换 `primary` 对且悬停不改选中色；键盘导航是骨架的 roving tabindex（真按钮 + `.focus()`）；焦点环挂共享 `focus-visible:focus-ring`——环语言全局唯一，皮肤只可改大小、不可特制换色；环画在格外侧，零净距网格不预留 outline，邻格悬停 / 选中为不透明底时局部覆盖环属可接受取舍（选中格自身的环落在画布上，`primary` 环照样可见）；`disabled` 换 `surface-fg` 文字色；非当月（`data-[outside-month=true]`）透明度 40%。
7. 另导出 `calendarPopoverWidthClasses` / `calendarPanelWidthClasses` 两个共享宽度常量，供 `DatePicker` / `DateRangePicker` 的 top-layer 面板使用：按 `7 × --width-control + 14px + 6 × --spacing` 定宽、`max-w-[calc(100vw-1rem)] overflow-x-auto` 兜底，内部日历 `w-max min-w-[7 × --width-control + 14px]`。这样日历浮层不跟随窄锚字段压缩，与「Calendar 独立使用时随容器收缩」互不冲突。
8. 专属令牌：无。
