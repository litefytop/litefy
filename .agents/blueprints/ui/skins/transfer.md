# Transfer 皮肤（app/ui/skins/transfer.tsx）

1. 根：`flex w-full min-w-0 max-w-[40rem] items-center gap-x-3`，`size` 可选 `sm` 20rem / `md` 24rem / `lg` 28rem / `xl` 32rem / `2xl` 40rem（默认）；左右两栏 + 中列动作，窄容器由面板 `min-w-0` 收缩。
2. 面板：纵向弹列 `rounded-lg` + `border-frame` 描边 + 底色方案自答 + `shadow-surface` 浮起；头行两端对齐 + `border-b-frame` 下分隔——标题由骨架直渲、皮肤包进自有 span 承担截断（`truncate`，字号字重走头行），缺省 `Source` / `Target` 由皮肤提供；计数 `text-xs` + `foreground`；体 `h-64` 滚动 + `p-1`；空态 `foreground`。
3. 行：headless 渲染的 Checkbox——皮肤经 `item` 通道中继 Checkbox 零件并叠行 delta（`w-full` + `rounded-sm` + `px-3 py-2` + accent 背景档悬停（并写它的配对前景 `accent-fg`））；悬停染色落在 label 行盒上，框不吃行悬停。
4. 移动钮：outline 按钮直叠 `move` 槽，纯图标态（骨架发 `data-pure-icon`）方型与零内距由 `pure-icon` utility 作答 ，不另覆盖按钮文字色；骨架 `showMoveLabels` 开启时移动钮渲图标 + 可见文字（children 非空，纯图标态自动退出）；压平由按钮类自带，皮肤不重复声明；动作列纵排 `gap-2`。
5. 专属令牌：无。
