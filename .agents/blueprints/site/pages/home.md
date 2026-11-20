# 首页路由（routes/home.tsx ↔ /:lang）

- 语言守卫（SPA 模式 `ssr: false`，直连未预渲染路径时 loader/clientLoader 不参与首屏水合，守卫落在组件内）：`:lang` 段命中方案前缀（`SCHEME_PREFIXES` 存带斜杠形态 `/neo`，与 `:lang` 段比较需去斜杠）时挂载后 `navigate` 重定向进该车道站点默认语言首页（`/neo` → `/neo/zh`，replace）；未知语言钳到站点默认语言（中文）渲染，合法语言原样；meta 的 canonical 与 og:locale 使用钳制后的语言
