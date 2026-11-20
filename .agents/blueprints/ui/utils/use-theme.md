# useTheme 明暗主题（app/ui/utils/use-theme.ts）

1. 职责：文档站明暗主题的公开 hook：`light` / `dark` / `system` 三态 + `toggleTheme`；外观面板「外观」节读写它。
2. 落地：把 `dark` 类写到根元素并同步根 `colorScheme`（原生控件跟随）；`system` 跟随 `prefers-color-scheme` 并监听其变化实时切换。
3. 持久化：键 `theme-storage`，模块级 store 经 `useSyncExternalStore` 订阅；服务端快照恒 `light`，挂载后读存储并立即应用（模块求值时完成，不闪暗）。
4. 不改系统设置；读写只动根元素类与 colorScheme，不碰方案令牌。
5. 消费方：外观面板（site/shell）、showcase 头部控件；安装与 API 正本为 `content/docs/utils/use-theme.zh.mdx`。
