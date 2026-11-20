# Chat 骨架（app/ui/components/chat.tsx）

1. 定位：AI 会话消息流——角色头像与名字、消息内容块、状态（六态映射：queued / in_progress / incomplete 为等待，completed 为常态，failed / cancelled 为失败）、消息操作栏与提示词区；会话输入条属业务件，不在本库。
2. Props：`chats: ChatMessage[]`（受控消息列表）、`roleConfig?: ChatRoleConfig`（角色名 → `{ name?, avatar? }`，键即消息 `role`）、`align?: "leftRight" | "leftAlign"`（默认 `"leftRight"`）、`mode?: "bubble" | "noBubble" | "userBubble"`（默认 `"bubble"`）、`hints?: string[]`、`onHintClick?: (hint: string) => void`、`onMessageCopy?` / `onMessageGoodFeedback?` / `onMessageBadFeedback?` / `onMessageReset?: (message: ChatMessage) => void`、`renderMessageContent?: (message: ChatMessage) => React.ReactNode`（内容整体覆盖出口）、`className` / `classNames`（`root` / `list` / `message` / `main` / `avatar` / `name` / `content` / `contentItem` / `actions` / `action` / `hints` / `hint` / `typing` 槽）/ `style`、其余 `div` 属性透传。
3. 结构：根 `div[data-align][data-mode]` → 消息列表 `ul[role="log"][aria-live="polite"]` → 每条 `li[data-role][data-user][data-status]`（`data-user` 为用户判定出口）→ 头像槽（`roleConfig.avatar` 有则 `img`，无则角色名首字 `span`）→ 主列（名字槽 + 内容槽 + 操作栏槽）；列表尾部提示词区 `ul` + `hint` 槽按钮。内容默认渲染器按块迭代：`text` / `input_text` / `output_text` 文本段、`input_image` 图片、`input_file` 文件名块、`reasoning` 思考摘要块、`function_call` 调用名 + 参数块。
4. 行为：等待态（`queued` / `in_progress` / `incomplete`）且无内容时渲染打字点（三枚 `span[data-typing]`，相位内联错开）；失败态仅发 `data-status` 交皮肤；复制按钮写剪贴板（`content` 拼接文本）后回调 `onMessageCopy`；赞 / 踩为本地切换（`data-active`）并回调；重置仅回调；操作栏只在 `role !== "user"` 且 `status === "completed"` 的消息上渲染；提示词点击回调 `onHintClick`。
5. 外观交给皮肤：气泡形态、布局镜像、打字点动画、失败染色全由皮肤按 `data-*` 表达；骨架零样式 class；图标用库内置（复制 / 赞 / 踩 / 重置）。
6. 渲染隔离：消息行按消息对象引用 memo，流式更新只重渲变化的行，其余行与提示词区引用稳定。
7. 待定项：消息选区（selectAll / deselectAll）、消息编辑、OpenAI Response / Chat Completion 的 Adapter 转换函数、`references` 引用块、时间戳展示、滚动管理（scrollToBottom 等）——后续按需补入。
