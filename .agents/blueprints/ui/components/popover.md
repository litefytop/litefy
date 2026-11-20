# Popover 骨架（app/ui/components/popover.tsx）

- 职责：锚定浮层的开关骨架：click / hover 触发、对齐定位，内容用原生 popover 展示。

## 行为 / 状态

- 导出 `Popover`（Button 触发 + 内容）、可单独组合的 `PopoverContent` 与 `usePopoverTrigger`；`open`/`defaultOpen=false`/`onOpenChange` 双模
- `alignX` 只定水平对齐，开口一律向下：`start` → bottom/start、`center` → bottom/center、`end` → bottom/end，`gap=4`；需要向左右侧弹用显式 `placement={{ side: ... }}` 覆盖；`matchWidth` 默认 false
- `usePopoverTrigger`：生成清洗后的 `--popover-trigger-{uid}` 锚点名；click 模式点击切换并 `preventDefault`、ArrowDown 打开；hover 模式 enter/focus 打开（打开延迟 `hoverDelayOpen` 默认 0）、leave 延迟 200ms 关闭，点击与方向键不处理
- 触发钮为 `Button`：`aria-haspopup` 缺省 "menu"（可覆盖）、`aria-expanded`、`data-anchor-name`；内容悬停取消关闭计时，离开重新计时
- 内容 `PopoverContent`：`popover="manual"`、`role="dialog"`（非模态，无焦点陷阱）、`tabIndex=-1`，输出 `data-float-anchor`/`data-float-x`/`data-float-y`/`data-float-side`/`data-float-align`/`data-float-gap`/`data-float-match-width`；`anchorPoint` 走坐标锚定并实际按 bottom/start 摆放
- `PopoverContent` 的 Escape 先交给外部 `onKeyDown`，未被 `preventDefault` 才 `onOpenChange(false)`；`autofocus` 默认 true，开启时经 `useFloatingPanel` 聚焦面板内首个可聚焦元素并在关闭时恢复焦点；hover 模式传 false
- 外部点击由 `useFloatingPanel` 关闭，`useFloatingPosition` 在滚动/尺寸变化时重排；无焦点陷阱，Tab 可离开面板
- 定位由 `floating-position` 全权负责：写内联 `position/left/top/width` 并置 `margin: 0`——原生 popover 的 UA `inset: 0` 叠上祖先的 margin 策略（如预览舞台 `[&>*]:m-auto`）会过约束自动居中，`margin: 0` 把面板与页面层的盒模型策略隔离
- 槽位：`classNames.trigger/content`；`styles.trigger/content`
