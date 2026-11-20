---
name: file-map
description: AI 需要了解项目结构、判断新文件落位、找某个职责归属时调用
---

# 结构原则

1. 主应用 = 文档站 + UI 库，同居 `app/`
2. UI 库走 shadcn 式源码分发，正本留 `app/ui/`，不进 `packages/`
3. `packages/` = 需要隔离依赖的分发单元

# 目录

1. `app/` — 文档站与组件库的全部源码
   1. `app/ui/components/` — 无头组件骨架：零样式，只发逻辑 `data-*` 与 aria
   2. `app/ui/skins/` — 皮肤正本：全部组件一份类串，方案只切 token
   3. `app/ui/schemes/<slug>/` — 方案包：只有 `index.css` 与 `design.md`（设计语言正本，中英两份，英文攒批翻译）
   4. `app/ui/utils/` — 无头 hooks 与工具
   5. `app/components/` — 文档站业务壳
   6. `app/demos/` — 组件示例，文档代码块唯一来源
   7. `app/routes/` — 路由模块，每条车道只 link 自己的样式入口
   8. `app/lib/` — 文档站共享工具（i18n、seo、clipboard、demo-table 等）
   9. `app/llms/` — llms.txt 路由模块
   10. `app/styles/` — 业务层 CSS：reset、shiki、site
   11. `app/assets/` — 静态资源（logo、showcase 图）
   12. `app/generated/` — 生成物，不手改
2. `content/docs/` — 双语文档 mdx：根目录为指南页与总览，`component/` 与 `utils/` 为各自 API 文档；`_meta.ts` 管导航，`sync.json` 记录双语同步白名单
3. `packages/cli/` — npm 包 `litefy` 分发正本；用法见 `packages/cli/readme.md`
4. `scripts/` — 仓库自有脚本，逐文件见下节
5. `.agents/blueprints/` — 蓝图正本；域划分、三层目录与命名规则见 delivery 技能 blueprint 参考
6. `.agents/skills/` — 技能正本（`.agents/skills/<name>/SKILL.md`），遵循 `.agents/skills` 开放标准目录约定
7. `temp/` — 工作区，永不提交；AI 应开发者要求生成的讨论、交接等临时文档一律放这里

# scripts/ 逐文件

1. `copy-registry.js` — 扫描 `app/ui` 生成 `packages/cli/registry.json`，prebuild 第一步
2. `build-page-trees.mjs` — 扫描 `content/docs` 生成 `app/generated/page-trees.ts`，文档导航数据
3. `check-i18n-sync.mjs` — 挂 prebuild，拦截未同步双语的文档
4. `check-doc-format.mjs` — 用法节一行概括与 demo 根容器居中门禁，挂 prebuild 与 types:check
5. `check-blueprint-sync.mjs` — 组件蓝图与骨架导出同步门禁，挂 types:check（源码导出未在蓝图点名即失败）
6. `check-ui-css.mjs` — UI 库 class 冗余门禁，挂 types:check（重复 token、无效 relative、冗余 display、无意义 cn 拆分）
7. `security-audit.mjs` — `cli:publish` 的前置安全检查
8. `sync-sources.mjs` — 经 `cli:sync` 把 registry 指向的仓库源文件镜像进 `packages/cli/sources`，CLI 离线安装兜底

# 落位与维护

1. 先查目录职责表：哪个目录管这件事，文件就放哪
2. 主应用代码进 `app/` 对应子目录；分发物进 `packages/`
3. 新技能进 `.agents/skills/<name>/SKILL.md`，正本唯一，不放别处
4. 新文件能被目录职责 + 文件名推断：不改本文件
5. 推断不出来：在对应目录行下补一句
6. `scripts/` 新增脚本：必须同时补逐文件一节
