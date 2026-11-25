# Accordion 骨架（app/ui/components/accordion.tsx）

- 职责：折叠面板组派生组件，数据驱动单开/多开手风琴；复用 `./collapse` 的 `CollapseRoot` 与 `Collapse`。

## 行为 / 状态

- 导出 `Accordion`；`items` 配置（`CollapseItemConfig`：`itemKey` + `panel`，继承除 `children / open / onOpenChange / itemKey` 外的 `Collapse` 属性），内部以 `string[]` 维护激活键
- `multiple=true` 多开，`onKeyChange(values: string[])`；单开时 `onKeyChange(key)`，全部关闭时传空串 `""`；单开点击已开项即关闭
- 受控 `activeKeys`（multiple 为 `string[]`，单开为 `string | undefined`）；非受控 `defaultActiveKeys`（类型随模式）
- `common` 提供缺省 `className / classNames / styles / icon`，item 级配置优先
- 容器为 `CollapseRoot`，每项渲染 `Collapse`，激活键经 `open` 注入
- `disabled` 禁用整组，item 级 `disabled` 禁用单项；任一禁用均保持当前展开状态、禁止切换且不触发 `onKeyChange`
- 整组禁用时根节点输出 `aria-disabled="true"` 与 `data-disabled`；单项禁用只落在对应 `Collapse`，整组根不标记禁用
