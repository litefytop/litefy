# useDrag 指针拖拽内核（app/ui/utils/use-drag.ts）

1. 职责：单指针拖拽内核——跟手、增量与三段回调，泛化到任意拖拽件；连续手势件（滑块、抽屉柄）在它之上自管取值。
2. 行为：`handlePointerDown` 在 disabled 时直接返回；否则 `preventDefault` + `setPointerCapture`，document 级 `pointermove` / `pointerup` 按 `pointerId` 过滤，回调用 `DragInfo`（`dx` / `dy` 相对起点 + 绝对 `clientX` / `clientY`）；抬起释放捕获并解绑监听；`pointercancel` 按 pointerup 路径结束拖拽；卸载时兜底解绑已挂的 document 监听。
3. `isDragging` 经 state 发布（供皮肤发 `data-dragging`）；位移量本身由调用方在 `onDragMove` 里自行落位，内核不写样式。
4. 可取消性（operable 15）：拖拽中途按 Esc 或指针滑出的撤回由组件层实现（Slider / SwipeActions 各自持有起始值快照）。
5. 消费方：Drawer 拖拽柄经 `drag` 通道由消费方传入；安装与 API 正本为 `content/docs/utils/use-drag.zh.mdx`。
