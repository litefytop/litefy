# ToggleGroup 骨架（app/ui/components/toggle.tsx）

- 职责：多选按钮组，由 `Toggle` 组装（import 自 ./toggle）。

## 行为 / 状态

- 导出 `ToggleGroup` 与 `ToggleOptionConfig`；`options` 项为 `{ label: ReactNode, value, disabled?, className? }`（label 放宽 ReactNode，可携图标片段），逐项渲染 `Toggle`；容器 div 透传剩余 props 与 `className`
- 组值是多选数组：`value` 受控 / `defaultValue` 非受控（默认 `[]`）；点击按值增删（保持顺序），回调 `onChange(values)`
- `disabled` 组级与项级取或并透传按钮原生 disabled；单项 className 取 `option.className ?? itemClassName`
- 禁用遵循 `ui/schemes.md` 第 8 条：皮肤按 `disabled || option.disabled` 逐项完整替换按钮正常类串，保留布局并移除 hover/active 与选中色；独立 Toggle 同样按 disabled 完整替换
- 无 roving tabindex 与方向键处理，Tab 顺序即按钮顺序；容器不声明 role
- 槽位：无
