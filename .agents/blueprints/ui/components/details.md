# Details 骨架（app/ui/components/details.tsx）

- 职责：原生 `<details>` 披露件薄壳，无状态、无 JS 行为——展开/收起与互斥全部交给浏览器原生机制；是折叠面板/手风琴之外的可选轻量扩展，可与两者并存组合。

## 行为 / 状态

- 导出 `Details`：根 `<details>` 原生属性全透传（含 `name` 原生互斥分组、`open`、`onToggle`），不拦截不改写；无 `open` / `onOpenChange` 状态 API
- `<summary>` 触发行槽：`label` 文字槽 + icon 盒（骨架自有 `span`，`aria-hidden`）；icon 缺省 `ChevronDown`，`icon={null}` 不渲染 icon 盒；槽位 `summary / icon / body`
- `body` 槽：内容容器 `div`，承载内边距与上分隔，避免样式顶开原生内容盒
- 键盘（Enter / Space）与无障碍语义由原生元素自答，骨架不接管
