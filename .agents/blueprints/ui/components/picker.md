# Picker 骨架（app/ui/components/picker.tsx）

- 职责：输入框 + 浮层的选择器基座：值/开关双模，二者以锚点关联并各自暴露槽位。

## 行为 / 状态

- 导出 `PickerRoot`（`div`，写 `data-anchor-name`）、`PickerInput`（`input role="combobox"`，`id` 缺省 `useId`，`aria-expanded` 缺省 `false`，`aria-controls` 可传）、`PickerContent`（`div popover="manual" tabIndex=-1 role="dialog"`，锚定属性 bottom/center/gap 4）
- `Picker` 增 `leading?: React.ReactNode` 前缀槽：真值渲染包装 `span`（`classNames.leading` / `styles.leading`，与 trailing 同款）置于输入框之前，供组合件放装饰图标；根节点由传入的 `aria-invalid` 映射 `data-invalid`，让字段组皮肤在容器上响应无效态
- `trailing` 存在时渲染 `span`（`classNames.trailing` / `styles.trailing`）
- **浮层宽度契约**：`PickerContent.matchWidth` / `Picker.matchPanelWidth` 默认 `true`，仅此时写 `data-float-match-width="true"`，由 `useFloatingPosition` 把面板宽度锁成锚点宽度（下拉列表需要）。传 `false` 时完全不写该属性，面板由自身 `classNames.popover` 决定宽度——**日历一类自有尺寸的面板必须传 `false`**：top layer 的 popover 不应被字段宽度压缩，窄列表头尤其如此。默认 `true` 保证现有 `Select` / `Combobox` 行为不变
- `Picker` 组合三者：`anchorName` 由 useId 清洗为 `--picker-{uid}`；根节点带 `data-open`；`value`/`defaultValue=""` 与 `open`/`defaultOpen=false` 均双模；`disabled` 组级禁用——输入框原生禁用、根输出 `data-disabled` / `aria-disabled`、open 强制为 `false` 且 `handleOpenChange` 拒绝置真，浮层从源头不可达，不挂 inert
- 禁用遵循 `ui/schemes.md` 第 8 条：皮肤完整替换输入框正常类串，保留字段组结构并显式禁用色与 `cursor-not-allowed`
- 输入框：`aria-expanded={open}` 恒为布尔、`aria-controls` 指向面板 id、有 trailing 时带 `data-trailing`；点击先走外部 `onClick`，未被 `preventDefault` 才切换开关
- 输入框键盘：先走外部 `onKeyDown`，被拦截则返回；Escape 关闭，关闭态 ArrowDown 打开（开启时不处理）
- 输入变更：非受控写内部值，始终 `onValueChange`；值不由组件归一化或回写
- 面板：Escape 拦截默认并关闭；`useFloatingPanel` 以 `restoreFocus` 恢复焦点并处理外部点击，`useFloatingPosition` 随滚动/尺寸重定位；`panelRef` 可外传
- 槽位：`classNames.input/trailing/popover`；`styles.input/trailing/popover`（根 `className`/`style` 直通）
