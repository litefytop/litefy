# Tree 骨架（app/ui/components/tree.tsx）

- 职责：树形导航：可展开分支 + 叶子按钮/链接，展开态与激活值外置，键盘巡行。

## 行为 / 状态

- 节点 `TreeNodeConfig`：分支/叶子 `{ label, value?, href?, icon?, disabled?, defaultOpen?, children? }` 或分隔行 `{ type: "separator", label }`（`isTreeSeparator` 判别）；未给 `value` 时以 `${parentKey}#${index}` 兜底
- 原语：`TreeRoot`（`ul role="tree"`）、`TreeTrigger`（`button role="treeitem"` + `aria-expanded` + `data-open`）、`TreeItem`（`a role="treeitem"`）、`TreeLabel`
- 展开态双模：`openKeys` 受控，否则内部态；初值取 `defaultOpenKeys`，未给则由 `defaultOpen` 递归收集；`onOpenChange(keys)` 两种模式都回调
- 收起分支时连带剔除其后代分支键（`descendantFolderKeys`），避免子树残开
- 激活值仅由 `value` + `onValueChange` 外部维护，组件不存内部选中态；非链接叶子按钮点击回调 `onValueChange(value)`，激活行输出 `data-active` 与 `aria-current="page"`
- 链接叶子传 `href` 渲染 `a`；`navigate(href, event)` 仅接管无修饰键的左键点击（`preventDefault` 后调用）
- 键盘在根 `ul` 上委托，只对 `role="treeitem"` 生效；`visibleRows` 取根内未落在 `section[data-open="false"]` 的行：ArrowDown / ArrowUp 相邻、Home / End 首末
- ArrowRight：未开分支则展开，已开则聚焦首个子行；ArrowLeft：已开分支则收起，否则聚焦父分支 trigger
- 分支折叠用 `section data-open` + `grid-template-rows: 1fr / 0fr` + 内层 `overflow: hidden; minHeight: 0`；子层 `ul role="group"`
- `depth` 以 `--litefy-depth` 变量下发（分隔行、trigger、item、branch 各输出）；`aria-level = depth + 1`；`icon` 可传函数按 `open` 渲染，分支固定尾部 `ChevronRight`（`data-open`）
- 槽位：`classNames: trigger / item / label / group / node / labelText / icon / branch / clip`；`styles: trigger / item / label`
