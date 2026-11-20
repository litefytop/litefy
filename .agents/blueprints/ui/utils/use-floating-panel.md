# useFloatingPanel 浮层开关接线（app/ui/utils/use-floating-panel.ts）

1. 职责：`popover="manual"` 面板的开合副作用——显示/隐藏、焦点管理、外部点击关闭；定位本体归 floating-position。
2. 开启：`showFloatingPanel` 先停屏外防闪现再显示；`focusOnOpen` 为真时聚焦面板内首个可聚焦元素（选择器同 trap-tab-key），同时记住开启前焦点。
3. 关闭：`hidePopover()`；`restoreFocus` 为真且焦点确已丢失（落 body、为空或仍在面板内）才归还开启前焦点，不抢用户主动落的焦点。
4. 外部点击：open 期间监听 document `mousedown`，命中面板、锚元素（`anchorRef`）或锚名元素（`data-float-anchor` 关联的 `data-anchor-name` 节点）之外即回调 `onOpenChange(false)`；点击触发钮本身不算外部。
5. 消费方：Picker、Popover / PopoverContent、Select、Combobox、DatePicker、DateRangePicker、FloatingToc；安装与 API 正本为 `content/docs/utils/use-floating-panel.zh.mdx`。
