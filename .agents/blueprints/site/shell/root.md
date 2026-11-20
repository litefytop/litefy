# 根路由模块（app/root.tsx）

- Layout：`<html lang>` 缺省站点默认语言（见 i18n 蓝图）；`<BrowserSupportGate>` 内包 `<Suspense fallback={<HydrateFallback />}>` 兜路由模块懒加载的 Suspense 窗口
- 路由模块导出 `HydrateFallback`，复用 `app/components/hydrate-fallback.tsx` 骨架屏：四条 docs 路由（docs、neo-docs、neon-docs、clinical-docs）`clientLoader.hydrate = true`，router 水合未初始化窗口期渲染骨架屏，不出现空白与框架默认开发者警告；无 hydrating loader 的路由不受影响
- serverMiddleware：首个路径段既非语言又非方案前缀的路径回 404；`/:lang/docs/**.md` 重定向 `/:lang/llms.mdx/docs/**/content.md`
- ErrorBoundary：错误信息 + 返回所在车道首页链接
