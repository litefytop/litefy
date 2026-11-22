# MultiSelect 皮肤（app/ui/skins/multi-select.tsx）

1. 触发件：按钮形披露件——outline 按钮框叠 `px-control-x` + `border-frame` 描边 + `w-55` 缺省内在宽（宿主车道，消费方 `w-full` 接管）+ `text-left` + `min-w-0`。
2. 面板：`content` 自带完整浮层配方——`rounded-md` + `border-frame` + `surface-raised` + `shadow-elevated` + 圆角补偿 `p-[var(--radius-md)]`（内联在本组件面板串，律见 `ui/schemes.md` 第 12 条）；列表只留滚动界（`max-h-96 overflow-y-auto outline-none`）——不设自身内边距与圆角，行 hover 由面板内边距兜住不被角裁剪；宽度经 `matchWidth` 锁触发器（y 轴锚定同宽车道）。
3. 分组头：`px-3 py-snug` 与行同高 + `text-sm leading-5` 与行同节奏 + `font-label`（label 比交互正文大）+ `tracking-label` + `case-label` + `surface-fg`。
4. 选项行：`flex` + `px-3 py-snug` + `font-field`，hover 与键盘高亮（`data-[highlighted=true]`）同换 `accent` 对；选中（`data-[selected=true]`）加重字重、尾部 Check 图标（`text-primary`）；禁用禁指针 + 压暗。
5. 专属令牌：无。
