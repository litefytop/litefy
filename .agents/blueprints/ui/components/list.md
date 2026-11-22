# List 骨架（app/ui/components/list.tsx）

- 职责：列表渲染骨架：键盘高亮与选择、可选分组头、滚动到底回调。

## 行为 / 状态

- 导出 `List` 与 `Order`；`List` 渲染 `ul`，`Order` 渲染 `ol`，两者都输出 `data-ordered`（有序才为真）；`Order` 不接受 `getGroup` / `renderGroupHeader`，故不分组
- 结构：viewport `div`（`tabIndex=0`，`role="listbox"`，`aria-activedescendant` 指向高亮项 id）> `ul` / `ol`（`role="presentation"`）> `li`（`role="option"` + 稳定 id，`aria-selected` 同步高亮）；`li` 输出 `data-highlighted`，点击即 `onSelect(item, index)`，`onItemMouseMove` 逐行透出 hover
- 禁用行：`isItemDisabled?: (item, index) => boolean`；判定禁用的 `li` 标记 `data-disabled` 并整行 `inert`——指针事件、hover、焦点全不达，不挂 `onClick` / `onMouseMove`；光标禁用样式由皮肤承担
- 高亮双模：`highlightIndex` 非 `undefined` 即受控；变更始终回调 `onHighlightChange`；高亮项用 `scrollIntoView({ block: "nearest", behavior: "instant" })` 保持可见
- 键盘：ArrowDown / ArrowUp 从 `null` 起落到首 / 末项，其余按 `0..length-1` 钳制；Enter / Space 在有高亮项时阻止默认并 `onSelect`；`items` 为空直接返回
- 滚动：仅在传 `onScrollBottom` 时生效，距底 ≤16px 触发
- 分组：`getGroup` 与 `renderGroupHeader` 同时提供才启用，`groupItems` 按分组名首次出现顺序成组；索引仍用扁平下标，组头不参与高亮
- 空态：`items` 为空且 `empty !== undefined` 时渲染单个 `li`（`classNames.empty`）
- key 取 `getKey?.(item, index) ?? index`
- 槽位：`classNames: viewport / item / groupHeader / root / empty / groups`；`styles: item / groupHeader / root / empty / groups`
