# Toggle 骨架（app/ui/components/toggle.tsx）

- 职责：可切换按钮（单件）。

## 行为 / 状态

- 导出 `Toggle`；无基础子件拆分
- `Toggle`：`button[type=button]`，`aria-pressed=checked`；传 `checked` 受控，否则内部状态（`defaultChecked` 默认 false）
- 点击先透传 `onClick`，`defaultPrevented` 或 `disabled` 时不切换；非受控才落状态，始终回调 `onCheckedChange(next)`
- `value` 原生透传，组内由 ToggleGroup 用于标识条目
- 无 roving tabindex，Tab 顺序即按钮顺序；不声明 role
- 槽位：无
