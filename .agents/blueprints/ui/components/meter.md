# Meter 骨架（app/ui/components/meter.tsx）

- 职责：只读量具（gauge），连续条形态，接口与原生 `meter` 元素一致（`value` / `min` / `max` / `low` / `high` / `optimum`），分档规则完全对齐原生分档；无交互、无 indeterminate，`role="meter"` 由骨架占用。

## 结构 / 槽位

- 导出 `Meter`（根 + 轨道包裹 + 指示条 + 读数）；props：`value`、`min=0`、`max=100`、`low=20`、`high=60`、`optimum=80`（默认阈值开箱即分档——higher-is-better 语境，消费者可整组覆盖）、`hideValue`、`classNames: { track, fill, value }`，其余 `div` 属性透传（含 `aria-label`）
- 根元素 `role="meter"` + `aria-valuemin` / `aria-valuemax` / `aria-valuenow`（可访问名由消费者经 `aria-label` 提供，文档注明）
- 根内三件：轨道包裹 div（fill 宿主）→ 指示条 div（`aria-hidden`，inline `width: percent%` 由骨架发布——运行期值类表达不了，机制值先例同 `--litefy-percent`）→ 读数 span（`aria-hidden`，内容为原始读数；`hideValue` 时不渲染）

## 行为 / 状态

- `value` 钳入 `[min, max]`；`percent = (value − min) / (max − min) × 100` 钳 0–100；`max ≤ min` 视为退化量程，percent 恒 0
- 分档按 HTML meter 规则（resolveZone 保留）：`low` / `high` / `optimum` 先各自钳入 `[min, max]`，`low > high` 时取 `low = high`；`optimum` 缺省取量程中点
  - `optimum < low`：`value < low` → success；`value > high` → danger；其余 warning
  - `optimum > high`：`value > high` → success；`value < low` → danger；其余 warning
  - 其余（`low ≤ optimum ≤ high`）：`low ≤ value ≤ high` → success；否则 warning
- 根元素输出 `data-zone`（`success` / `warning` / `danger` 三值——原生 meter 恒分档、无 primary 档）；骨架不做 JS 补间，宽度随渲染直接跳变（过渡由皮肤 duration-md 表达）
