# Menu 骨架（app/ui/components/menu.tsx）

- 职责：菜单列表骨架：分组、禁用、子菜单的键盘导航与浮层，开关由外层锚点控制。

## 行为 / 状态

- 导出 `MenuRoot`（`ul role="menu"`）、`MenuItem`（`li role="none"`）、`MenuLabel`（`li role="group"`）、`MenuSubContent`（`div popover="manual"`，right/start/gap 0）与组合 `Menu`；`MenuConfig` 为分组 `{ group, items }` 或单项 `{ label, disabled?, className?, onClick?, children? }`
- `items` 拍平为 `entries`（entryId `${uid}-{idx}-{childIdx}`，单项固定 `-0`），组标题不进条目；`activeEntry` 记录当前项
- `autoFocus` 时在 rAF 内聚焦首个非禁用项并 `scrollIntoView({ block: "nearest" })`；焦点移动经 `li[data-entry] > button` 查找
- 项渲染：`li` 带 `data-entry`、`data-anchor-name="--menu-sub-{entryId}"`；内部 `button role="menuitem"` 带 `disabled`、`data-has-sub`、`data-active`，有 children 时补 `aria-haspopup="menu"` 与 `aria-hidden` 的 `ChevronRight` 右箭头图标（`classNames.chevron` 槽位供皮肤定档）
- 项键盘：ArrowDown/ArrowUp 在非禁用项间循环；ArrowRight 仅在传入 `onArrowRight` 时触发（根列表用它开子菜单并聚焦）；ArrowLeft 仅在传入 `onArrowLeft` 时触发；Escape 拦截并 `onEscape`；无 Home/End 处理
- 鼠标：移入项同步 `activeEntry` 并回调 `onItemMouseEnter`，移出回调 `onItemMouseLeave`；叶子点击先 `mi.onClick` 再 `onSelect`，有 children 的项点击不提交
- 子菜单：悬停有 children 的项打开（写 `hoverAnchor`/`hoverSubItem`/`subAutoFocus`），悬停无 children 项或移出列表 150ms 后关闭；子面板 pointerenter 清计时，pointerleave 重新计时
- 子菜单惰性：仅 `hoverSubItem` 存在且 `hoverAnchor` 非空时渲染 `MenuSubContent`，effect 内 `showFloatingPanel` / `hidePopover` 同步，`useFloatingPosition` 负责锚定；文档 mousedown 落在根列表与子面板外时关闭
- 子菜单键盘：ArrowRight 打开时 `subAutoFocus=true` 聚焦首项；ArrowLeft 关闭子面板并按父 entry 把焦点还给根项；Escape 关闭子面板再 `onEscape`
- `onSelect` 经包装先 `closeSub` 再回调；`classNames.root` 与 `className` 合并，`itemButton` 与 `itemClassName`、`mi.className` 合并
- `itemClassName` 与 `classNames.itemButton` 为 `SlotClassName`（string 或 `(state: SlotState) => string | undefined`），按当前项 disabled 用 `resolveSlotClassName` 解析；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：项按钮原生 disabled，鼠标进入、点击与打开子菜单由 JS 守卫阻断，方向键只遍历 enabled entries；皮肤逐项完整替换正常按钮类串，使用禁用色与 `cursor-not-allowed` 并移除 hover/active 类
- 槽位：`classNames.root/item/label/itemButton/sub/chevron`；`styles.item/label/sub`（根 `className`/`style` 直通）
