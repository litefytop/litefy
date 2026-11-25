# Form 皮肤（app/ui/skins/form.tsx）

1. Form 本体无视觉外观，仅提供内容容器宽度：`w-full min-w-0`，`size` 取 `sm` 20rem / `md` 24rem / `lg` 28rem（默认）/ `xl` 32rem，固定 rem 上限可用 `className` 覆盖；`FormSubmit` 是 headless Button，直接叠 `buttonVariants.primary` 着主按钮角色——不另写按钮框；无 children 时补挂 `pure-icon` 类（与骨架自动属性同条件）。
2. 专属令牌：无。
