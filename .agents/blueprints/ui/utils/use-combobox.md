# useCombobox 键盘高亮内核（app/ui/utils/use-combobox.ts）

1. 职责：combobox 形件共用的键盘导航与高亮状态机，泛型、零 DOM。
2. 行为：`ArrowDown` / `ArrowUp` 在未禁用项间循环（越过禁用项，末尾回环）；无高亮时先落到首个未禁用项；`Enter` 有高亮且未禁用才 `onSelect(item, index)`；`open` 为假或列表为空不处理。
3. `reset` 清高亮（面板关闭即调用）；`setHighlightIndex` 直出受控口；高亮项以原始索引记，调用方自行滚动到可见（List 的 `scrollIntoView`）。
4. 消费方：Combobox、Command（`open` 恒真）；安装与 API 正本为 `content/docs/utils/use-combobox.zh.mdx`。
