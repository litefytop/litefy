# filter-query 工具（app/ui/utils/filter-query.ts）

- 职责：筛选规则与日期/区间输入的纯数据层。全部为不可变纯函数或类型定义，不依赖 React 与 DOM。表格筛选是外部行为：FilterCombobox 产出 `FilterRule[]`，消费方自行驱动 Table 过滤，本工具不绑定任何表格组件。

## 数据

- `SortParam = { field, direction: "asc" | "desc" }`
- `FilterOperator`：`is` / `isNot` / `contains` / `notContains` / `gt` / `gte` / `lt` / `lte` / `between` / `notBetween` / `before` / `after` / `isEmpty` / `isNotEmpty`
- `FilterRule = { id, field, operator, value }`，`value: string | string[] | null`
- `FilterParam = { field, operator, value }`，规则去掉 `id` 的扁平形态
- `DateRangeValue = { start: string | null; end: string | null }`，ISO `YYYY-MM-DD`

## 行为

- 导出上述类型与 `isDateRangeValid`、`dateRangeToInput`、`splitSegments`、`normalizeDateText`、`parseDateRangeInput`、`toFilterParams`
- `toFilterParams(rules, sort?)` 把 `FilterRule[]` 扁平化为 `{ sort, rules: FilterParam[] }`（`field` / `operator` / `value`，不含任何 SQL 或 DSL 文本）：如何拼进 SQL、DSL 或 ORM 由消费方二次封装，工具不代劳
- `isDateRangeValid(value)`：任一端为空或 `start <= end` 时为 `true`
- `normalizeDateText(text, separators)`：日期输入按位置自动格式化——ISO 直写（`2026-1-1`）规范化补零，分隔符切出的 3 个数字段（`2003 05 19`，年/月/日按位）组装为 ISO；月 1–12、日 1–31 粗校验。返回规范 ISO 或 null
- `parseDateRangeInput(text, separators)`：轻量日期输入解析——整段或 3 段数字组装为单日期（产出 `{ start, end: null }`），6 段数字组装为区间、2 段各自规范化为区间；无效返回 null。`dateRangeToInput(value)` 反向给出可再解析的输入回显（两端空格相连、单端原样）
- `splitSegments(text, separators?)`：按可替换分隔符集合切分并去空，默认分隔符 `,` `/` 空格 `，` `～` `~` `–`
- 全部变更走拷贝路径，不修改入参

## 不做

- 自由文本多分隔符解析、跨列布尔分组、URL 持久化、表格内置筛选
