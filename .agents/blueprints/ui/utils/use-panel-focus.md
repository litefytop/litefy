# usePanelFocus 面板聚焦跳转（app/ui/utils/use-panel-focus.ts）

1. 职责：输入框关联面板的 ArrowDown / ArrowUp 聚焦跳转，单回调 hook。
2. 行为：`open` 为假或非上下方向键直接放行；否则 `preventDefault`，按方向取面板内首/尾可聚焦元素（选择器同 trap-tab-key），无可聚焦元素时聚焦面板本身。
3. 消费方把它拼进输入框的 `onKeyDown` 链（外部回调先行、未 preventDefault 才轮到它，再后才轮到 Enter 提交一类）——Combobox 与 DatePicker 输入框即此接线。
4. 安装与 API 正本为 `content/docs/utils/use-panel-focus.zh.mdx`。
