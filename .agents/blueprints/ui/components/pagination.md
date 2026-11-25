# Pagination 骨架（app/ui/components/pagination.tsx）

- 职责：分页条：首/上/页码/下/末、跳页输入与摘要的原子件及组合件。

## 行为 / 状态

- 原子件：`PaginationRoot`（`nav` + `aria-label="pagination"`）、`PaginationFirst` / `PaginationPrev` / `PaginationNext` / `PaginationLast`（`type=button`，固定 `aria-label` 依次 First page / Previous page / Next page / Last page，复用原子 `Button`——图标 ChevronsLeft / ChevronLeft / ChevronRight / ChevronsRight 走 `icon` 槽发射 `data-pure-icon`，其余 Button props 透传）、`PaginationEllipsis`（`span` + `MoreHorizontal`，图标 `aria-hidden`）、`PaginationSummary`（`span`）
- `PaginationPages`：`page` / `totalPages` 必传、`siblingCount = 1`；页位上限 `2 × siblingCount + 5`，总页数不超则全列，否则列首页 + 窗口 `[max(2, page − s) .. min(totalPages − 1, page + s)]` + 末页，缺口各插一个 ellipsis；首末项恒渲染，故页码列自带跳首 / 跳末
- 页码按钮以 `aria-current="page"` 标当前页，点击回调 `onPageChange(page)`
- 跳页输入：`input type=text` + `inputMode=numeric` + `aria-label="Go to page, 1 to N"`；Enter / 失焦提交并钳制 `1..totalPages`，非法值回退当前页；本地草稿态随 `page` 外部变化重置
- 组合 `Pagination`：单套 DOM，DOM 顺序即朗读与 Tab 顺序 —— 概要（`summary != null` 才渲染；骨架不发 `title`：触屏与键盘通道都不显示 `title`，被裁文本要兜底得靠可见展开或折行，见可操作律第 26 条）→ controls 内依次 First、Prev、Pages、跳页输入、总页数（`/ totalPages`）、Next、Last；两档形态的显隐由皮肤容器查询给类，单行还是两行由皮肤换行裁决，骨架不感知宽度、不裁剪概要，也不复制第二套按钮
- `page ≤ 1` 时 First / Prev 禁用，`page ≥ totalPages` 时 Next / Last 禁用；First / Last 跳 `1` / `totalPages`，Prev / Next 各 ±1；被 `hidden` 的形态分支不进焦点序
- 无键盘与焦点逻辑，全部落在 Button 与跳页输入
- 槽位：`PaginationPages` 为 `classNames.page/ellipsis` 与同名 `styles`；`Pagination` 为 `classNames.controls/nav/boundary/pages/page/ellipsis/summary/pageInput/pageTotal` 与同名 `styles`——`nav` 只给 Prev / Next，`boundary` 只给 First / Last（两者在页码档分道：页码列出现时首末钮让位），`pageInput` 给跳页输入、`pageTotal` 给总页数
- `nav` 与 `boundary` 为 `SlotClassName`，四个导航原子件的 `className` 同为 `SlotClassName`，原子件用 `resolveSlotClassName` 按 `Boolean(disabled)` 解析；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：`disabled` 由骨架发，皮肤按各钮状态完整替换类串，保留纯图标几何并移除 hover/active 类
