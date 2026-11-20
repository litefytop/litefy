# useVirtualScroll 定高虚拟滚动（app/ui/utils/use-virtual-scroll.ts）

1. 职责：定高行虚拟滚动的计算内核——可视窗口切片与滚动定位，渲染归消费方；零 DOM 写入。
2. 参数：`itemCount` / `itemHeight` 必传，`visibleCount`（容器高 = 行高 × 它，默认 5）、`overscan`（默认 5）、`onScroll` 可选。
3. 切片：`visibleItems: { index, top }[]` 覆盖 `[scrollTop 前后各扩 overscan]` 窗口；`totalHeight = itemCount × itemHeight` 供撑高容器。
4. 定位：`scrollToIndex(index, align: start | center | end)` 钳到可滚范围后直写 `scrollTop` 并同步状态；`scrollToTop` / `scrollToBottom` 直达两端。
5. 消费方：公开 hook，长列表消费方自行装配（不设容器组件）；安装与 API 正本为 `content/docs/utils/use-virtual-scroll.zh.mdx`。
