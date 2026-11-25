# DatePicker 骨架（app/ui/components/date-picker.tsx）

- 职责：日期输入框 + 日历面板：文本解析年 / 年月 / 完整日期，选中后经 `Picker` 定位展示。

## 行为 / 状态

- `value`/`defaultValue` 为 `Date | null`；`onValueChange` 只在提交日期的 `commit` 触发（打字中的完整日期不触发）；`open` 仅内部状态，初始 false
- 初值：`text` 取初值 `toISODate`，`selected` 取初值，`visibleMonth` 取初值月初（缺省 `currentDate`），`view="days"`；外部 `value` 变化时同步 `committedRef`、`selected`、`text`，有值时回到该月 days 视图
- 文本解析（`parseInput`）：trim 后以 `[\s,/，]+` 归一为 `-` 分段；单段 4 位数字为年、两段为合法年月、三段经 `parseISODate` 校验为完整日期，其余非法，空串为空
- 输入：每次改字清错误；解析为完整日期时立即写 `selected` 与 `visibleMonth`，但不提交
- `applyParsed`：空串清错误；非法清空文本并置错误；年写该年 1 月、切 months 视图并展开；年月写月初、days 视图并展开；完整日期与 `committedRef` 相同则收起，否则 `commit`
- `commit`：写 `selected`/`text`/`visibleMonth`、回 days 视图、关闭、更新 `committedRef`、`onValueChange(date)`
- Enter 应用解析；面板关闭时同样应用解析，故年 / 年月文本会重新展开
- 输入框键盘：先走外部 `onKeyDown`，再经 `usePanelFocus`（utils/use-panel-focus）在面板打开时用 ArrowDown/ArrowUp 聚焦首/尾可聚焦项，最后 Enter 应用解析
- `Picker` 承载输入：`value=text`、`onValueChange=handleTextChange`，`placeholder` 缺省 "Select or type a date"，`aria-invalid` 由内部错误或 `invalid` 合成，`trailing` 缺省日历图标；传 `matchPanelWidth={false}`，日历面板不被字段宽度压缩
- `Calendar`（components/calendar.tsx）接 `value=selected`、受控 `visibleMonth`、`onChange=commit`、受控 `view`；月选择写 `YYYY-MM`、年选择写年份文本并清错误；`firstDayOfWeek` 默认 0，`isDateDisabled` 透传
- 槽位：`classNames.root/input/trailing/popover/panel/calendar`；`styles.input/trailing`；字段类槽为 string，calendar 子槽沿用 Calendar 的 `SlotClassName` 合并规则
- 禁用遵循 `ui/schemes.md` 第 8 条：disabled 同时传 Picker 与 Calendar，commit、文本变更、解析应用、open 与键盘处理均由 JS 阻断；皮肤完整替换字段 root/input 正常类串，Calendar 按日期/月/年/导航/标题禁用态逐项替换，保留布局并显式禁用色与 `cursor-not-allowed`
