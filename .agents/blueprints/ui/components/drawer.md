# Drawer 骨架（app/ui/components/drawer.tsx）

- 职责：原生 `<dialog>` 抽屉：四向滑入滑出、可选拖拽手柄；锁滚由全视口滚动壳承载。

## 行为 / 状态

- 导出 `DrawerRoot`、`DrawerStage`（滚动定界层，带 `data-placement`）、`DrawerWrapper`（`data-placement`/`data-size`）、`DrawerDrag`（`data-orientation`）、`DrawerContent`（`data-orientation`）与 `Drawer`；`open`、`onOpenChange` 必传
- `placement` 默认 right，`size` 默认 md；由 placement 推导 `orientation`（left/right 为 horizontal，top/bottom 为 vertical），透传给定界层、拖拽柄与内容
- 开关（`useLayoutEffect`）：开 → 未开则 `showModal()` 并把 wrapper `transform` 置 `translate(0, 0)`；关 → wrapper 置 `translateX/Y(±100%)`（按 placement），并按 `getTransitionDurationMs(wrapper) || 1` 延时 `close()`，同时监听 `transitionend` 的 transform 再关
- `openRef` 记录最新开关，延时与 transitionend 关闭都先校验仍未打开
- `onCancel` 一律 `preventDefault`，再 `onOpenChange(false)`、`onCancel(e)`；背景点击（`target === currentTarget`）先 `onOpenChange(false)` 再 `onBackdropClick(e)`
- Tab 经 `trapTabKey` 在 dialog 内循环；锁滚由壳承载（同 Dialog），无 JS 锁滚
- `drag` 传入时渲染拖拽柄（`orientation` + `onPointerDown=drag.handlePointerDown`）；`drag.isDragging` 不参与内部渲染
- `className`/`style` 落 dialog，其余 div props 与 `ref` 落 wrapper；dialog 无 `data-open` 标记
- 槽位：`classNames.stage/wrapper/drag/content`；`styles.stage/wrapper/drag/content`
