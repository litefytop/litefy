# Form 骨架（app/ui/components/form.tsx）

- 职责：表单容器：收集原生控件值，串联提交、重置与字段校验门禁。

## 行为 / 状态

- 导出 `Form`、`FormSubmit`、`FormContext`、`useFieldValidity`；类型 `FormValues`（`Record<string, string | string[]>`）、`FormRef`
- 提交走原生 `<form onSubmit>` + `React.useTransition`：`preventDefault` 后取 FormData，在 transition 内执行全部已注册字段（Field）的 validate——全过才调用消费者 `onSubmit(values)`（返回 `Promise<boolean>`）；不使用 `action` 属性 / `useActionState`，避免 React 19 在 action 执行前自动重置非受控字段。只有 `onSubmit` 返回 `true` 且 `autoReset`（默认 true）时才调用 `reset()`；任一字段失败、`onSubmit` 返回 false 或抛错（`console.error`）时保留全部输入值。`isPending` 取自 transition，驱动 `FormSubmit` 禁用与加载态
- 字段注册：Context 下发 `registerField(name, api)` / `unregisterField(name)`，`api = { validate(value) → { ok, message, markInvalid }, setError({ text, markInvalid } | null) }`，由 Field 实现并随其生命周期注册；`<form>` 恒发 `noValidate`（原生约束校验会抢在字段门禁前拦截提交）
- 取值：`<form>` 的 FormData，同名多值合并为 `string[]`（`processFormData`）；已注册 setter 的字段以其内部值为准覆盖 FormData（数组逐条 append）
- 注册表按 `name` 存 `{ elements[], setter }`，同名多控件（radio / checkbox）共存；`register` / `unregister` 经 Context 下发
- `ref` 暴露 `setValues` / `reset` / `submit`：`setValues` 合并进内部 `formValues` 并回写控件——setter 优先，否则 checkbox 按集合 `click()`、radio 按值 `click()`、其余经原生 value setter 写入后派发 input + change；`reset` 调 `form.reset()`、setter 传 `null`、清空 formValues 并触发 `onReset`；`submit` 调 `requestSubmit()`
- `FormSubmit`：`Button type="submit"`，`disabled` 与 `loadingConfig.loading` 跟随 `isPending`，`loadingIcon` 换默认图标，其余 props 透传
- 槽位：无（`className` 直传 `<form>`）
