# date-math 纯日期函数（app/ui/utils/date-math.ts）

1. 职责：日历族共享的纯日期运算，零依赖、零 DOM。
2. 构造纪律：所有日期经 `dateFromParts` 构造在**正午 12 点**——避开时区偏移与 DST 边界把日期滚到前后一天（Calendar `rangeRoleFor` 按日比较不按毫秒，正因如此外部传零点 `Date` 也能正确识别端点）。
3. 导出：`currentDate` / `startOfMonth` / `daysInMonth` / `addDays` / `addMonths`（月末钳制，1/31 加一月得 2/28）/ `addYears` / `isSameDate` / `compareDates`（年月日逐级比较，返回 -1/0/1）/ `toISODate` / `parseISODate`（严格 `YYYY-MM-DD`，月日范围校验失败回 null）/ `formatDate`（`Intl.DateTimeFormat`，缺省 `dateStyle: "medium"`）。
4. 消费方：Calendar、DatePicker、DateRangePicker；无独立文档页（用法随组件文档给出）。
