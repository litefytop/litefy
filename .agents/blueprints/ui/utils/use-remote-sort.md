# useRemoteSort 远程排序（app/ui/utils/use-remote-sort.ts）

1. 职责：服务端排序的状态机 hook——排序键白名单、方向循环与请求参数产物；零 DOM。
2. 循环制：`toggleSort(key)` 仅收 `sortableKeys` 白名单内的键；同键换向、异键从头——`asc-desc`（默认）走 `asc → desc → null`，`asc-only` 走 `asc → null`；`setSort` / `clearSort` 直设。
3. 回调：`onSortChange` 经 `debounceMs`（默认 0 即时）防抖后发最新排序；排序键变化才重计时。
4. 产物：`queryParams`（`{ sortKey, sortOrder }`，无排序为空对象）与 `queryString`（`sortKey=…&sortOrder=…`，键名 URL 编码）。
5. 消费方：公开 hook，服务端排序的表格消费方自行采用（Table 本体只管本地排序）；安装与 API 正本为 `content/docs/utils/use-remote-sort.zh.mdx`。
