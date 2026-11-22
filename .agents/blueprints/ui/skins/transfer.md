# Transfer 皮肤（app/ui/skins/transfer.tsx）

1. 根：左右两栏 + 中列动作，`flex` + `gap-3`。
2. 面板：纵向弹列 `rounded-lg` + `border-frame` 描边 + 底色方案自答 + `shadow-surface` 浮起；头行两端对齐 + `border-b-frame` 下分隔——标题由骨架直渲、皮肤包进自有 span 承担截断（`truncate`，字号字重走头行），缺省 `Source` / `Target` 由皮肤提供；计数 `text-xs` + `surface-fg`；体 `h-64` 滚动 + `p-1`；空态 `surface-fg`。
3. 行：headless 渲染的 Checkbox——皮肤经 `item` 通道中继 Checkbox 零件并叠行 delta（`w-full` + `rounded-sm` + `px-3 py-2` + `hover` 对）；悬停染色落在 label 行盒上，框不吃行悬停。
4. 移动钮：outline 按钮直叠 `move` 槽 + `surface-fg` 文字色，按下沿共享 `--translate-crush` 压平；动作列纵排 `gap-2`。
5. 专属令牌：无。
