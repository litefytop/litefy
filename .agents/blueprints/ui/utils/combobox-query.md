# combobox-query 工具（app/ui/utils/combobox-query.ts）

- 职责：一行 combobox 筛选器的纯数据层。字段与操作符候选生成、枚举字段值候选、按操作符的值校验、区间值切分、值阶段提示文案解析、规则增删、文案契约。不依赖 React 与 DOM。
- 导出上述类型与 `createComboboxState`、`isValueOperator`、`isRangeOperator`、`defaultSeparators`、`defaultComboboxTexts`、`resolveComboboxTexts`、`resolveValueHint`、`suggestFields`、`suggestOperators`、`suggestValues`、`parseRangeValue`、`validateValue`、`appendRule`、`replaceRule`、`removeRule`、`clearRules`、`createRule`、`describeRule`。
- 与 `filter-query.ts` 共享 `FilterRule` / `FilterOperator` 数据契约，互不重复定义。

## 数据

- `FilterComboboxField { name, label, type, aliases?, operators: FilterOperator[], options? }`：字段与允许的操作符由开发者维护
- `FilterComboboxState { stage: "field" | "operator" | "value"; field: string | null; operator: FilterOperator | null; rules: FilterRule[] }`
- `FilterComboboxTexts`：所有用户可见文案集中在此，每项可选、有英文默认值。含输入框占位、候选空态、阶段提示、操作符名称表 `operatorLabels`（默认全文字：`is: "is"`、`isNot: "is not"`、`contains: "contains"`、`notContains: "does not contain"`、`gt: "greater than"`、`gte: "at least"`、`lt: "less than"`、`lte: "at most"`、`between: "between"`、`notBetween: "not between"`、`before: "before"`、`after: "after"`、`isEmpty: "is empty"`、`isNotEmpty: "is not empty"`）、区间校验错误、chip 移除与编辑可访问名、草稿确认钮可访问名（`submitText`）、放弃钮可访问名（`cancelDraftText`，默认 `Cancel draft`）、清空钮可访问名（`clearText`，默认 `Clear all`）、值阶段提示 `dateValueHint`（默认 `Format YYYY-MM-DD`）、键帽解释文字 `separatorLabel`（默认 `Separate with`）与键帽符号 `separatorKeys`（默认 `["␣", ",", "/"]`）、`dateSeparatorKeys`（默认 `["␣", ",", "/", "-"]`），以及带 `{count}` 占位符的 `resultCountText`（默认 `{count} results`）；无硬编码英文残留
- `separators`：区间值切分符数组，默认 `, / 空格 ， ～ ~ –`（不含 `-`——它同时是负号与 ISO 日期连字符，做连接符必然歧义），可由宿主整体替换；属于文案契约可配置部分

## 行为

- `suggestFields(fields, query)` 按名称、标签、别名过滤，空查询列全部字段
- `suggestOperators(field, query, texts)` 只返回该列 `operators` 配置里的项，名称取自 `texts.operatorLabels`，仅此而已——不附带操作符键名，候选行不重复展示
- `suggestValues(field, query)` 只对带 `options` 的枚举字段有产出：按选项 label 与 value 过滤，空查询列全部选项；id 形如 `value:<value>`，label 取选项 label、detail 取选项 value。无 `options` 的字段返回空数组——数字与日期字段不做值候选，保持纯文本输入
- `FilterValueHint = { type: "text"; text } | { type: "keys"; label?; keys: string[] }`：提示条目，text 渲染纯文本、keys 渲染解释文字 + `<kbd>` 键帽序列
- `resolveValueHint(field, operator, texts)`：返回 `FilterValueHint[]`——区间操作符必有键帽分隔符提示（解释文字 `separatorLabel`，默认 `Separate with`；键帽按字段区分：数字 `separatorKeys` 默认 `["␣", ",", "/"]`，日期 `dateSeparatorKeys` 默认 `["␣", ",", "/", "-"]`——日期可用 `-` 分割），日期字段在任何带值操作符下必有格式提示（`dateValueHint`，默认 `Format YYYY-MM-DD`）：日期区间为格式 + 键帽两条、数字区间仅键帽一条、日期单值仅格式一条；其余返回空数组；供骨架值阶段水平渲染 hint 并拼接输入框 `aria-describedby`
- `normalizeDateText(text, separators)`：日期输入按位置自动格式化——ISO 直写（`2026-1-1`）规范化补零，`␣` 等分隔符切出的 3 个数字段（`2003 05 19`，年/月/日按位）组装为 ISO；月 1–12、日 1–31 粗校验。返回规范 ISO 或 null。实现归 `filter-query.ts`（表头轻量日期输入共用），本模块转出口保持 API 稳定；`splitSegments` 同样自 `filter-query` 导入使用
- `parseRangeValue(text, options)`：日期字段优先提取前两个 ISO 日期（`-` 分割因此可用且无歧义）；日期下 6 个数字段（`2003 05 19 2003 06 20`，按位组装两个日期）；其余一律按分隔符切出两个值并去空格（数字无 `-` 分隔，负号安全；负数区间用 `␣` `,` `/` 分隔）。返回 `{ start, end }` 或 null
- `validateValue(operator, text, field, texts, separators)`：无值操作符恒真；单值操作符——日期先经 `normalizeDateText` 自动格式化，数字可解析、枚举命中选项、文本非空；区间操作符走 `parseRangeValue`，日期两端各自规范化，其余校验两侧符合字段类型（失败返回 `texts.invalidRangeText`），且起始不得大于结束（数字按数值、日期按 ISO 字符串比较，失败返回 `texts.invertedRangeText`，默认 `Start must not exceed end`）
- `appendRule` / `replaceRule` / `removeRule` / `clearRules` 全部走拷贝路径，不修改入参
- `describeRule` 用 `texts` 里的操作符名称拼出 chip 文案，不硬编码句子

## 不做

- 括号分组、AND/OR 切换、异步字段搜索、富文本值编辑器、URL 持久化、多日期格式解析
