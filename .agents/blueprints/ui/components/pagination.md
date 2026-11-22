# Pagination 骨架（app/ui/components/pagination.tsx）

- 职责：分页条：首/上/页码/下/末与摘要的原子件及组合件。

## 行为 / 状态

- 原子件：`PaginationRoot`（`nav` + `aria-label="pagination"`）、`PaginationFirst` / `PaginationPrev` / `PaginationNext` / `PaginationLast`（`type=button`，固定 `aria-label` 依次 First page / Previous page / Next page / Last page，复用原子 `Button`——图标 ChevronsLeft / ChevronLeft / ChevronRight / ChevronsRight 走 `icon` 槽发射 `data-pure-icon`，其余 Button props 透传）、`PaginationEllipsis`（`span` + `MoreHorizontal`，图标 `aria-hidden`）、`PaginationSummary`（`span`）
- `PaginationPages`：`page` / `totalPages` 必传、`siblingCount = 1`；页位上限 `2 × siblingCount + 5`，总页数不超则全列，否则列首页 + 窗口 `[max(2, page − s) .. min(totalPages − 1, page + s)]` + 末页，缺口各插一个 ellipsis
- 页码按钮以 `aria-current="page"` 标当前页，点击回调 `onPageChange(page)`
- 组合 `Pagination`：摘要（`summary != null` 才渲染；为字符串时自动挂 `title` 全文——摘要省略后悬停可读全文）→ controls 内依次 First、Prev、Pages、Next、Last → compact 块（窄形态纵向两行：compactSummary 摘要 + compactRow 内依次 First、Prev、**页码输入**（数字键盘、Enter / 失焦提交并钳制 1..N、非法回退）、`/ totalPages`、Next、Last——与 controls 同源状态与禁用逻辑，显隐由皮肤容器查询裁决）；`page ≤ 1` 时 First / Prev 禁用，`page ≥ totalPages` 时 Next / Last 禁用；First / Last 跳 1 / `totalPages`，Prev / Next 各 ±1
- 无键盘与焦点逻辑，全部落在 Button 与页码输入
- 槽位：`PaginationPages` 为 `classNames.page/ellipsis` 与同名 `styles`；`Pagination` 为 `classNames.controls/nav/pages/page/ellipsis/summary/compact/compactSummary/compactRow/compactInput/compactText` 与同名 `styles`（`nav` 同时用于两形态的八个翻页钮）
