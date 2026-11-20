# Tooltip 骨架（app/ui/components/tooltip.tsx）

- 职责：hover / focus 触发的提示浮层，带显示与隐藏延迟。

## 行为 / 状态

- 导出 `Tooltip`（Context 提供 `popoverId="tooltip-{uid}"`、`anchorName="--tooltip-{uid}"`、`delay=100`）、`TooltipTrigger`、`TooltipContent`、`useTooltipWiring`
- `TooltipTrigger` 渲染 `button type="button"`，带 `popoverTarget`（有 id 时）与 `data-anchor-name`；pointerenter / focus 立即显示，pointerleave / blur 按 delay 延迟隐藏；组件级 `popoverId`/`anchorName`/`delay` 优先于 Context
- 显示前校验元素存在且未处于 `:popover-open`，并清除待执行的隐藏计时；显示走 `showFloatingPanel`
- 隐藏计时按元素存于模块级 `WeakMap`：延迟到期后仅当元素仍连接且处于打开态才 `hidePopover`
- `TooltipContent`：`div` 带传入 `id`、`role="tooltip"`、`popover="manual"`、`data-float-*`（top/center/gap 4）；pointerenter 取消隐藏，pointerleave 重新计时
- 关闭只来自 pointerleave / blur 的延迟隐藏或面板自身 pointerleave；无外部点击与 Esc 关闭，也不写 `aria-describedby`
- `useTooltipWiring` 输出 `show`/`hide`/`cancel` 与 `anchorProps`（`data-anchor-name`），供自定义触发件接线
- 槽位：无（`className` / `style` 在 Trigger 与 Content 上直通）
