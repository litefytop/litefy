# ToggleGroup 骨架（app/ui/components/toggle-group.tsx）

- 职责：多选按钮组，由 `Toggle` 组装（import 自 ./toggle）。

## 行为 / 状态

- 导出 `ToggleGroup` 与 `ToggleOptionConfig`；`options` 项为 `{ label: ReactNode, value, disabled?, className? }`（label 放宽 ReactNode，可携图标片段），逐项渲染 `Toggle`；容器 div 透传剩余 props 与 `className`
- 组值是多选数组：`value` 受控 / `defaultValue` 非受控（默认 `[]`）；点击按值增删（保持顺序），回调 `onChange(values)`
- `disabled` 组级与项级取或；单项 className 取 `option.className ?? itemClassName`
- 无 roving tabindex 与方向键处理，Tab 顺序即按钮顺序；容器不声明 role
- 槽位：无
