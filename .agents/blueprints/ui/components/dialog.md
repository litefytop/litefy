# Dialog 骨架（app/ui/components/dialog.tsx）

- 职责：原生 `<dialog>` 模态容器，含标题、关闭钮与命令式类型提示。

## 行为 / 状态

- 导出 `DialogRoot`（裸 `<dialog>`）、`DialogStage`（滚动定界层 `div`）、`DialogClose`（`button type="button"`）、`DialogContent`（`div`）、`Dialog` 与命令式 `dialog`；`open` 必传，`closeLabel` 默认 "Close" 仅作关闭钮 `aria-label`；`close?: "icon" | "kbd" | null` 决定右上角关闭钮形态——缺省（undefined/null）不渲染关闭钮，`"icon"` 渲染 X 图标钮（`<X data-close-icon/>`），`"kbd"` 渲染文字钮包骨架渲染的 `<kbd data-close-key>ESC</kbd>`，两种形态均带 `data-inline="true"`；ESC 键关闭为内置行为，与 `close` 配置无关
- `open` 变化时 `showModal()` / `close()` 同步原生状态；`data-open` 标记开启。锁滚由壳承载：dialog 元素即全视口透明滚动壳（壳类由皮肤给），背景交互被 top layer 命中测试与原生焦点拦截兜住，无 JS 锁滚
- 结构：`DialogStage`（滚动定界层，制造 ≥1px 可滚区间使 `overscroll-behavior: contain` 生效）包裹 `DialogContent` 卡片；`title != null || close` 存在时渲染 header 行（`classNames.header`），行内可选 `h3` 标题（`title != null`）与关闭钮（`data-inline="true"`），两者皆缺省时不渲染 header、不产生余白；children 直排卡片
- `aria-label` 落 dialog；其余 props 透传 `DialogContent`；根 `className` 优先于 `classNames.root`
- `onCancel` 一律 `preventDefault` 后 `onOpenChange(false)`，原生 `close` 也回调 `onOpenChange(false)`
- 点击 `target === currentTarget` 视为背景点击：先 `onOpenChange(false)` 再 `onBackdropClick(e)`——壳全屏后 `currentTarget` 覆盖整个视口，幕布区命中即此判定
- `open` 时 Tab 经 `trapTabKey`（utils/trap-tab-key）在 dialog 内循环
- 命令式 `dialog.success/error/warning/info`：向 body 追加容器并 `createRoot`，以 `open=true` 挂载；类型图标（CircleCheck / X / TriangleAlert / CircleHelp，带 `data-status`）前置到标题并套 `titleIcon` 槽位；缺省 `close="icon"`（右上角 X 关闭钮），`props.close` 可覆盖；children 包一层 div；关闭后 100ms 卸载并移除容器
- 槽位：`classNames.root/stage/content/close/closeIcon/closeKey/header/title/titleIcon`（`closeIcon` / `closeKey` 落在关闭钮内骨架渲染的 X 图标与 `<kbd>ESC` 键帽上）；`styles.stage/content/close/header/title/titleIcon`
