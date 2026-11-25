# Separator 骨架（app/ui/components/separator.tsx）

- 职责：横向/纵向分隔线，可带居中文本。

## 行为 / 状态

- 导出 `Separator`、`SeparatorLine`、`SeparatorText`；`orientation` 默认 `horizontal`
- 无 children：只渲染一条 `SeparatorLine role="separator"`，`flex: none` 不参与撑满
- 有 children：外层 `div role="separator"`，`display: flex; alignItems: center`，中缝 `SeparatorText`（`white-space: nowrap`），两侧各一条线；两条线共用 `classNames.line` / `styles.line`
- 方向布局：水平 `flexDirection: row`（线 `flex: 1`），垂直 `flexDirection: column` + `alignSelf: stretch`（线 `alignSelf: stretch`）；线一律 `flexShrink: 0`
- `SeparatorLine` 内联样式以方向默认值为底、调用方 `style` 覆盖；方向外观由皮肤按 orientation prop 选串解析，骨架不发方向标记
- 槽位：`classNames: line / text`；`styles: line / text`
