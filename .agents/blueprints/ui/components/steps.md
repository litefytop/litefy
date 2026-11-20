# Steps 骨架（app/ui/components/steps.tsx）

- 职责：步骤条，按序号派生完成/当前/未到状态并支持点击跳转。

## 行为 / 状态

- 导出 `StepsRoot` / `StepsItem` / 组合 `Steps`；`StepsRoot` 为 `<ol data-orientation>`，orientation 默认 `horizontal`；不探测容器宽度，方向只由 prop 决定
- `Steps` 纯受控：`items[{ title, description?, content? }]` + `index`；`maxIndex` 默认末项，点击可选项时回调 `onChange(nextIndex)`
- 状态派生：`i < index` 为 completed（其中最后一项为 finished——全部走完的终点强调）、`i === index` 为 current、其余 upcoming；`li` 在 current 时 `aria-current="step"`，恒带 `data-state` 与 `data-orientation`
- 方向发布：connector / texts / title / description / body 恒带 `data-orientation`——皮肤横竖两套类键在槽位节点自身元素上键控，缺该属性则方向类全失效（连接线零宽不可见的教训）；marker / rail 无方向类不发
- 可点击条件 `i <= maxIndex && i !== index`；marker 恒为 `<button type="button" disabled={!clickable}>`，点击回调 `onSelect(index)`；completed / finished 显示 Check（`aria-hidden`），否则显示 `index + 1`
- 标题在 clickable 时为 button，否则为 span，两种形态都带 `data-state`；clickable 版本另带 `data-clickable`
- 布局分支（按运行期解析的方向）：horizontal 的连接线排在 marker 之前；vertical 用 rail 包裹 marker 与连接线，texts 带 `data-connector`，标题与描述纵向堆叠
- 连接线由父级按位置传入：horizontal 为 `i > 0`、vertical 为 `i < items.length - 1`；元素 `aria-hidden` + `data-state` + `data-orientation`
- `content` 只渲染在 current 项并落入 body div；`description` 为 falsy 时不渲染
- 样式合并：`li` 的 className 为 `className + classNames.item`，style 为 `styles.item` 被外部 `style` 覆盖；其余节点只取槽位
- 槽位：`classNames` 与 `styles` 同键：item / marker / rail / connector / texts / title / description / body
