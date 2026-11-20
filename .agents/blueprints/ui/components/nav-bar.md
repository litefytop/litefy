# NavBar 骨架（app/ui/components/nav-bar.tsx）

- 职责：横向导航条：网格等宽条目 + 溢出收进 More 下拉菜单；溢出检测与隐藏计数在骨架（行为几何）。

## 行为 / 状态

- 根 `nav`：flex 行 + 固定间距 `0.25rem`（内联布局），条目以 `data-nav-index` 标记，`renderItem` 透传渲染
- 溢出测量：每次渲染与 ResizeObserver 触发——条目 `flex: none` 不收缩、自然宽即可读，按可用宽（扣除 More）从头累计可见数；超出者 `display: none` 并计数到 More 面板；可见数不变则跳过 setState
- `more`：More 触发钮文案，**缺省 `more`**（可传本地化文案如「更多」）；全部可见时隐藏；样式（文字钮）归皮肤
- 面板：PopoverContent（x 轴自由，placement 默认 bottom-end）——渲染 `items.slice(shown)`，条目为容器 div（`renderItem` 内容由消费方提供，通常是可聚焦链接），容器点击按 `closeOnSelect`（默认 true）关面板；键盘等价路径由内容自带（链接聚焦、Enter 触发 click 冒泡到容器关面板）；`open` / `onOpenChange` 可控
- 槽位：`classNames: root / item / more / panel`；`styles` 同名（root 为栅格与对齐、item 为条目盒）
