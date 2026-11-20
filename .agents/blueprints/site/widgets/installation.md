# 组件页安装卡（app/components/installation.tsx · Installation）

- 固定比例容器：`aspect-square md:aspect-video`、`overflow-hidden rounded-xl border`，移动 1:1、桌面 16:9。
- 面板 `min-h-0 flex-1 overflow-y-auto` 内滚；页签用 Tabs 默认卸载，标签居中。
- 两个页签：CLI 用 `PackageManagerTabs` 渲染 `litefy@latest add <name> -s <scheme>`；手动用 `Source` 展示组件源码。
