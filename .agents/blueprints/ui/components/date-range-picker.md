# DateRangePicker 骨架（app/ui/components/date-range-picker.tsx）

- 职责：单日历面板选两次得到日期区间。复用 `Calendar` 的网格、键盘导航与月/年视图；`DatePicker` 单值 API 保持不变。
- 依据：`app/ui/components/calendar.tsx` 的 `CalendarGrid` / `CalendarGridRow` / `CalendarGridCell` 已实现 `role="grid"`、方向键焦点跳转、月份翻页后的焦点恢复；区间选择最难的部分在这里，不另写一套。

## 对 Calendar 的向后兼容扩展

- `CalendarProps` / `CalendarGridProps` / `CalendarGridRowProps` 增加可选 `range?: CalendarRange`（`{ start: Date | null; end: Date | null }`）
- `CalendarGridCell` 增加可选 `rangeRole?: "start" | "end" | "between" | "single"`，渲染为 `data-range` 属性；`aria-selected` 仍由单值 `value` 决定，区间内的格子另加 `data-in-range`
- `CalendarProps` 增加可选 `weekdayLabels?: string[]` 与 `monthLabels?: string[]`；不传时沿用现有英文默认值
- 不传 `range` 时行为与现在完全一致，`DatePicker` 零改动

## 行为 / 状态

- 导出：`DateRangePicker`、`DateRangeValue`、`DateRangePickerProps`、`DateRangePickerClassNames`、`DateRangePickerStyles`、`CalendarRange`
- `DateRangeValue = { start: string | null; end: string | null }`，用 ISO `YYYY-MM-DD` 字符串，便于直接交后端，避免 `Date` 对象的时区歧义
- props：`value` / `defaultValue`、`onValueChange`、`placeholder`、`startLabel` / `endLabel`、`separator`、`weekdayLabels`、`monthLabels`、`clearText`（默认 `Clear`，作关闭图标 `aria-label`）、`invalidText`、`isDateDisabled`、`firstDayOfWeek`、`disabled`、`classNames`、`styles`
- 状态机只有两态 `picking: "start" | "end"`：点第一次写入 `start` 并切到 `end`；点第二次若日期不早于 `start` 则写入 `end` 并关闭面板，若早于 `start` 则把它当作新的 `start` 重新等待 `end`；允许 `start === end`
- 悬停预览：`picking === "end"` 且已有 `start` 时，鼠标悬停日历日即时预览「`start` → 悬停日」的区间（仅视觉，经 `range` 下传，不提交、不进显示文本）；移出日历网格清空预览；预览更新只重渲区间状态变化的单元格（单元格 memo，见 calendar 蓝图），不重渲整月；`Calendar` / `CalendarGrid` 新增可选 `onHoverDateChange`（不传时行为不变）
- 清除：面板不设清除按钮；打开面板时尾部图标由日历换成关闭图标（X），X 为可点击按钮，点击清除已选值且面板保持打开（无值时无操作）；输入框聚焦按 `Backspace` 同样清除值；`clearText` 作 X 的 `aria-label`
- 面板不放步骤提示：两步选择的引导由输入框 `placeholder` 与悬停预览承担
- 区间带与悬停预览带的视觉由皮肤按 `data-range` 绘制（见 `ui/skins/date-range-picker.md`），骨架只把当前生效区间经 `range` 下传
- 浮层沿用 `Picker` + `popover="manual"`，渲染在 top layer，不受表头 `overflow-hidden` 裁剪；**传 `matchPanelWidth={false}`**，面板宽度由皮肤按日历自身尺寸给定，绝不跟随窄字段压缩
- 无障碍：输入框 `role="combobox"` + `aria-expanded`；日历格 `role="gridcell"` + `aria-selected`；关闭后焦点回输入框；`Esc` 关闭并保留已选 `start`
- 槽位：`{ root; input; trailing; trailingClose; popover; panel; calendar; invalid }`；骨架零样式
- 不做：双月并排面板、时间选择、相对日期区间、手动输入日期文本解析
