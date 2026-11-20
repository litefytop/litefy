# Command 皮肤（app/ui/skins/command.tsx）

1. 组合（自上而下）：触发钮（text 角色按钮 + `px-3`）→ 面板（Dialog 内容卡：随 Dialog 舞台 `place-items-center` 居中开合——命令面板不作顶对齐聚光灯形态；宽度 `w-[min(32rem,calc(100vw-1rem))]` + `max-w-none min-w-0` 覆盖 Dialog 默认的 `max-w-112`，桌面 512px 上限、移动端随视窗减 1rem 边距自适应；`p-2` 内边距）→ 搜索字段（Input 皮肤整包 `inputPartClasses`，group 槽覆写 `w-full` 跟随面板宽度伸缩——Input 皮肤默认 `w-55` 只属独立输入框，命令面板内不适用；放大镜图标自带尺寸 `size-4`）→ 列表（List 视口几何去框：`max-h-72 min-h-32` 高度上限、`rounded-none`、`p-1`）→ 行。面板根 `flex flex-col` + `gap-y-3`：字段与列表之间的纵缝大于阴影偏移（neo 桌面档 8px 硬阴影、minimal 聚焦环 3px 外扩），静置与聚焦的阴影都压不到列表首行。
2. 行：List 行叠 `rounded-sm`、行栈紧贴（禁纵向间距），hover 与 `data-[highlighted=true]` 同吃 `hover` 对（键盘高亮 = 指针悬停）；图标 `surface-fg`，标签 `flex-1` 截断（`font-field`，禁用压暗）。
3. 分组标题：List 组头叠底色条（底色方案自答）。
4. 快捷键帽：可见线框的提示件——`h-5 min-w-5` 小盒、`border-frame` 描边 + `bg-background` 底 + `shadow-subtle` 微浮、`font-mono` + `text-xs`；同一字形，读作提示不作控件。
5. 对话框根与舞台经 `dialogClassNames.root` / `.stage` 接 Dialog 皮肤（透明画布 + `place-items-center` 居中舞台）。
6. 键盘说明脚注：`classNames.footer` 行（`flex` + `gap-x-3` + 顶部发丝分隔线），提示文字 `text-xs` + `surface-fg`；键帽（`data-command-hint-key`：`↑` `↓` `↵` `esc`，均在脚注）经面板根后代选择器按快捷键帽配方着装（`h-5 min-w-5` 小盒 + `border-frame` + `bg-background` + `shadow-subtle` + `font-mono`）。
7. 专属令牌：无。
