# Calendar 骨架（app/ui/components/calendar.tsx）

- 职责：日历：日/月/年三视图网格与键盘导航，选择与翻页经回调交由外部（`visibleMonth` 必传受控）。

## 行为 / 状态

- 依赖 `../utils/date-math`（addDays/addMonths/addYears/dateFromParts/daysInMonth/isSameDate/startOfMonth/toISODate）与 `./icons`（ChevronLeft/ChevronRight）；导出 `CalendarRoot`、`CalendarHeader`、`CalendarNavButton`（direction 选 Chevron，默认 `aria-label="Previous/Next"`，复用原子 `Button`——children 可换图标，缺省时 Chevron 走 `icon` 槽发射 `data-pure-icon`）、`CalendarTitleButton`、`CalendarGrid`/`CalendarGridRow`/`CalendarGridCell`、`CalendarMonthGrid`、`CalendarYearGrid`、`moveGridFocus`、`calendarMonthLabels`（另挂 `Calendar.calendarMonthLabels`）
- `value`/`view` 均双模（`defaultValue`/`defaultView`，view 默认 `days`）；日选择仅接受 `visibleMonth` 内日期（跨月忽略），非受控才落 `value`，始终回调 `onChange`
- 日视图周矩阵按 `firstDayOfWeek`（0=周日 / 1=周一）算首列偏移与行数；roving tabindex 停靠日取 `value`（在当前月内）否则月初，月初被禁用则向后找首个可用日
- 网格键盘：方向键按列数（日 7 / 月年 3）步进，经 `moveGridFocus` 在 `button[data-date|data-month|data-year]` 中跳过禁用找焦点（上限 31/24 步）；日视图越过 `data-outside-month=true` 或无路可走时回调 `onNavigate` → `Calendar.handleNavigate` 先探测 90 天内首个非禁用日再翻月
- 导航按钮翻页步长：days ±1 月、months ±1 年、years ±12 年；翻页前保留当前焦点日（clamp 到目标月天数）写入 `pendingFocusRef`
- 每次渲染后的 effect 消费 `pendingFocusRef`：按 attribute 精确找目标按钮，落空则从该位置向后（再整体反向）取首个未禁用单元聚焦；带方向时自动续翻月重试（≤12 次）
- 视图切换：标题两个 `CalendarTitleButton` 分别切 years / months，`data-active` 标记激活项；月份选中回 days、年份选中回 months；header `ArrowDown` 聚焦网格 `tabindex=0` 单元格
- data 标记：单元格 `data-date`、`data-outside-month`、`aria-selected`；月/年网格 `data-view="month|year"`、行 `data-cols="3"`；表头行 `data-heading="true"`，星期为 `role=columnheader`
- 渲染隔离：`CalendarGridCell` 按日期与选中 / 区间状态 memo，悬停预览与选中更新只重渲状态变化的单元格，不重渲整月网格
- 槽位：`classNames.header/nav/navIcon/title/titleRow/grid/week/weekday/day`（无 styles）
- 区间扩展（供 `DateRangePicker` 复用，不传时行为不变）：`CalendarRange { start: Date | null; end: Date | null }` 经 `CalendarGridProps` / `CalendarGridRowProps` / `CalendarProps` 的 `range?: CalendarRange` 下传；`weekdayLabels` / `monthLabels` 可替换表头与月份文案；`onHoverDateChange?: (date: Date | null) => void` 经 `CalendarGrid` / `Calendar` 下传，悬停非禁用日回调该日、移出网格回调 `null`
- `rangeRoleFor` 按日历日比较（`compareDates`），不用毫秒相等：网格日期由 `dateFromParts` 构造在中午 12 点，外部传入零点的 `Date` 也必须正确识别端点；起止反序时归一化；**无 `single` 态**（用户定 2026-11-23）——只有起点时该格标 `start`，起止同天的一天区间仍只标 `start`
- 区间角色写入单元格 `data-range="start|end|between"`、`data-in-range`，与 `aria-selected`；三种角色与单值选中统一为槽位的 `active` 状态，不再为区间单独生成外观类
- `classNames.nav/title/weekday/day` 接受 `SlotClassName = string | ((state: SlotState) => string | undefined)`，骨架用 `resolveSlotClassName` 按 `{ disabled }` 解析；日期格额外传 `outsideMonth` 与 `active`（单值选中或处于区间内），供皮肤区分非当月与激活外观；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：根输出 `data-disabled` / `aria-disabled`；日期禁用为整组件禁用与 `isDateDisabled` 的或，月/年网格由整组件禁用转为逐格禁用，导航、标题、星期与日期槽同步收到状态；选择、翻页、跨格导航和 header 焦点下移均有 JS 阻断
- 已聚焦的导航、标题或网格单元在渲染后变为禁用时立即失去焦点；禁用单元不进入 Tab 顺序，也无法获得程序焦点或触发选择
- 皮肤按整组件禁用完整替换根、导航、标题、星期与日期类串；日期格按 `disabled` 优先返回独立禁用类串，再按 `active` / `outsideMonth` 选择激活、月外或正常外观；禁用态不挂载正常、激活、月外与 hover 类，仅保留共用布局
