# 文档搜索（app/components/docs-search.tsx）

- 层：界面域·壳层——侧栏搜索入口、顶栏搜索入口、搜索对话框与 Ctrl K 快捷键；搜索索引路由归 `app/routes/`，对话框外观由皮肤 Command 承担。
- `DocsSearchTrigger` 三槽恒排：搜索图标、文字标签、键帽（`kbd` 工具类）。键帽挂 `pointer-coarse:hidden`（触屏无快捷键，恒隐）；文字标签默认任何断点显示。
- `compactOnMobile` prop：仅顶栏调用传入——文字标签与键帽 <sm 隐藏，按钮由调用方类收成 44×44 图标态（`max-sm:aspect-square max-sm:justify-center max-sm:px-0 sm:w-64`）；侧栏与抽屉不传，任何断点图标+文字完整。压缩态是消费方决策，不进键帽与触发器默认态。
- 文案随 `locale` 双语（aria-label 与 title 同步）；`useSearchHotkey` 全局监听 Ctrl/Cmd+K，输入件聚焦时不拦截（与浮导航同一约定）。
