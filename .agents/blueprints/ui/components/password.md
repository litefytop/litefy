# Password 骨架（app/ui/components/password.tsx）

- 职责：密码输入，含可见性切换按钮与 Ctrl 快捷键提示。

## 行为 / 状态

- 导出 `Password` 与基础件 `PasswordGroup`（div，`data-invalid`）/ `PasswordRoot`（input）/ `PasswordToggle`（button）
- `PasswordRoot` 按 `visible` 输出 `type=password | text`，未传 `id` 时用 `useId` 补齐；`autoComplete` 缺省 `"current-password"`（外部值优先）
- `visible` 受控 / `defaultVisible` 非受控（默认 false）；按钮点击与 Ctrl 单击共用同一 toggle：非受控才落状态，始终回调 `onVisibleChange(next)`
- Ctrl 手势：`keydown` 仅按 Control 时置标记（其他键清除，左右 Control 都识别），`keyup` 命中标记即切换；外部 `onKeyDown` / `onKeyUp` 先执行，`defaultPrevented` 则跳过；`disabled` 时不切换
- `PasswordToggle`：`type=button`、`tabIndex=-1`（键盘切换走 Ctrl 手势，按钮不进 Tab 序）、`aria-pressed=visible`、`aria-label` 按 visible 取 `"Hide password" | "Show password"`（不挂 aria-hidden，AT 可播报按钮）、自带 `data-field-trailing` 组内端角判定标记；缺省图标 visible 时 `EyeOff`，否则 `Eye`（`classNames.icon`）
- 提示槽：外壳 span（文本 `Ctrl` 的键帽宿主）用 `useId` 取 id，始终拼进 input 的 `aria-describedby`（保留外部值，trim 去空）；内层渲染原生 `<kbd>` 元素（内容 `Ctrl`），键帽外观由皮肤经 `hintKey` 槽接共享 `kbd` 类；移动端按外观层隐藏，不移除描述连线
- 字段 props：`label` / `description` / `validate` / `validateTrigger` 任一传入即组装内部 Field 机制（render-prop，input 上接线 `id` / `name` / `aria-describedby` / `aria-invalid` / `data-invalid`，外部值与 Ctrl 提示 id 并存），控件单独使用即具备完整字段行为；全部未传保持纯密码框 DOM
- `invalid` 同步到组 `data-invalid` 与 input `aria-invalid`；`disabled` 透传 input 与按钮
- 槽位：`classNames: root / toggle / toggleIcon / hint / hintKey`；`styles: root / toggle / hint / hintKey`；classNames 全为 string
- 禁用遵循 `ui/schemes.md` 第 8 条：input 与 toggle 原生 disabled，Ctrl 手势由 JS 阻断；皮肤完整替换 shell/root/toggle 正常类串后用 `mergeSlots` 合并覆盖，保留布局并显式禁用色与 `cursor-not-allowed`
