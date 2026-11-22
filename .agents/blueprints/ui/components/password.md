# Password 骨架（app/ui/components/password.tsx）

- 职责：密码输入，含可见性切换按钮与 Shift 快捷键提示。

## 行为 / 状态

- 导出 `Password` 与基础件 `PasswordGroup`（div，`data-invalid`）/ `PasswordRoot`（input）/ `PasswordToggle`（button）
- `PasswordRoot` 按 `visible` 输出 `type=password | text`，未传 `id` 时用 `useId` 补齐；`autoComplete` 缺省 `"current-password"`（外部值优先）
- `visible` 受控 / `defaultVisible` 非受控（默认 false）；按钮点击与 Shift 单击共用同一 toggle：非受控才落状态，始终回调 `onVisibleChange(next)`
- Shift 手势：`keydown` 仅按 Shift 时置标记（其他键清除），`keyup` 命中标记即切换；外部 `onKeyDown` / `onKeyUp` 先执行，`defaultPrevented` 则跳过；`disabled` 时不切换
- `PasswordToggle`：`type=button`、`tabIndex=-1`（键盘切换走 Shift 手势，按钮不进 Tab 序）、`aria-pressed=visible`、`aria-label` 按 visible 取 `"Hide password" | "Show password"`（不挂 aria-hidden，AT 可播报按钮）、自带 `data-field-trailing` 组内端角判定标记；缺省图标 visible 时 `EyeOff`，否则 `Eye`（`classNames.icon`）
- 提示 span（文本 `⇧ Shift`）用 `useId` 取 id，始终拼进 input 的 `aria-describedby`（保留外部值，trim 去空）
- 字段 props：`label` / `description` / `validate` / `validateTrigger` 任一传入即组装内部 Field 机制（render-prop，input 上接线 `id` / `name` / `aria-describedby` / `aria-invalid` / `data-invalid`，外部值与 Shift 提示 id 并存），控件单独使用即具备完整字段行为；全部未传保持纯密码框 DOM
- `invalid` 同步到组 `data-invalid` 与 input `aria-invalid`；`disabled` 透传 input 与按钮
- 槽位：`classNames: root / toggle / toggleIcon / hint`；`styles: root / toggle / hint`
