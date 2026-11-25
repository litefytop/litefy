# DateRangePicker 皮肤（app/ui/skins/date-range-picker.tsx）

1. `DateRangePicker` 包装 headless `DateRangePicker`，注入 `dateRangePickerClasses`；复用 `pickerClasses`、`pickerContentLayoutClasses`、`calendarClasses`、`calendarInPanelClasses`、`buttonVariants` 与 `calendarPopoverWidthClasses` / `calendarPanelWidthClasses`，与 `DatePicker` 同宽、同圆角、同边框、同阴影。根默认 `w-full min-w-0 max-w-[20rem]`，皮肤将消费者 `className` 与 `classNames.root` 经 `cn` 合并后交给骨架；`styles.root` 透传到字段根。
1a. **宽度契约**：骨架传 `matchPanelWidth={false}`；`popover` 用 `calendarPopoverWidthClasses`（`7 × --width-control + 6 × --spacing`，随主题）+ `max-w-[min(20rem,calc(100vw_-_1rem))]` + `p-3`，`panel` 用 `calendarPanelWidthClasses`（`w-max min-w-[calc(7*var(--width-control))]`）保证 7 列方格。top layer 浮层不跟随窄表头单元格压缩，极窄视口只做 320px 上限、视口边沟与横向滚动。
2. 日历直接复用 `calendarClasses`，不再导出或合并区间专用类串；`DatePicker` 与 `DateRangePicker` 共用同一套日期状态外观。
3. 区间与悬停预览的 `start` / `end` / `between` 全部映射为 Calendar 的 `active` 状态，统一使用 `bg-primary` + `text-primary-fg`，所有日期格均保持 `rounded-none`，不区分端点、中间格或一天区间，也不挂 hover 类。非当月日期未被激活时使用 `surface` 对，激活后使用主色；禁用日期优先使用独立禁用外观，不挂载激活、月外或 hover 类。`data-range` 仅保留区间角色语义。
4. 尾部图标：面板关闭时显示日历图标，打开时换成关闭（X）图标；X 是可点击按钮（复用 `buttonVariants.text` 图标形态改小档），样式走 `trailingClose` 槽位（`pointer-events-auto size-7 min-h-0 min-w-0 p-0`，图标尺寸由按钮帧自带；日历图标槽保持 `pointer-events-none`），点击清除已选值、面板保持打开，`aria-label` 用 `clearText`。
5. 无效提示 `text-xs text-danger-independent`；面板不放步骤提示行。
6. 输入框随字段族同高（`min-h-field`，紧凑档随令牌收缩），不再压第三档小高；表头筛选行与数字区间同高（同为字段族高度）。
7. 组合导出 `dateRangePickerClasses`。
8. 专属令牌：无。
