# DatePicker 皮肤（app/ui/skins/date-picker.tsx）

1. 组合：字段半接 Picker（root / input / trailing）；面板半（此处名 `popover`——`panel` 已被内部日历占用）接 Picker 面板叠 `calendarPopoverWidthClasses` + `p-3`；日历整包接 `calendarClasses`。
2. **宽度契约**：字段根默认 `w-full min-w-0 max-w-[20rem]`。骨架传 `matchPanelWidth={false}`，故定位层不再写内联宽度。面板宽度按日历自身尺寸显式给定：`7 × var(--width-control) + 6 × var(--spacing)`，随主题走；`max-w-[min(20rem,calc(100vw_-_1rem))] overflow-x-auto` 同时封顶 320px 与视口边沟。内部日历 `w-max min-w-[calc(7*var(--width-control))]`，保证 7 列等宽方格不被压缩。绝不跟随锚字段宽度。
3. 单框原则：面板画框，内嵌日历走无框半（`calendarInPanelClasses`），内边距由面板承担。
4. 专属令牌：无。
