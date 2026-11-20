# 维护链

1. 日常维护：按 `.agents/blueprints/content/guide.md` 修改中文与业务组件 → 同步导航 → 更新双语白名单 → 局部验证；其余问题当场修，不攒批。
2. 验收：dev 自测（布局、双语回链、控制台无报错）+ `node scripts/check-i18n-sync.mjs`；翻译攒批会让该门禁拦住 build，所以交付不跑 `pnpm build`，完整构建只在发布前跑。
3. 双语白名单细则见 i18n-gate.md（全站同一白名单机制）。
4. 交互元素放 `app/components/`，其蓝图按层见 `.agents/blueprints/site/`（壳层 `shell/`、正文内联件 `widgets/`、功能页 `pages/`）；公开 hook 与组件源码单独走 ui-source.md，不混入文档站提示或路由。
5. 新增/删改页面或分组 → 同步对应目录 `_meta.ts`（中英标题一体）。