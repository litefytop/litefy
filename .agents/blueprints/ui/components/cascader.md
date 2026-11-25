# Cascader 骨架（app/ui/components/cascader.tsx）

- 职责：面包屑触发 + 多级面板下钻的级联选择器。

## 行为 / 状态

- 数据模型 `CascaderNode`（`value`/`label`/`children`），`tree` 为根级数组；`placeholder` 默认 `"Select your location"`，path 为空时渲染为触发钮
- 状态：`openLevel`（当前展开层级，`null` 全关）、`path`（下钻节点路径）、`selected`（末级选中节点）
- `levels = [tree, ...path 各节点 children]`，每级渲染一个 `PopoverContent`（依赖 ./popover）内嵌 `List`（依赖 ./list）：`getKey` 用 `node.value`、`onSelect` 走 `handleSelect`、`classNames.list` 透传
- `handleSelect`：有 `children` 则 `path` 追加该节点并 `openLevel = path.length + 1`（下一级）；叶子则置 `selected` 并关闭面板
- `handleTriggerClick(i)`：`disabled` 时直接返回；否则 `path` 截断到 `i`、清空 `selected`、toggle `openLevel`（再点同层关闭）；`selected` 节点也可点击（索引 `path.length`）回到该级
- `disabled` 组级禁用：根输出 `data-disabled` / `aria-disabled`，不挂 inert；全部触发钮原生禁用，handleTriggerClick 与 handleSelect 由 JS 阻断，panel 仅 `!disabled && openLevel === level` 时展开
- 禁用遵循 `ui/schemes.md` 第 8 条：皮肤用 `mergeSlots` 完整替换 root/trigger 正常类串，保留面包屑布局并显式禁用色与 `cursor-not-allowed`
- 面包屑：`inline-grid`，`gridTemplateColumns: repeat(cols, minmax(64px, 1fr))`，cols = max(1, path.length + (selected ? 1 : 0))——初始态 1 列全宽，选中后按路径级数动态增列，每列最小 64px；`path` 节点间插 `ChevronRight`（`aria-hidden`）分隔；每个触发钮带 `aria-expanded={openLevel === i}`，选中节点触发钮加 `aria-current="step"`；空态在面包屑根输出 `data-placeholder-shown`
- 面板 `onOpenChange(false)` 时统一 `setOpenLevel(null)`
- 锚点：`React.useId` 清洗为 `--cascader-{uid}-root`，根 div 输出 `data-anchor-name`，各级 `PopoverContent` 以 `anchorName` 关联
- 导出 `CascaderTrigger`：纯透传 `<button>`
- classNames 槽位：root/breadcrumb/trigger/chevron/menu/option/list；styles：root/trigger/menu；其余 props 透传根 div
- 图标通道：`chevronNode` 覆盖全部三处 chevron（面包屑分隔、选中节点前分隔、行展开箭头；缺省 `ChevronRight`，契约见 ui/components.md）
