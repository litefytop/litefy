# Drawer 骨架（app/ui/components/drawer.tsx）

- 职责：原生 `<dialog>` 抽屉：四向滑入滑出、可选拖拽手柄；锁滚由全视口滚动壳承载。

## 行为 / 状态

- 导出 `DrawerRoot`、`DrawerStage`（滚动定界层，带 `data-placement`）、`DrawerWrapper`（`data-placement`/`data-size`）、`DrawerDrag`（`data-orientation`）、`DrawerContent`（`data-orientation`）与 `Drawer`；`open`、`onOpenChange` 必传
- `placement` 默认 right，`size` 默认 md；由 placement 推导 `orientation`（left/right 为 horizontal，top/bottom 为 vertical），透传给定界层、拖拽柄与内容
- 开关（`useLayoutEffect`）：位移动画由 WAAPI 承载——开 → `showModal()` 后对 wrapper `animate()` 位移关键帧（起点 `transformMap[placement]` 屏幕外、终点 `translate(0, 0)`，`fill: forwards` 定格）；关键帧自带起点，不依赖预置屏幕外样式，规避 `display:none` 起始态过渡不起步的坑。关 → 反向关键帧，`finished` 与 `getTransitionDurationMs` 兜底定时器先到者触发 `close()`。时长与缓动读面板 computed `transitionDuration`/`transitionTimingFunction`（皮肤 `duration-md ease-frame` 令牌声明，减动效令牌清零即瞬时）；开/关各自先 cancel 在飞动画（`animRef`），`openRef` 校验保持；不再设内联 transform、不再监听 transitionend
- `openRef` 记录最新开关，兜底定时器与 `finished` 关闭都先校验仍未打开
- `onCancel` 一律 `preventDefault`，再 `onOpenChange(false)`、`onCancel(e)`；背景点击（`target === currentTarget`）先 `onOpenChange(false)` 再 `onBackdropClick(e)`
- Tab 经 `trapTabKey` 在 dialog 内循环；锁滚由壳承载（同 Dialog），无 JS 锁滚
- `drag` 传入时渲染拖拽柄（`orientation` + `onPointerDown=drag.handlePointerDown`）；`drag.isDragging` 不参与内部渲染
- `className`/`style` 落 dialog，其余 div props 与 `ref` 落 wrapper；dialog 无 `data-open` 标记
- 槽位：`classNames.stage/wrapper/drag/content`；`styles.stage/wrapper/drag/content`
