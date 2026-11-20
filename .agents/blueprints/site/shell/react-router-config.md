# 站点路由与预渲染（react-router.config.ts）

- SPA 模式（`ssr: false`）+ 预渲染：进 `paths` 的每条路径在 `build/client/<路径>/index.html` 落一份静态 HTML，未命中的路由回退 `__spa-fallback.html` 客户端渲染。
- 四条车道同规则入 `paths`，不出现单案特殊待遇：
  1. 文档树全量预渲染：minimal、neo-brutalist、clinical、neon-gradient 各自的 `/[前缀/]:lang/docs` 首页与每篇 `content/docs/**/*.mdx` 对应的 `/[前缀/]:lang/docs/<slug>`——clinical 与 neon-gradient 与 neo-brutalist 同待遇
  2. 车道首页路由存在即预渲染：minimal `/:lang`、neo-brutalist `/neo/:lang`（clinical、neon-gradient 无首页路由，天然缺席）
  3. showcase 车道页（四案 `/[前缀/]:lang/showcase/:slug`）不预渲染，走 SPA 回退
  4. 站点级页面随 minimal 车道：`/:lang/api/search` 与 llms 三件（`llms.txt` / `llms-full.txt` / `llms.mdx/docs/**`）
- 文档 slug 由文件名推导：`*.zh.mdx` 归 zh 车道、默认 en；`index.mdx` 吃目录路径；同一篇文档同时产出 minimal 与三个风格车道共四份预渲染页。
