# Segment 骨架（app/ui/components/segment.tsx）

- 职责：分段选择的原子件，`role="radio"` 的按钮部件，供 SegmentGroup 组装，不独立成件。

## 行为 / 状态

- 导出 `Segment`：`button` + `role="radio"`，输出 `aria-checked`；`checked` 必须由外部提供，自身零状态
- `style` 与 `attrs` 透传是运行期逐项值的通道（内联自定义属性 / data-* 锚定），骨架零外观不改
- 槽位：无
