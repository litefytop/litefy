# Switch 骨架（app/ui/components/switch.tsx）

- 职责：开关，checkbox 语义加 track / thumb 两层状态标记。

## 行为 / 状态

- 导出 `Switch` 与基础件 `SwitchRoot`（`input[type=checkbox]`）/ `SwitchTrack`（span）/ `SwitchThumb`（span）/ `SwitchLabel`（label）
- `SwitchTrack` 与 `SwitchThumb` 把 `checked` 输出为 `data-checked`（假值不输出），供皮肤区分开 / 关
- `Switch` 结构：label（`classNames.label` / `styles.label`）→ track（`classNames.track` / `styles.track`）→ input（`classNames.input`）+ thumb（`classNames.thumb` / `styles.thumb`）；children 作为文本置于 track 之后
- `checked` 受控，否则内部状态（`defaultChecked` 默认 false）；`onChange` 由内部接管，只回调 `onCheckedChange(next)`，外部 `onChange` 不触发
- `disabled` 落到 input；label 包裹 input 形成隐式关联，其余 props 透传 input
- 槽位：`classNames: label / track / thumb / input`；`styles: label / track / thumb / input`
