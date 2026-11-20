# Calendar 皮肤（app/ui/skins/calendar.tsx）

1. 框体：`rounded-lg` 圆角、`border` 描边、`background` 背景色 + `shadow-surface` 阴影、`foreground` 文字色，`p-3` 内边距、纵向紧贴节奏（禁纵向间距）；宽度占满宿主容器并按网格自然宽封顶（`w-full`，上限 `7 × --width-control + 6 × --spacing`，`6 × --spacing` 即 p-3 两侧内边距），窄容器随之收缩、不设横向最小宽；宿主已画框（DatePicker 面板）走无框变体，只留纵向排布与节奏，不套第二层框。
2. 头部：两端对齐；前后翻页钮复用按钮的框与 text 角色底（透明背景色），44 方格（`size-control`），内置 chevron 16（`size-4`）。
3. 标题钮：同一按钮底，`min-h-control` 加 `px-2`，`text-sm` 加最重字重；悬停换 `accent` 对，激活（`data-[active=true]`，展开了对应的年 / 月视图）换 `primary` 对。
4. 网格：一套网格类服务日 / 月 / 年三视图，不设 gap 也不设格间净距——零间隙网格（用户定 2026-11-20），格子 `w-full` 占满 1fr 轨道、相邻相接，轨道宽即 `--width-control`，命中区恰为 44×44（2.5.5 AAA）；框宽按网格自然宽封顶；周历 `grid-cols-7` 均分，月 / 年层（`data-[cols=3]`）换 3 列。
5. 星期表头：`h-8` 居中，`text-xs` 加 label 档（`font-label` / `tracking-label` / `case-label`），`surface-fg` 文字色。
6. 日期格：44×44 命中区（`h-control` + `w-full` 占满轨道，桌面端轨道均分即正方形；移动端轨道压缩时格随轨道拉窄、高度保持 44）；零间隙相邻相接（用户定 2026-11-20，schemes.md 蓝图第 18 条）；`rounded-md` 圆角，`text-sm`、`font-field`、等宽数字（`tabular-nums`）；悬停换 `accent` 对；`aria-selected` 换 `primary` 对且悬停不改选中色；键盘导航是骨架的 roving tabindex（真按钮 + `.focus()`）；焦点环挂共享 `focus-visible:focus-ring-inset`——环与光晕同形内画（schemes.md 第 18 条机制档），聚焦足迹不超 44×44 控件盒，选中态上 `primary` 环压 `primary` 底不可见属可接受取舍；`disabled` 换 `surface-fg` 文字色；非当月（`data-[outside-month=true]`）文字 50% 透明（`text-foreground/50`，各案 design.md Motion §6 豁免清单第六条 / neo 例外注记）。
7. 另导出 `calendarPopoverWidthClasses` / `calendarPanelWidthClasses` 两个共享宽度常量，供 `DatePicker` / `DateRangePicker` 的 top-layer 面板使用：按 `7 × --width-control + 6 × --spacing` 定宽、`max-w-[calc(100vw-1rem)] overflow-x-auto` 兜底，内部日历 `w-max min-w-[7 × --width-control]`。这样日历浮层不跟随窄锚字段压缩，与「Calendar 独立使用时随容器收缩」互不冲突。
8. 专属令牌：无。
