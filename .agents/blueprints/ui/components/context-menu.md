# ContextMenu 骨架（app/ui/components/context-menu.tsx）

- 职责：全局上下文菜单单例，命令式指定坐标与菜单项唤起；桌面右键、触屏长按、键盘 Shift+F10 三条触发通路。
- 长按触发属骨架层能力（纯行为、无外观），实现在本文件并经 `skins/context-menu.tsx` 转出。

## 行为 / 状态

- 模块级单例 store：`current: { options, open } | null` + 订阅者集合；`ContextMenuHost` 经 `useSyncExternalStore` 订阅，SSR 快照为 null
- 命令式 API：`ContextMenu.open({ x, y, items, onSelect?, classNames?, styles? })` 设置状态并广播；`ContextMenu.dismiss()` 置 `open=false`（未开启时不动）
- 触发 helper：`useContextMenuTrigger(options)`——`options` 复用 `ContextMenuOpenOptions` 去掉 `x`/`y`，返回可展开到触发元素上的 props（事件 handlers + style）
  - 桌面右键：`onContextMenu` preventDefault 后以指针坐标 `ContextMenu.open`
  - 触屏长按：仅 `pointerType === "touch"` 计时，按住 500ms 后以触点坐标 `ContextMenu.open`，支持的设备 `navigator.vibrate(10)` 给触觉反馈；位移超 10px（滚动意图）、`pointercancel` / `pointerup` 取消；按 `pointerId` 只跟单指；长按定时器卸载时清理
  - 键盘等价：Shift+F10 以触发元素中心为锚点打开（a11y 车道：指针手势必须有键盘等价物）
  - 长按打开后吞掉同指针的后续 `click`，菜单关闭时不落一次点击
  - 返回的 `style` 含 `WebkitTouchCallout: "none"` 与 `userSelect: "none"`——压 iOS 长按系统 callout 与选字；代价是触发区内文本不可长按选择，文档注明
- `ContextMenuHost` 无状态时渲染 null；用 `PopoverContent` 以 `anchorPoint: { x, y }` 定位，内嵌 `Menu`（components/menu.tsx）渲染 `items`
- 关闭路径三处汇合：PopoverContent `onOpenChange(false)`、Menu `onSelect` 后、Menu `onEscape` 后均调用 `ContextMenu.dismiss()`
- 面板自身 `onContextMenu` 阻止默认，避免菜单上再弹右键
- `Menu.autoFocus` 跟随 `menu.open`
- 槽位：`ContextMenuClassNames` 扩展 `MenuClassNames` 增加 `content`；Host 级 `classNames.content` 与 open 时传入的 `options.classNames.content` 合并，`options.styles.content` 作面板内联样式
