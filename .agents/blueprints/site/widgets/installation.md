# 组件页安装卡（app/components/installation.tsx · Installation）

- 固定比例容器：`aspect-square md:aspect-video`、`overflow-hidden rounded-xl border`，移动 1:1、桌面 16:9。
- 面板 `min-h-0 flex-1 overflow-hidden`，不内滚；content 槽经覆盖通道去内边距与圆角（`p-0 rounded-none`）——固定卡内嵌文件浏览器，页签不需要默认间距。页签用 Tabs 默认卸载，标签居中。
- 唯一滚动条归手动页签源码预览的 CodeStage 内部（`code-stage-scroll`）：`Source` 传 `min-h-0 flex-1 h-auto max-h-none` 撑满剩余卡高，预览码区 `overflow-hidden` 不滚、CodeStage 取消 4:3 定窗撑满码区单内滚；禁面板、源码区与 CodeStage 连续出现双滚动条。
- 两个页签：CLI 用 `PackageManagerTabs` 渲染 `litefy@latest add <name> -s <scheme>`；手动用 `Source` 展示组件源码。
- Tabs 默认皮肤不在本卡改动（通用文档页签仍需 `p-4` 与内滚），本卡经 `classNames` / `panelClassName` 覆盖通道定制。
