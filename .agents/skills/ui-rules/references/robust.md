# 健壮与语义（WCAG 4.1 / ARIA 使用边界）

1. 原生优先：`<button>`、`<input>`、`<dialog>`（`dialog.tsx` 走 `showModal`）、`popover`（`menu`、`picker`、`select`、`popover`、`toast`、`tooltip`）能用原生就用，`role` 只在换不出原生标签时补
2. `role` 不许覆盖原生语义：给 `<button>` 写 `role="button"`、给 `<a href>` 写 `role="link"` 都是负收益，删掉
3. 名 / 角色 / 值三件齐（4.1.2）：自造控件必须报出三者——滑块给 `aria-valuenow` / `min` / `max`（`slider.tsx`），展开件给 `aria-expanded` + `aria-controls`，选中件给 `aria-selected` / `aria-checked`，禁用件给 `aria-disabled`
4. 状态走 `aria-*`，外观走 `data-*`：`data-*` 只做皮肤钩子，不承载语义；同一状态两边都发时以 `aria-*` 为准
5. `aria-hidden` 不落可聚焦件：被聚焦就是静默死角，朗读端念不出、键盘端却卡住——`password.tsx` 的显隐开关已去掉 `aria-hidden`，只留 `aria-pressed` + `aria-label`（`tabIndex=-1` 不进 Tab 序，键盘切换走 Shift 手势），AT 可播报按钮
6. 隐藏输入件例外：Checkbox / Radio / Upload 的 off-screen `<input>` 用 `tabIndex={-1}` + `aria-hidden` 是既定车道（`upload.tsx`），因为交互名由可见件承担
7. 动态播报（4.1.3）：结果类变更（保存成功、加载完成、删除生效）要进 live region；`field.tsx` 已接 `role="alert"` 与 `aria-live="polite"`，`toast.tsx` 的 `ToastRoot` 已接 `role="status"`（polite 播报，单条不打断）
8. live region 挂稳定容器：容器常驻、整段替换内容；禁止每次渲染新建 live 根，禁止把整个页面当 live 区
9. `aria-busy` 表达加载中，不替代名字变化：按钮进加载态时 `aria-busy="true"` 由骨架发（`button.tsx`），文案变化要能被朗读到才算告知
10. 禁用件留在朗读流：用 `disabled` / `aria-disabled` 并保持可读；只降透明度不算表达了禁用，禁用还要有指针与键盘行为的差异
11. `id` 唯一、关联有效：`aria-labelledby` / `aria-describedby` / `aria-controls` 指向的节点必须存在；跨组件关联走 `useId`（骨架统一用 `autoId` 兜底），禁止手写数字后缀
12. `aria-live` 与 `role` 值合法：只用规范内的 role 与取值；`aria-orientation`、`aria-haspopup`、`aria-current` 按各自的枚举值写，不许塞自定义字符串
13. 接管浏览器兜底要留出路：`appearance: none`、隐藏原生控件之后，名、状态、键盘行为都得自己补上，补不齐就用原生件
14. 朗读与键盘两端实测，不靠读代码推断：`role` 与 `aria-*` 写在源码里不等于无障碍树里存在，见 `verification.md`
