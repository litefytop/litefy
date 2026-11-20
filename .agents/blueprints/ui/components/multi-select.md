# MultiSelect 骨架（app/ui/components/multi-select.tsx）

- 职责：Popover + listbox 的多选控件：触发钮披露候选面板，面板内多选、即时提交。

## 行为 / 状态

- 候选 `options` 项 `{ label, value, group?, disabled? }`；按 `group` 分组渲染——分组头 `li role=presentation`，其后为该组选项；组头缩进语义由皮肤表达
- 面板：`role=listbox` + `aria-multiselectable` + `aria-label`；选项 `li role=option` + 稳定 id + roving tabindex（高亮项 0 其余 -1）+ `aria-selected` / `aria-disabled`；选中项尾部渲染 Check 图标（皮肤槽位）
- 键盘（面板聚焦）：`↑` / `↓` 移动高亮（环绕），`Enter` / `Space` 切换高亮项，`Escape` 关闭并归还焦点到触发钮；开启时焦点落到初亮选项（已选项，无则首项）；高亮随 `scrollIntoView(nearest)` 滚动
- 选择即提交（面板不关，继续多选）；`value` 受控 / `defaultValue` 非受控；`onChange(values)` 每次切换全量回调
- 面板宽度经 `placement.matchWidth` 锁触发器（y 轴锚定同宽车道）
- 触发钮：`trigger` 自定义渲染；缺省渲染 `placeholder`，已选非零时追加计数后缀 `(${count})`；触发钮输出 `aria-controls` 指向面板
- 槽位：`classNames: content / list / group / option / check`；`styles: list / option`
- 图标通道：`checkNode` 覆盖选中项尾部 Check（缺省 `Check`，契约见 ui/components.md）
