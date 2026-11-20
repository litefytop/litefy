# InputOtp 骨架（app/ui/components/input-otp.tsx）

- 职责：定长验证码输入，按槽渲染单字符 input 并自动进位、回退与整段粘贴。

## 行为 / 状态

- 导出 `InputOtp` 与基础件 `InputOtpGroup`（div）/ `InputOtpSlot`（input）；`length` 默认 6，第 i 槽取 `value[i]`
- 值：`value` 受控 / `defaultValue` 非受控（默认 ""），每次变更以完整字符串回调 `onValueChange`；`mask` 让槽 `type=password`，`inputMode` 恒为 numeric
- 输入取事件值末位字符写入当前槽并前进一槽；`focusInput` 把目标索引钳制在 0–length-1，聚焦后全选
- `Backspace` 仅在当前槽为空且非首槽时拦截，清空前一槽并回退；其余退格走原生
- `ArrowLeft` / `ArrowRight` 拦截并前后移动；`paste` 一律 `preventDefault`，trim 后从当前槽顺序填充（越界丢弃），焦点移到 `index + 文本长度`
- 组容器 `pointerdown` 落在非 input 时 `preventDefault`，聚焦首个空槽，全满则聚焦末槽
- 无障碍：传入 `aria-label` 时每槽为 `${aria-label} ${index+1}`；首槽 `autoComplete=one-time-code`，其余 off；`invalid` 输出各槽 `aria-invalid` 与组 `data-invalid`，`disabled` 透传各槽
- 传 `name` 时额外渲染隐藏 input 承载完整值
- 槽位：`classNames.slot`、`styles.slot`；组容器仅 `className` / `style`
