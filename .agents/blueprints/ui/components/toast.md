# Toast 骨架（app/ui/components/toast.tsx）

- 职责：全局 toast 队列、自动关闭与退场动画，附 imperative `Toaster` API。

## 行为 / 状态

- 导出基础件 `ToastRoot` / `ToastIcon` / `ToastContent` / `ToastTitle` / `ToastDescription` / `ToastClose`，以及 `Toaster`（`ToastContainer` 与命令方法合并）；`ToastRoot` 固定 `role="status"`（ polite  live region，单条播报不打断）；`ToastClose` 固定 `type="button"`、缺省 `aria-label="Dismiss notification"`，无 children 时渲染 X 图标
- 队列为模块级单例：`addToast` 自增计数生成字符串 id（队列清空后计数复位），组件经 `useSyncExternalStore` 订阅；`Toaster.success/error/warning/info/loading(options)` 强制 type 后入队并返回 id
- 宿主唯一：首个挂载的 `ToastContainer` 用 symbol 认领，其余实例返回 null；无 toast 时也不渲染
- 容器 `<section aria-label="Notifications" popover="manual" tabIndex={0}>`，toast 数量变化后调用 `showPopover()`；`visibleToasts` 默认 3，只取末 N 条；展开态以 `data-expanded` 标记
- 展开交互：mouseenter 展开并清除收起定时器，mouseleave 延迟 100ms 收起，新 toast 入队立即收起；focus / blur 与 enter / leave 同路（键盘聚焦容器同样展开），焦点归还后立即收起
- `ToastItem` 自身状态：`isExiting`；`data-expanded` / `data-exiting` 落在根；图标优先 `icon`，否则按 type 取内置（type 缺省按 success），`ToastIcon` 带 `data-type`
- 自动关闭：`duration` 默认 5000；`type === "loading"`、`duration === Infinity` 或 `isExpanded` 时不计时；暂停时把剩余毫秒写回 ref，恢复后按剩余时间续算，超时按 `auto` 关闭
- 关闭流水线 `handleDismiss(closeType)`：`exitingRef` 幂等；先 `onClose({ type, id })`（auto / manual），退场时长取 `getSchemeDurationMs(el, "--duration-lg")`（utils/scheme-duration），以 Web Animations 把 height / opacity 收到 0、`marginBottom` 抵消父级 rowGap，播完再 `onClose({ type: "complete", id })` 并移出队列
- 退场时长为 0 时跳过动画直接移除；`closable` 时渲染关闭按钮，点击先 `stopPropagation` 再按 manual 关闭
- imperative：`Toaster.dismiss(id?)` 逐条走退场；挂载中的 `ToastItem` 把 manual 关闭注册进 `dismissHandlers`，未挂载时直接回调 manual + complete 并移除
- 队列更新：`updateToast(id, patch)` 合并更新指定项并发布（id 匹配按字符串化比较）；`Toaster.promise(fn, { loading, success, error, classNames })` 始终单条——先入 loading toast（loading 不计时），settle 后经 `updateToast` 把同一条原地转为 success（`success` 可为 `(data) => ReactNode`）或 error（`error` 可为 `(error) => ReactNode`）并换标题；`ToastItem` 自动关闭 effect 以 `type` 为依赖，转态后才起算默认时长倒计时
- 无倒计时进度条：卡内不渲染任何剩余量图形，计时只在骨架内部（剩余毫秒 ref + 暂停续算）
- `ToastTitle` 恒渲染，`ToastDescription` 仅在 description 为真时渲染；单条 toast 的 `style` 不开放，只有槽位 styles
- 槽位：`classNames: root / icon / content / title / description / close`；`styles: icon / content / title / description / close`
