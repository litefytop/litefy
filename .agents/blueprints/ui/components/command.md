# Command 骨架（app/ui/components/command.tsx）

- 职责：命令面板，关键字过滤可分组列表并键盘选择。

## 行为 / 状态

- 导出 `CommandRoot` / `CommandInput` / `CommandList` 与组合 `Command`（Dialog 弹窗版）；Root 经 Context 向下游分发 keyword、rows、inputRef、高亮、键盘处理、`selectRow`，脱离 Root 使用抛错；Context value 经 memo，依赖不变时引用稳定
- 配置 `CommandConfig`：单项 `{ label, value?, icon?, shortcut?, keywords?, disabled? }` 或分组 `{ group, items }`；`flattenItems` 拍平为带 group 归属的行
- 过滤：keyword trim + 小写；匹配文本由 `value + label（仅字符串） + keywords` 拼接，`defaultFilter` 为 `includes`，可传 `filter` 覆盖；过滤排除 `disabled` 项
- 键盘与高亮复用 `useCombobox`（utils/use-combobox，open 恒 true）；rows 变化时高亮重置为首个非 disabled 项（无则 null）
- Root 在 `open` 为真时清空 keyword 并聚焦输入框
- `CommandInput`：`Input`，`role="combobox"` + `aria-autocomplete="list"` + `aria-expanded` + `aria-controls` 指向列表 viewport id + `aria-activedescendant` 指向高亮行 id，leading 缺省 `Search` 图标（`aria-hidden`）；`trailing` 透传（组合版经 prop 注入随状态附件，如搜索加载 spinner）
- 导出 `CommandFooter`：`data-command-footer` 脚注行，三组 `data-command-hint`（键帽 `data-command-hint-key` + `aria-hidden`，配 `↑` `↓` / `↵` / `esc` 与说明文字；自有元素槽 `classNames.hint` / `classNames.hintKey`），`navigate` / `open` / `close` 文字缺省 Navigate / Open / Close
- `CommandList`：内部 `List`；存在分组项时启用分组头渲染；`getKey` 取 `item.value ?? index`；鼠标移入非 disabled 项更新高亮；`empty` 缺省 "No results"，显式传 `null` 且无行时整个列表不渲染（紧凑初始态）；空态由 `classNames.empty` 着装（骨架只透传槽位、不自带样式）
- 行渲染 `renderItem(item, { highlighted, disabled })` 可覆盖；缺省渲染 icon（`aria-hidden`）+ label（`data-disabled` 标记）+ shortcut（`kbd`）
- `selectRow` 对 disabled 项不触发 `onSelect`
- 禁用行整行不可交互：`CommandList` 把 `row.item.disabled` 经 `isItemDisabled` 传 `List`，行容器由 List 落 `data-disabled` 与 `inert`（指针、hover、焦点全不达），键盘导航与选择的跳过由 `useCombobox` 承担
- 组合 `Command`：`trigger` 渲染为 Button（`aria-haspopup="dialog"` + `aria-expanded`，点击开面板），`Dialog` 承载 Root/Input/List（不传 `title` 与 `close`，Dialog 不渲染 header 与关闭钮），`aria-label` 取 `placeholder`；选择后自动关闭；`open` / `defaultOpen` / `onOpenChange` 控制开关；输入行 `trailing` 透传（如搜索加载 spinner），列表后渲染 `CommandFooter` 脚注（键盘说明，含 esc 关闭），`hints` 传本地化文字、传 `null` 整体关闭
- `dialogClassNames` / `dialogStyles` 直通 Dialog；`classNames.content` 拼接到 Dialog content
- 槽位：`classNames: trigger / content / input / field / searchIcon / list / root / footer / hint / hintKey / rows / item / label / itemIcon / itemLabel / shortcut / empty`；`styles: content / list / item / label`
