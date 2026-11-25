# List 骨架（app/ui/components/list.tsx）

- 职责：列表渲染骨架：键盘高亮与选择、可选分组头、滚动到底回调。

## 行为 / 状态

- 导出 `List` 与 `Order`；`List` 渲染 `ul`，`Order` 渲染 `ol`，两者都输出 `data-ordered`（有序才为真）；`Order` 不接受 `getGroup` / `renderGroupHeader`，故不分组
- 结构：viewport `div`（`tabIndex=0`，`role="listbox"`，`aria-activedescendant` 指向高亮项 id）> `ul` / `ol`（`role="presentation"`）> `li`（`role="option"` + 稳定 id，`aria-selected` 同步高亮）；`li` 输出 `data-highlighted`，点击即 `onSelect(item, index)`，`onItemMouseMove` 逐行透出 hover
- 禁用行：`isItemDisabled?: (item, index) => boolean`；判定禁用的 `li` 输出 `aria-disabled` / `data-disabled`，不挂 `onClick` / `onMouseMove`，不挂 inert；键盘移动跳过 disabled 行，Enter/Space 选择前再次检查，`activeDescendant` 永不对应 disabled 行
- 高亮双模：`highlightIndex` 非 `undefined` 即受控；变更始终回调 `onHighlightChange`；高亮项用 `scrollIntoView({ block: "nearest", behavior: "instant" })` 保持可见
- 键盘：ArrowDown / ArrowUp 在过滤 disabled 项后的索引中环绕移动，从 `null` 起落到首 / 末个 enabled 项；Enter / Space 在有 enabled 高亮项时阻止默认并 `onSelect`；`items` 为空直接返回
- 滚动：仅在传 `onScrollBottom` 时生效，距底 ≤16px 触发
- 分组：`getGroup` 与 `renderGroupHeader` 同时提供才启用，`groupItems` 按分组名首次出现顺序成组；索引仍用扁平下标，组头不参与高亮
- 空态：`items` 为空且 `empty !== undefined` 时渲染单个 `li`（`classNames.empty`）
- key 取 `getKey?.(item, index) ?? index`
- 槽位：`classNames: viewport / item / groupHeader / root / empty / groups`；`styles: item / groupHeader / root / empty / groups`
- `classNames.item` 为 `SlotClassName`（string 或 `(state: SlotState) => string | undefined`），用 `resolveSlotClassName` 按 `{ disabled }` 解析；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：皮肤逐项完整替换正常行类串，使用禁用色与 `cursor-not-allowed` 并移除 hover/active 类；不使用 `pointer-events-none`
