# Sidebar 骨架（app/ui/components/sidebar.tsx）

- 职责：侧栏容器：开关状态与命令式开关控制。

## 行为 / 状态

- 单件导出 `Sidebar`（`aside`）；`open` 受控 / `defaultOpen = true` 非受控，内部值只在非受控时写入，`onOpenChange` 每次 `setOpen` 都回调
- 常驻 `data-open="true|false"`；原生 aside 属性透传，`open` / `className` / `ref` 从原生类型剔除后重新声明
- `ref` 暴露 `SidebarHandle`：`toggle` / `open` / `close` 均走同一 `setOpen`（受控下只外抛回调），`isOpen` 为当前值
- 骨架不含 Escape、遮罩、焦点陷阱与滚动锁
- 槽位：无
