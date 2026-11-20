# DateRangePicker 皮肤（app/ui/skins/date-range-picker.tsx）

1. `DateRangePicker` 包装 headless `DateRangePicker`，注入 `dateRangePickerClasses`；复用 `pickerClasses`、`calendarClasses`、`calendarInPanelClasses`、`buttonVariants` 与 `calendarPopoverWidthClasses` / `calendarPanelWidthClasses`，与 `DatePicker` 同宽、同圆角、同边框、同阴影。
1a. **宽度契约**：骨架传 `matchPanelWidth={false}`；`popover` 用 `calendarPopoverWidthClasses`（`7 × --width-control + 6 × --spacing`，随主题）+ `p-3`，`panel` 用 `calendarPanelWidthClasses`（`w-max min-w-[7 × --width-control]`）保证 7 列方格。top layer 浮层不跟随窄表头单元格压缩，极窄视口只做上限与横向滚动。
2. 日历格区间样式另导出 `calendarRangeClasses`，由本组件合并进 `calendar` 槽位，不改 `calendarClasses` 本体，避免影响 `DatePicker` 与其它 `Calendar` 使用者。
3. 区间带（含悬停预览带）：`data-range=start|end|single` 实心 `bg-primary` + `text-primary-fg`，hover 不变色；`data-range=between` 连续 `bg-accent` + `text-foreground`，hover 不变色。圆角：start 只保留左侧外圆角、end 只保留右侧外圆角、between 无圆角，整条区间连成一条带，起止两端与中间无断点。
4. 尾部图标：面板关闭时显示日历图标，打开时换成关闭（X）图标；X 是可点击按钮（复用 `buttonVariants.text` 图标形态改小档），样式走 `trailingClose` 槽位（`pointer-events-auto`，日历图标槽保持 `pointer-events-none`），点击清除已选值、面板保持打开，`aria-label` 用 `clearText`。
5. 无效提示 `text-xs text-danger-fg`；面板不放步骤提示行。
6. 输入框随字段族同高（`min-h-field`，紧凑档随令牌收缩），不再压第三档小高；表头筛选行与数字区间同高（同为字段族高度）。
7. 组合导出 `dateRangePickerClasses` 与 `calendarRangeClasses`。
8. 专属令牌：无。
