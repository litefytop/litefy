# Timeline 骨架（app/ui/components/timeline.tsx）

- 职责：纵向事件时间线，逐项渲染标记、时间、标题与描述。

## 行为 / 状态

- 导出 `TimelineRoot` / `TimelineItem` / 组合 `Timeline`；根为 `<ol>`，无方向参数、无选中状态派生
- `Timeline.items[{ marker?, time?, heading, description? }]`；每项 `connector = i < items.length - 1`，末项不画连接线
- 结构：`li > spine(marker + connector) + content(time + heading + description)`；各节点分别落 classNames / styles 槽位
- `TimelineItem.connector` 默认 true；`time` 与 `description` 为 falsy 时不渲染，`heading` 必填
- `marker` 原样渲染，调用方自备图形；连接线元素固定 `aria-hidden`
- 无交互、无键盘、无 ARIA 角色；样式合并：`li` 的 className 为 `className + classNames.item`，style 为 `styles.item` 被外部 `style` 覆盖
- 槽位：`classNames` 与 `styles` 同键：item / spine / marker / connector / content / time / heading / description
