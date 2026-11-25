# Steps 骨架（app/ui/components/steps.tsx）

- 职责：步骤条，按序号派生完成/当前/未到状态并支持点击跳转。

## 行为 / 状态

- 导出 `StepsRoot` / `StepsItem` / 组合 `Steps`；`StepsRoot` 为 `<ol>`，`StepsItem` orientation 默认 `horizontal`；不探测容器宽度，方向只由 prop 决定
- `Steps` 纯受控：`items[{ title, description?, content? }]` + `index`；`maxIndex` 默认末项，点击可选项时回调 `onChange(nextIndex)`
- 状态派生：`i < index` 为 completed、`i === index` 为 current、其余 upcoming；`li` 在 current 时 `aria-current="step"`，恒带 `data-state`
- 方向外观：connector / texts / title / description / body 的方向类由皮肤按 orientation prop 选串解析后经槽位下发，骨架不发方向标记；marker / rail 无方向类
- 可点击条件 `i <= maxIndex && i !== index`；marker 恒为 `<button type="button" disabled={!clickable}>`，点击回调 `onSelect(index)`；completed 显示 Check（`aria-hidden`），否则显示 `index + 1`
- 标题在 clickable 时为 button，否则为 span，两种形态都带 `data-state`；clickable 版本另带 `data-clickable`
- 布局分支（按运行期解析的方向）：horizontal 的连接线排在 marker 之前；vertical 用 rail 包裹 marker 与连接线，texts 带 `data-connector`，标题与描述纵向堆叠
- 连接线由父级按位置传入：horizontal 为 `i > 0`、vertical 为 `i < items.length - 1`；元素 `aria-hidden` + `data-state`
- `content` 只渲染在 current 项并落入 body div；`description` 为 falsy 时不渲染
- 样式合并：`li` 的 className 为 `className + classNames.item`，style 为 `styles.item` 被外部 `style` 覆盖；其余节点只取槽位
- 槽位：`classNames` 与 `styles` 同键：item / marker / rail / connector / texts / title / description / body
- `classNames.marker/title` 为 `SlotClassName`（string 或 `(state: SlotState) => string | undefined`），状态为 `{ disabled: !clickable }`；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：不可点击 marker 原生 disabled，标题降为 span；皮肤完整替换 marker/title 正常类串，移除 hover/active 类并显式禁用色与 `cursor-not-allowed`
