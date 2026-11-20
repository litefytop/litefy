# Table 骨架（app/ui/components/table.tsx）

- 职责：数据表格：按列配置渲染、点击表头排序、可选行选择（`selectable` 开关：行复选框、页内全选三态）、空态与窄屏堆叠数据发布。选中数回显与批量操作不归表格——表格不出第二行，消费方经 Pagination 的 `summary` 槽承载。筛选不在骨架能力内——属业务层，用 `headExtra` 搭配 Input / Select / DatePicker 等原件自建筛选行，数据过滤在业务侧完成。

## 结构 / 槽位

- 导出 `Table` 与原语 `TableRoot`（根 div）/ `TableHead` / `TableBody`（上下两个 table 容器的外层）/ `TableBase`（`tableLayout: fixed`）；类型 `TableColumn`、`SortState`、`SortDirection`
- 列 `TableColumn`：`key` 兼作默认表头与取值字段，`header`、`render(row)`（缺省 `String(row[key] ?? "")`）、`sortable`、`compare`、`align`（默认 `left`）、`className`、`span`（列宽权重，默认 1）、`collapse`（该列单元格折叠为单行省略 + `title` 提示，点击展开不回收，见行为节）
- 双层结构：表头与表体各一个 `table`，各自带内容相同的 `colgroup`；滚动契约：条根只滚 x（y 轴不滚）、表体只滚 y（x 轴裁切，不出横向滚动条）——虚拟滚动的滚动监听挂表体，表头不滚、随条根 x 向滚动；不预留任何滚动条沟槽（禁 `scrollbar-gutter`，未滚动的容器右侧不留空隙），滚动条外观一律由方案全局层统一（`schemes.md` 第 17 条），骨架与皮肤不得设置任何 scrollbar 样式；表头与表体容器各内联 `min-width`（列宽下限总和：未选择时 `calc(MIN_COLUMN_WIDTH × 全列数)`，选择时 `calc(44px + MIN_COLUMN_WIDTH × 数据列数)`）——容器窄于下限总和时头体两容器撑到同宽，超出部分由条根横向滚动兜底，头体始终同宽同移；`caption` prop（`React.ReactNode`）为真时表头 `table` 在 `colgroup` 前渲染 `<caption className={classNames?.caption}>`（表体不重复），给表格一个可访问名称来源；每列宽度内联（行为几何，下限常量 `MIN_COLUMN_WIDTH = 64`）：未选择时 `width: max(64px, calc(span * 100% / totalSpan))`——列宽按权重占比落定、每列不低于 64px，相邻列永不贴紧；`selectable` 时选择列固定 `width: 44px`（与 44px 控件档行高一致的方形列，复选框按钮占满整列，不按 span 权重分宽、不受 64px 下限约束），数据列 `width: max(64px, calc((100% - 44px) * span / 数据列span总和))`——数据列按权重分剩余宽度；下限总和超出容器时表格超宽走条根横向滚动兜底
- `classNames` / `styles` 槽位：`table / col / caption / head / headRow / headCell / headLabel / sortIcon / body / row / cell / empty` + 拖动态追加 `dragHandle` + 选择态追加 `checkbox`（`CheckboxClassNames` 对象槽，同时下发给表头与行复选框）+ 折叠列追加 `cellCollapse`（折叠单元格类名）；`styles: wrapper / table`
- 表体单元格带 `data-label`（取该列字符串 `header`；非字符串表头不发）——消费方自建窄屏形态时的列名数据来源，皮肤自身不换形
- 根 div 合并 `styles.wrapper`；`styles.table` 给两个 `table`
- `headExtra`：thead 尾渲染的额外行节点（消费方自带 `<tr>`）。批量行已废除——表格不出第二行，选中数回显与批量清空由消费方在表格下方经 Pagination 的 `summary` 槽承载（如「N selected」+ 清除按钮）

## 行为 / 状态

- 默认 `initialSortDirection=asc`；排序双模：`sort` 为 `undefined` 时非受控（内部态），`null` 表示无排序；点击表头按 `初始方向 → 反向 → null` 循环，非受控才落内部态，始终回调 `onSortChange(next)`
- 排序执行：取该列 `compare`，缺省按字段值 `>` 比较，`desc` 交换入参；排序列不在 `columns` 中或缺省时不排序；`data` 不被原地修改
- 表头 `th scope="col"`：有排序时输出 `aria-sort=ascending|descending`，另带 `data-align` / `data-sortable` / `data-sorted`；图标 `ArrowUpDown` / `ArrowUp` / `ArrowDown` 带 `aria-hidden` 与 `data-active`
- 行 key：`selectable` 且传 `rowKey` 时行 React key 取 `rowKey`，否则 `getKey?.(row, i) ?? i`
- 空态：`rows` 为空时渲染单行 `td colSpan={全列数}`，内容 `empty ?? (loading ? "Loading..." : "No data")`
- 行选择（`selectable: true` 时启用，默认 `false` 零感知）：
  - 列首注入选择列（内部键 `__selection`，不参与排序、不参与 span 权重分宽，固定 44px 方形列；复选框选中态不触发表头点击）
  - `rowKey(row)` 提供选择键；缺省回退 `String(getKey?.(row, i) ?? i)`
  - 选中为 `string[]`（选择键集合）：`selected` 受控，或 `defaultSelected`（默认 `[]`）非受控；`onSelectionChange(next)` 两种模式都回调
  - 页内统计：`data` 全键中命中数 `selectedOnPage`；`allSelected` 要求本页非空且全中，`someSelected` 为部分命中
  - 表头 `Checkbox`：`checked = allSelected || someSelected`，部分命中以 `indicator={<Minus />}` 三态；`aria-label` 取 `selectAllLabel`（默认 "Select all on this page"）
  - 行 `Checkbox`：`checked` 取集合命中，`aria-label` 取 `rowLabel`（默认 "Select this row"）
  - 全选切换：已全选则从值中剔除本页键（跨页选择保留），否则追加本页未选键；单行切换命中即剔除、否则追加
  - `loading` 只影响空态文案，不接管选择
- 禁用与键盘：排序只绑 `<th>` onClick（`th` 不可聚焦）；列拖动启用时键盘通路由拖动手柄承担（见下）；可聚焦元素为行选择复选框、拖动手柄与消费方经 `render` / `header` 渲染者
- 行点击选中（`selectable: true` 时）：行 `<tr>` onClick 触发 `toggleRow`，复选框仍是键盘与指针的显式通路；两类点击不转选中——事件目标在选择列单元格内（避免与复选框双触发），或目标处于交互元素（`button` / `a` / `input` / `select` / `textarea` / `label` / `[role="button"]`）及 `[data-no-row-select]` 标记者内；行带 `data-selectable` 供皮肤定指针样式
- 斑马纹：`zebra?: boolean`（默认 `false`）；开启后奇数数据行（排序后索引为奇数）`<tr>` 带 `data-zebra="odd"`，按数据索引而非 DOM 位置标记——占位行、空态行不参与，虚拟滚动切片不错位；样式归皮肤
- 虚拟滚动：`virtual?: boolean`（默认 `false`）+ `rowHeight?: number`（默认 45 = 44px 控件档行高 + 1px 行分隔，须与皮肤实际行距一致）；基于 `useVirtualScroll`（utils）只渲染可见区间 + 上下各 8 行 overscan；滚动监听与容器 ref 挂在体容器（皮肤滚动容器）上，容器高度仍归皮肤（max-h 档），hook 的定高 style 不使用；`tbody` 两端渲染 `aria-hidden` 占位行（单格 `colSpan`、内联 height，不带行类与边框）；先排序、后切片——排序、选择、斑马纹不受影响；空态走空态分支不切片；约束：行高必须恒定，内容换行会错位（fixed 布局 + 长文本需业务自行控制单行）
- 列拖动：`columnDrag?: boolean`（默认 `false`）、`columnOrder?: string[]`（受控）/ `defaultColumnOrder?: string[]`（默认 `[]` 非受控）/ `onColumnsChange?(keys: string[])`、`dragHandleLabel?: string`（默认 "Reorder column"）：
  - 顺序状态存业务列 key 数组，未知 key 按原相对顺序补尾；选择列恒居首位且不可拖、不入 order
  - 指针通路：可拖列 `<th draggable>` 走 HTML5 DnD，骨架内管 dragStart / dragOver / drop，拖动经过列发 `data-drag-over`，落下即提交新序并回调
  - 键盘通路：`headLabel` 内渲染拖动手柄 `<button type="button" aria-label={dragHandleLabel} aria-pressed={拾起}>`（`GripVertical` 图标，点击 stopPropagation 不触发排序）；Enter / Space 拾起（`data-grabbed`），← / → 与相邻列交换顺序（每步回调），Enter 落下提交，Escape 取消并还原拾起前顺序
  - 新槽位：`classNames.dragHandle`（手柄按钮）
- 表头文字：`column.header ?? column.key` 包进 `<span className={classNames?.headLabel}>` 直出，不截断不省略；窄列长表头换行、行高随之生长，属预期行为，需业务用列权重或短文案自控；排序图标 `shrink-0` 永不越过头格内距
- 单元格折叠：`column.collapse: true` 的数据列（选择列不参与）单元格内容包进内部 `CollapseCell`（`<button type="button">`，`classNames.cellCollapse` 槽）——折叠态单行 CSS 省略（纯 CSS 起始，首渲染零抖动）；`title` 原生提示仅在截断态出现（骨架测 `scrollWidth > clientWidth` 判定，只控 title 显隐不写回尺寸，`ResizeObserver` 随容器宽与内容重测）；点击完全展开（`data-expanded`，多行完整展示）且不回收、展开后无提示；点击不触发行选择（button 已在行选择排除表）；展开改变行高，与 `virtual` 定高约束互斥，虚拟表格不应对可展开行开启 `collapse`
