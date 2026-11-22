# Input 骨架（app/ui/components/input.tsx）

- 职责：单行文本输入外壳，leading / trailing 装饰槽包住原生 input。

## 行为 / 状态

- 导出 `Input` 与基础件 `InputLeading`（span）/ `InputRoot`（input）/ `InputTrailing`（span，自带 `data-field-trailing` 组内端角判定标记），基础件仅透传 props 与 `className`
- 结构：根 div 拼接 `classNames.group` + `className`，`style` 落根 div；input 只消费 `classNames.root` / `styles.root`
- `leading` / `trailing` 为真值才渲染对应 span（`classNames.leading|trailing`、`styles.leading|trailing`）
- `type` 限定 `text | email | url | tel | search`；`InputRoot` 未传 `id` 时用 `useId` 补齐；`Input` 按 `type` 缺省 `autoComplete`（email→`email`、tel→`tel`、url→`url`、search→`search`，text 不设），外部 `autoComplete` 优先
- `invalid` 输出 input 的 `aria-invalid` 与根 div 的 `data-invalid`；`data-border` prop 落到根 div 的 `data-border`
- 字段 props：`label` / `description` / `validate` / `validateTrigger` 任一传入即组装内部 Field 机制（render-prop，input 上接线 `id` / `name` / `aria-describedby` / `aria-invalid` / `data-invalid`），控件单独使用即具备完整字段行为；全部未传保持纯输入框 DOM（不加壳）
- 无内部状态：装饰与样式相关 props 之外的全部 props（含 `data-*`）与 `ref` 透传给 input
- 槽位：`classNames: group / leading / trailing / root`；`styles: leading / trailing / root`
