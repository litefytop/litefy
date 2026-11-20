# Progress 骨架（app/ui/components/progress.tsx）

- 职责：线性进度条，把读数同时发布为 ARIA 状态、CSS 变量与可见读数。

## 结构 / 槽位

- 导出 `Progress`（根 + 轨道包裹 + fill + 读数）；props：`current`、`isAbort`、`isComplete`、`paused`、`hideValue`、`classNames: { track, fill, value }`，其余 `div` 属性透传（`role` 被占用）
- 根元素 `role="progressbar"` + `aria-valuenow` / `aria-valuemin=0` / `aria-valuemax=100`；根内三件：轨道包裹 div（fill 宿主）→ fill div → 读数 span（`aria-hidden`，内容 `${value}%`；`hideValue` 时不渲染）
- 根元素写入数值型自定义属性 `--litefy-percent`（与外部 `style` 合并，该键优先），供皮肤做数值表达；骨架不做 JS 补间

## 行为 / 状态

- 读数 `value = isComplete ? 100 : clamp(current, 0, 100)`；fill 宽度由内联 `width: ${value}%` 驱动，随每次渲染直接跳变
- `data-abort` / `data-complete` / `data-paused` 仅在对应布尔为真时输出，否则不出现
