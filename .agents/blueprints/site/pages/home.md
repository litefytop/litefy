# 首页路由（routes/home.tsx ↔ /:lang）

- hero 右栏固定为当前车道的 showcase 预览卡：模板取 `findStyleTemplateByPath(pathname)`，`ShowcaseCard` 单卡直渲（不轮播、无翻页器），整卡链向本车道 showcase 页；其他方案的发现走外壳 StyleSelect 与 styles 文档页，首页不承载。
- hero 双 CTA：primary 查看组件 → 本车道 `/docs/overview`，outline 阅读文档 → 本车道 `/docs`；两链经 `toSchemeHref` 保留车道前缀。
- 语言守卫（SPA 模式 `ssr: false`，直连未预渲染路径时 loader/clientLoader 不参与首屏水合，守卫落在组件内）：`:lang` 段命中方案前缀（`SCHEME_PREFIXES` 存带斜杠形态 `/neo`，与 `:lang` 段比较需去斜杠）时挂载后 `navigate` 重定向进该车道站点默认语言首页（`/neo` → `/neo/zh`，replace）；未知语言钳到站点默认语言（中文）渲染，合法语言原样；meta 的 canonical 与 og:locale 使用钳制后的语言
