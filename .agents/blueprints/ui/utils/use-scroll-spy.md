# useScrollSpy 滚动活跃探测（app/ui/utils/use-scroll-spy.ts）

1. 职责：报告给定文档 id 中当前处于视口内的节，返回活跃 id 数组；Toc 高亮的正本。
2. 判定：元素矩形**完全落在视口内**才算活跃（可多值）；无一满足时取顶缘离视口顶最近者——占满整屏的长块仍报出它的起点。
3. 监听：scroll 走 capture 相位挂 window（passive）——scroll 不冒泡但 capture 传到 window，元素滚动容器与 window 滚动都触发，宿主用哪种容器滚动无需被告知；另监听 resize + body `ResizeObserver`，回调内即时计算；目标按 id 每轮现查 DOM——节可挂载、重排、卸载而无需重新注册。
4. 无活跃目标时清空返回；数组逐项比较，值不变保留原引用不触发重渲染。
5. 消费方：Toc；无独立文档页（随 Toc 文档说明）。
