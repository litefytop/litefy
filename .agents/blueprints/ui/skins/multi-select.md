# MultiSelect 皮肤（app/ui/skins/multi-select.tsx）

1. 触发件：复用共享字段框 `fieldGroupClasses`，叠 `min-h-field cursor-pointer flex-wrap gap-1 px-2`，支持内容换行；缺省宽度为 `w-full min-w-0 max-w-[20rem]`（跟随父容器但封顶 320px），不再把整枚 outline 按钮变体带入字段触发件。
2. 面板：`content` 自带完整浮层配方——`rounded-md` + `border-frame` + `surface-raised` + `shadow-elevated` + 圆角补偿 `p-[var(--radius-md)]`（内联在本组件面板串，律见 `ui/schemes.md` 第 12 条）；列表只留滚动界（`max-h-96 overflow-y-auto outline-none`）——不设自身内边距与圆角，行 hover 由面板内边距兜住不被角裁剪；宽度经 `matchWidth` 锁触发器（y 轴锚定同宽车道），受 `max-w-[min(20rem,calc(100vw_-_1rem))]` 封顶。
3. 分组头：`px-3 py-snug` 与行同高 + `text-sm leading-5` 与行同节奏 + `control-label`（label 比交互正文大） + `foreground`。
4. 选项行：`flex` + `px-3 py-snug` + `font-field`，hover 与键盘高亮（`data-[highlighted=true]`）共用 `listOptionHoverClasses` 同吃 `accent` 背景档（并写它的配对前景 `accent-fg`）；选中（`data-[selected=true]`）加重字重、尾部 Check 图标（`text-primary`）；禁用按 `data-[disabled=true]` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover 类；动作由骨架 JavaScript 守卫阻断。
5. 专属令牌：无。
