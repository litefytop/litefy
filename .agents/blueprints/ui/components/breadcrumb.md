# Breadcrumb 骨架（app/ui/components/breadcrumb.tsx）

- 职责：面包屑：`items` 数据驱动的层级导航链。

## 行为 / 状态

- 导出原子件：`BreadcrumbRoot`（`nav` + `aria-label="breadcrumb"`）、`BreadcrumbList`（`ol`）、`BreadcrumbItem`（`li`）、`BreadcrumbLink`（`a`）、`BreadcrumbPage`、`BreadcrumbSeparator`
- `BreadcrumbPage` 自带 `aria-current="page"` + `aria-disabled="true"` + `role="link"`
- `BreadcrumbSeparator` 为 `li[aria-hidden][role=presentation]`，默认渲染 `ChevronRight` 图标（`classNames.icon` 槽位），传 `children` 则整体替换
- 组合 `Breadcrumb`：`items`（`{label, href?}`）逐项渲染，末项为 `BreadcrumbPage`、其余为 `BreadcrumbLink`，项间插入 `BreadcrumbSeparator`；React key 取 `` `${item.href ?? ""}:${item.label}` ``（href + label 组合，避免同 href 项重复）
- 槽位：`classNames.list/item/link/page/separator/separatorIcon` 与同名 `styles`（`separatorIcon` 仅 classNames）
