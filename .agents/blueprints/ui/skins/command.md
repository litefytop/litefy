# Command 皮肤（app/ui/skins/command.tsx）

1. 组合（自上而下）：触发钮（text 角色按钮 + `px-control-x`）→ 面板（Dialog 内容卡叠 `w-[min(--spacing(128),calc(100vw_-_--spacing(4)))] max-w-none min-w-0` + 内边距取菜单族补偿带 `panelPadClass`（`min(圆角档, 8 单位)`——schemes.md rule 12 浮层面板补偿律的竖向面板版）：行背景是方角，补偿带兜住 hover 不被面板圆角裁剪，圆角答 0 的方案自然归零贴边；Dialog 默认的 `p-4` 被它覆写；圆角与投影只留面板一层）→ 输入行 → 列表 → 脚注。面板根 `flex flex-col` 无纵缝——输入行与列表贴合一体（shadcn 同款无缝）。
2. 输入行（shadcn 同款去框化一体行）：自建三槽、不复用 Input 皮肤框线配方——group `flex w-full min-h-control items-center gap-x-2 px-3`（无框线、无底色、无圆角、无投影、无聚焦环），root `min-w-0 grow basis-0 self-stretch border-0 bg-transparent p-0 outline-none font-field text-inherit placeholder:text-surface-fg`，leading/trailing 纯排列（shrink-0 / min-w-0 overflow-hidden）；放大镜图标 `size-4`。
3. 列表视口：List 视口叠 `max-h-72 min-h-32 rounded-none border-0 shadow-none p-1`——去框、去投影（面板内零嵌套阴影）、p-1 与面板同内边距节奏。
4. 行（shadcn 同款紧凑扁行）：List 行叠 `min-h-control px-2 py-1.5`——44 控制令牌车道兜行高下限（随紧凑档缩放）、无独立圆角（圆角只归面板整体）、无发丝分隔线；hover 与 `data-[highlighted=true]` 同吃 `bg-accent` + `text-accent-fg`（键盘高亮 = 指针悬停）；图标 `surface-fg`，标签 `flex-1` 截断（`font-field`，禁用压暗）。
5. 分组标题：List 组头叠 `border-b-0 px-2 py-1.5 text-xs text-surface-fg`——无分隔线、与行同内边距、弱化小字。
6. 快捷键帽：可见线框的提示件——`kbd` 工具类同源引用（schemes/kbd.md 单一正本）；同一字形，读作提示不作控件。
7. 空态：无结果的 `empty` 槽在列表视口内水平垂直居中——`flex min-h-30 items-center justify-center`（视口 `min-h-32` 减 `p-1` 上下 8px 恰好填满）+ `text-sm` + `text-surface-fg` 弱化文字色；文案由消费方传（如搜索的双语「没有匹配的结果 / No results found」），缺省 "No results"。
8. 对话框根与舞台经 `dialogClassNames.root` / `.stage` 接 Dialog 皮肤（透明画布 + `place-items-center` 居中舞台）。
9. 键盘说明脚注：`classNames.footer` 行（`flex` + `gap-x-3` + 顶部发丝分隔线 `pt-1`），提示文字 `text-xs` + `surface-fg`；键帽（`data-command-hint-key`：`↑` `↓` `↵` `esc`，均在脚注）经面板根后代选择器按快捷键帽配方着装（`kbd` 工具类同源）。
10. 专属令牌：无。
