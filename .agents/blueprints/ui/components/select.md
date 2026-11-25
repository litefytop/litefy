# Select 骨架（app/ui/components/select.tsx）

- 职责：单值下拉选择：button 触发、listbox 面板、分组与键盘高亮。

## 行为 / 状态

- 导出 `Select` 与类型 `SelectOption`（label/value）、`SelectOptionGroup`（group/options）；`value` 受控或 `defaultValue=""`，`open` 受控或内部初值 false，`onValueChange`/`onOpenChange` 始终回调
- `options` 拍平为 `flat`；触发钮文本取 `flat` 中匹配 `value` 的 label，缺失则 `placeholder`；`name` 存在时额外渲染同名 hidden input，值变化时于隐藏域派发 `change`（供 Field 重验）
- `label` prop：触发钮始端前置标签，直渲进触发钮（无包装节点，行首整形由皮肤承担）；触发钮可访问名由内容自动携带；面板 `aria-label` 取 `placeholder`，缺省回退字符串型 `label`
- 字段 props：`description` / `validate` / `validateTrigger` / `fieldClassNames` 任一传入即组装内部 Field 机制（render-prop，触发钮接线 `id` / `aria-describedby` / `aria-invalid`，name 隐藏域已自带）；不传保持纯选择器 DOM。chrome 标签不用于 Select——行内标签由 `label` prop 承担
- 触发钮：`type=button`、`role="combobox"`（select-only 模式）、`disabled`、`aria-haspopup="listbox"`（可被 props 覆盖）、`aria-expanded`、`aria-controls` 指向面板、`aria-activedescendant` 指向高亮选项 id、`data-open`、`data-placeholder-shown`、`data-anchor-name="--select-{uid}"`；尾部 `ChevronDown` 带 `aria-hidden` 与 `data-open`
- 键盘（disabled 时整体失效）：ArrowDown/ArrowUp 关闭时开面板，开启时在 `flat` 内循环移高亮；Enter/Space 有高亮则提交否则开关；Escape 关闭；Home/End 到首/尾；Tab 关闭但不拦截
- `commit`：非受控写值、`onValueChange`、焦点回触发钮、关闭面板；高亮变化时把 `[data-highlighted="true"]` 滚入视野（block: nearest）
- 面板：`popover="manual"`、`tabIndex=-1`、`role="listbox"`、`aria-label=placeholder`，锚定属性 `data-float-*`（bottom/center/gap 4/match-width）；空列表渲染 `classNames.empty` 的 "No options available"
- 选项：`role="option"` + 稳定 id（`--select-{uid}-{index}`）、`aria-selected`、`data-highlighted`/`data-selected`；整组 disabled 时输出 `aria-disabled` / `data-disabled` 且不绑定点击；分组包裹层 `role="presentation"`，组标题取 `classNames.label`
- 开关与外部点击：`useFloatingPanel`（anchorRef 为触发钮）在面板外 mousedown 时关闭；`useFloatingPosition` 随滚动/尺寸重定位
- 打开时高亮停在当前选中项，否则首项；无选项时为 null
- 槽位：`classNames.panel/label/option/value/chevron/empty`；`styles.panel`；`label` 指面板组眉
- 图标通道：`chevronNode` 覆盖触发钮尾部 chevron（缺省 `ChevronDown`，契约见 ui/components.md）
- 禁用遵循 `ui/schemes.md` 第 8 条：`open = !disabled && openState`，trigger 原生 disabled，setOpen、commit 与键盘处理均由 JS 阻断；皮肤按 default/cell 外观完整替换 trigger 正常类串并显式禁用色与 `cursor-not-allowed`
