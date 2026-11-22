# SegmentGroup 骨架（app/ui/components/segment-group.tsx）

- 职责：分段选择控件，单选按钮组，方向键跟随焦点选中；由 `Segment` 组装（import 自 ./segment）。

## 行为 / 状态

- 导出 `SegmentGroup` 与 `SegmentOptionConfig`；`SegmentOptionConfig` 为 `{ label, value, disabled?, className?, style?, attrs? }`——`style` 与 `attrs` 是运行期逐项值的通道（内联自定义属性 / data-* 锚定），逐项渲染 `Segment`
- `SegmentGroup`：容器 `role="radiogroup"`，剩余 props 透传（含 `aria-label`）；组值 `value` 受控 / `defaultValue` 非受控；点选同值直接返回（不回调），否则非受控落状态并 `onValueChange`
- roving tabindex：选中且未禁用项为 0；无有效选中时首个未禁用项为 0；其余 -1
- 键盘在容器 `onKeyDown` 统一处理：在未禁用项间循环，`ArrowRight|ArrowDown` 前进、`ArrowLeft|ArrowUp` 后退、`Home|End` 跳首尾；`preventDefault` 后聚焦并立即选中
- `disabled` 组级与项级取或；单项 className 取 `option.className ?? itemClassName`
- 槽位：无
