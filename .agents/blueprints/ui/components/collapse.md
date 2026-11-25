# Collapse 骨架（app/ui/components/collapse.tsx）

- 职责：单体折叠面板展开/收起骨架。

## 行为 / 状态

- 导出四个部分：`CollapseRoot`（纯容器 div）、`CollapseTrigger`（`type="button"`，输出 `aria-expanded`）、`CollapsePanel`（`section`，输出 `data-open`）、组合 `Collapse`
- `CollapsePanel` 以 `grid-template-rows: 1fr / 0fr` 切换实现展开收起；裁剪内衬（`overflow: hidden; minHeight: 0`）是骨架自有元素且不挂任何槽位——padding / 边框必须挂在 `body` 槽的内层内容 div 上（挂上裁剪层会顶住 0fr，收起残留 padding 高度）；槽位 `panel / body`
- `Collapse`：`open` 受控或 `defaultOpen`（默认 false）非受控，切换回调 `onOpenChange(next)`；`label` / `icon` 可传函数按 `open` 渲染；icon 缺省用 `ChevronDown`（`data-open` + `aria-hidden`）
- `Collapse` 自动生成 `acc-trigger-` / `acc-panel-` 前缀 id（`itemKey` 可覆盖），trigger `aria-controls` 与 panel `aria-labelledby` 关联
- `disabled` 保持当前展开状态，原生禁用 trigger 并阻止切换与 `onOpenChange`；根输出 `aria-disabled="true"` 与 `data-disabled`，面板内容仍可交互

## 关联

- 面板组派生（单开/多开手风琴）见 `components/accordion.md`
