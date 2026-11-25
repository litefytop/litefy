# DropdownMenu 骨架（app/ui/components/dropdown-menu.tsx）

- 职责：按钮触发 + Menu 浮层的下拉菜单，选择或 Esc 后收起。

## 行为 / 状态

- `trigger` 由 `Popover` 渲染为 `Button`（`aria-haspopup` 缺省 "menu"），`alignX` 默认 center 并直接取 Popover 预设（对齐 start/center/end，开口一律向下）；其余 button props 透传触发钮
- `open` 仅内部状态（初始 false），由触发钮点击、外部点击、Esc 与选择项驱动，不对外暴露受控
- 浮层内 `Menu`：`autoFocus={open}` 由 Menu 负责项聚焦；`items`、`itemClassName`、`onSelect` 直通
- `Menu.onSelect` 先回调外部 `onSelect` 再收起；`Menu.onEscape` 收起
- `className` 落触发钮；`classNames.content` 落 Popover 内容；`classNames.menuRoot/item/label/sub/chevron` 分别映射 Menu 的 `root/item/label/sub/chevron`
- 槽位：`classNames.content/item/label/sub/menuRoot/chevron`（触发钮用 `className`，项可另加 `itemClassName`）
- `itemClassName` 与 `classNames.itemButton` 为 `SlotClassName`（string 或 `(state: SlotState) => string | undefined`），由 Menu 按项 disabled 用 `resolveSlotClassName` 解析；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：disabled 透传 Popover，触发钮原生禁用且浮层强制关闭，JS 拒绝再次打开；皮肤完整替换触发钮与禁用菜单项类串，使用禁用色与 `cursor-not-allowed`
