# ChipGroup 骨架（app/ui/components/chip-group.tsx）

- 职责：标签组按容器宽度自动截断，溢出项经回调与 more 槽暴露。

## 行为 / 状态

- 双层结构：可见行（`containerRef`，渲染可见 chip 与可选 more）+ 测量层（`shadowRef`，`aria-hidden`，渲染全部 `items`）
- `visibleCount` 初始为 `items.length`；`measure` 取容器 `clientWidth` 与测量层 `columnGap`，贪心累加各 chip `offsetWidth` 算可容纳数；放不下且存在 more 槽时再扣除 more 宽度重算
- `ResizeObserver` 监听容器尺寸触发重测，`items` 变化时同样重测
- `hidden = items.slice(visibleCount)`；`hiddenKey`（各 value 以 `\n` 连接）变化时才触发 `onOverflowChange(hidden)`，值未变不重复回调
- `renderMore(hidden)` 可选；传入才渲染 more 槽（`moreRef` 参与宽度预留），未传则不渲染、测宽也不预留
- Props：`items: { value, label }[]`；槽位 `classNames/styles: row / chip / more / measure`；根元素透传剩余 props、`className` 与 `style`
