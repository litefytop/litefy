# Group 骨架（app/ui/components/group.tsx）

- 职责：横向紧凑链接的兄弟控件簇：容器只管结构与分组语义，连接外观归皮肤。

## 行为 / 状态

- 导出两件：`GroupRoot`（`div role="group"`，消费方传 `role` 可覆盖）、`Group`（组合件，children 原样透传——各子件自带边框与圆角，Group 不替它们渲染零件）
- 无状态、无键盘接管；子件保持各自的焦点环与激活行为
- 槽位：`className` 落容器
