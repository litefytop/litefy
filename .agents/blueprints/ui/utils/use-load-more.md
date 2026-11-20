# useLoadMore 增量加载（app/ui/utils/use-load-more.ts）

1. 职责：滚动触发的增量加载 hook——本地可见数推进，数据获取由 `onLoadMore` 回调外的调用方自理。
2. 状态：`visibleCount` 从 `initialCount`（缺省同 `pageSize`，默认 12）起，`loadMore` 推进 `pageSize` 并钳到 `total` 封顶，推进后才回调 `onLoadMore(next)`；`hasMore = visibleCount < total` 派生。
3. 触发：`sentinelRef` 挂哨兵元素，`IntersectionObserver` 命中即 `loadMore`；`rootMargin` 默认 400px 提前量，`root` 可指滚动容器（传 ref 且当前为 null 时不启用观察）；`enabled` 总开关，到顶自动停观察。
4. `total` 收缩时推进函数自钳，不额外回退已渲染内容。
5. 消费方：ExampleWall（示例墙懒挂载）；安装与 API 正本为 `content/docs/utils/use-load-more.zh.mdx`。
