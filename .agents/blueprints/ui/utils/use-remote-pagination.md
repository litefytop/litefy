# useRemotePagination 远程分页搜索（app/ui/utils/use-remote-pagination.ts）

1. 职责：远程数据源的搜索 + 追加分页 hook，供 Combobox 远程模式；数据形态 `{ list, total }`。
2. 请求纪律：`search(keyword)` 经 `debounceMs`（默认 300）防抖拉首屏；`loadMore()` 以当前关键字拉下一页追加；`fetchingRef` 单飞——在途请求未结不并发；卸载置失活，迟到的 setLoading 不落。
3. 状态：`data`（累积列表）/ `loading` / `isSearching`（仅首屏检索为真，追加不算）/ `hasMore`（`list.length < total` 派生）/ `reset`（清全部回首屏）。
4. `fetcher` 经 ref 间接持有，消费方传新函数不重置状态。
5. 消费方：Combobox 远程模式（挂载即 `search("")` 拉首屏、List 滚底续拉）；安装与 API 正本为 `content/docs/utils/use-remote-pagination.zh.mdx`。
