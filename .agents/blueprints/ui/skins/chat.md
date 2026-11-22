# Chat 皮肤（app/ui/skins/chat.tsx）

1. 列：`flex flex-col gap-y-4`；消息行 `flex gap-x-3`，`data-align=leftRight` 时用户行 `flex-row-reverse`（头像居右、主列右对齐），`leftAlign` 一律左；主列 `flex flex-col gap-y-1 min-w-0 max-w-full`，用户行主列 `items-end`。
2. 头像：`size-8 shrink-0 rounded-pill overflow-hidden border-hair border-border bg-surface`，`img` 吃满 `size-full object-cover`，首字回落居中 `text-sm`。
3. 名字：`text-xs text-surface-fg`；气泡形态由根 `data-mode` 决定：`bubble` 双方带气泡（用户 `bg-accent text-accent-fg`、助手 `bg-surface text-surface-fg`，`rounded-xl` + 内边距 `px-3 py-2`，用户气泡右下直角 `rounded-br-sm`、助手左下直角 `rounded-bl-sm`）；`noBubble` 双方纯文字（`text-foreground`）；`userBubble` 仅用户带气泡。
4. 内容块：基座 `flex max-w-full flex-col gap-y-2 text-left text-sm leading-5`；气泡由骨架按 (mode, user) 变体选择、逐行只挂选中一枚——`contentBubbleUser`（用户气泡：`rounded-xl rounded-br-sm bg-accent text-accent-fg px-3 py-2`，bubble 与 userBubble 的用户行共用）、`contentBubbleAssistant`（助手气泡：`rounded-xl rounded-bl-sm bg-surface text-surface-fg px-3 py-2`）、`contentPlain`（无气泡纯文字：`text-foreground`，noBubble 与 userBubble 助手行共用）；失败行（`failed` / `cancelled`）由骨架叠 `contentError`（`text-danger-fg`）。图片 `max-w-64 rounded-lg border-hair border-border`；文件块与 function_call 为线框小盒（`border-hair border-border rounded-md px-2 py-1 text-sm`，function_call 加 `font-mono text-xs`）；reasoning 块 `text-sm text-surface-fg` 左侧竖线 `border-l-2 border-border pl-2`。
5. 打字点：容器 `typing` 槽 `flex items-center gap-x-1 py-1`；圆点经 `typingDot` 槽逐节点着装——三枚 `size-1.5 rounded-pill bg-current` 圆点 `motion-safe:animate-pulse`，相位由骨架内联 `animation-delay` 错开；等待气泡同尺寸盒内水平排布。
6. 操作栏：`flex items-center gap-x-1`，动作钮复用 `buttonVariants.text` 形态收窄为小档（`h-control min-h-0 w-control` 纯图标钮——控制令牌车道，方型与内距清零由骨架 `data-pure-icon` 钩子接管，+ `[&_svg]:size-3.5` 由既有 frame 规则吃尺寸），`data-active=true` 染 `primary`；`opacity-0` 至行 hover 或 focus-within 显形（悬停显现过渡豁免档），触屏常显由 `motion-safe` 之外的自然态兜底。
7. 提示词：`flex flex-wrap gap-x-2 gap-y-1`；hint 钮复用 `buttonVariants.outline` 形态收窄为小档（`h-control`、`text-sm` 常规字重、`rounded-lg`）。
8. 无障碍：列表 `role="log"`；操作钮带 `aria-label`；悬停显形不移除可聚焦性。
9. 专属令牌：无。
