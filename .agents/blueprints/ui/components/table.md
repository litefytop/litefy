# Table 骨架（app/ui/components/table.tsx）

- 职责：数据表格：按列配置渲染、点击表头排序、可选行选择（`selectable` 开关：行复选框、页内全选三态、批量操作行）、空态与窄屏堆叠数据发布。筛选不在骨架能力内——属业务层，用 `headExtra` 搭配 Input / Select / DatePicker 等原件自建筛选行，数据过滤在业务侧完成。

## 结构 / 槽位

- 导出 `Table` 与原语 `TableRoot`（根 div）/ `TableHead` / `TableBody`（上下两个 table 容器的外层）/ `TableBase`（`tableLayout: fixed`）；类型 `TableColumn`、`SortState`、`SortDirection`
- 列 `TableColumn`：`key` 兼作默认表头与取值字段，`header`、`render(row)`（缺省 `String(row[key] ?? "")`）、`sortable`、`compare`、`align`（默认 `left`）、`className`、`span`（列宽权重，默认 1）
- 双层结构：表头与表体各一个 `table`，各自带内容相同的 `colgroup`；`caption` prop（`React.ReactNode`）为真时表头 `table` 在 `colgroup` 前渲染 `<caption className={classNames?.caption}>`（表体不重复），给表格一个可访问名称来源；每列 `width: calc(span * 100% / totalSpan)` 内联（行为几何），列最小宽度由 `classNames.col` 落在 `col` 上；列宽按 `selectable` 后的全列集合计算
- `classNames` / `styles` 槽位：`table / col / caption / head / headRow / headCell / headLabel / sortIcon / body / row / cell / empty` + 选择态追加 `bulkRow / bulkBar / bulkCount / bulkLabel / bulkActions / bulkClear` 与 `checkbox`（`CheckboxClassNames` 对象槽，同时下发给表头与行复选框）；`styles: wrapper / table`
- 表体单元格带 `data-label`（取该列字符串 `header`；非字符串表头不发）——消费方自建窄屏形态时的列名数据来源，皮肤自身不换形
- 根 div 输出 `--litefy-cols`（列数）并合并 `styles.wrapper`；`styles.table` 给两个 `table`
- `headExtra`：thead 尾渲染的额外行节点（消费方自带 `<tr>`）；`selectable` 且有选中时骨架在 `headExtra` 之后追加批量行（`<tr data-bulk>`，单格 `colSpan` 跨全列：计数、`selectedLabel`（默认 "selected"）、`bulkActions` 节点、清除钮（`clearLabel` 默认 "Clear"，点击清空全部选中）；未选中时不渲染）

## 行为 / 状态

- 默认 `initialSortDirection=asc`；排序双模：`sort` 为 `undefined` 时非受控（内部态），`null` 表示无排序；点击表头按 `初始方向 → 反向 → null` 循环，非受控才落内部态，始终回调 `onSortChange(next)`
- 排序执行：取该列 `compare`，缺省按字段值 `>` 比较，`desc` 交换入参；排序列不在 `columns` 中或缺省时不排序；`data` 不被原地修改
- 表头 `th scope="col"`：有排序时输出 `aria-sort=ascending|descending`，另带 `data-align` / `data-sortable` / `data-sorted`；图标 `ArrowUpDown` / `ArrowUp` / `ArrowDown` 带 `aria-hidden` 与 `data-active`
- 行 key：`selectable` 且传 `rowKey` 时行 React key 取 `rowKey`，否则 `getKey?.(row, i) ?? i`
- 空态：`rows` 为空时渲染单行 `td colSpan={全列数}`，内容 `empty ?? (loading ? "Loading..." : "No data")`
- 行选择（`selectable: true` 时启用，默认 `false` 零感知）：
  - 列首注入选择列（内部键 `__selection`，`span` 1，不参与排序；复选框选中态不触发表头点击）
  - `rowKey(row)` 提供选择键；缺省回退 `String(getKey?.(row, i) ?? i)`
  - 选中为 `string[]`（选择键集合）：`selected` 受控，或 `defaultSelected`（默认 `[]`）非受控；`onSelectionChange(next)` 两种模式都回调
  - 页内统计：`data` 全键中命中数 `selectedOnPage`；`allSelected` 要求本页非空且全中，`someSelected` 为部分命中
  - 表头 `Checkbox`：`checked = allSelected || someSelected`，部分命中以 `indicator={<Minus />}` 三态；`aria-label` 取 `selectAllLabel`（默认 "Select all on this page"）
  - 行 `Checkbox`：`checked` 取集合命中，`aria-label` 取 `rowLabel`（默认 "Select this row"）
  - 全选切换：已全选则从值中剔除本页键（跨页选择保留），否则追加本页未选键；单行切换命中即剔除、否则追加
  - `loading` 只影响空态文案，不接管选择
- 禁用与键盘：骨架不绑定任何按键，排序只绑 `<th>` onClick（`th` 不可聚焦）；可聚焦元素仅消费方经 `render` / `header` / `bulkActions` 渲染者
