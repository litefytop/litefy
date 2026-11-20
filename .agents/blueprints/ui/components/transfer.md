# Transfer 骨架（app/ui/components/transfer.tsx）

- 职责：左右双面板的穿梭选择，带选中计数与批量移动。

## 行为 / 状态

- `dataSource` 项 `{ label, value, disabled? }`；按 `value` 集合拆成左侧（未选）与右侧（已选），两侧都保持 `dataSource` 原顺序
- 值双模：`value` 受控，或 `defaultValue`（默认 `[]`）非受控；`onChange(next)` 两种模式都回调
- 两侧各自维护勾选集合（内部非受控），移动后清空对应侧勾选
- 右移：原已选 + 左侧勾选项按 `dataSource` 顺序重建；左移：从值中剔除右侧勾选项
- 面板：标题（`titles` 的 ReactNode 直渲，无包装节点；缺省标题由皮肤提供）+ 计数 `勾选数/总数` + 列表；列表为空渲染 `p` 文案 "No data"
- 项为 `Checkbox`：`checked` 取自勾选集合，`disabled` 透传项配置，内容走 `renderItem(item)`，缺省 `label`
- 动作钮为原生 `button type="button"`：`aria-label` 取 `moveRightLabel` / `moveLeftLabel`（缺省 "Move right" / "Move left"），对应侧无勾选时 `disabled`；图标 `ArrowRight` / `ArrowLeft` 带 `aria-hidden`
- 槽位：`classNames: panel / header / count / body / empty / actions / move` 与 `item`（`CheckboxClassNames`）；`styles: panel / header / body / actions`，`item` 落到 Checkbox label
