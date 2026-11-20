# 路由

1. `content/docs/**/_meta.ts`——文档结构（导航即目录），查结构直接读 _meta.ts
2. [./doc-format.md](./doc-format.md)——写/改正文前读：文档书写格式
3. [./demo-format.md](./demo-format.md)——写/改 demo 前读：demo 格式
4. [./i18n-gate.md](./i18n-gate.md)——修改文档正文、补译双语、发布前检查时读

# 组件维护链

改动通常是一条链，改了上游就要逐环检查下游，不许只改一环：

源码流（ui-source.md）→ demo（行为变了改 basic，外观变体变了改 variants）→ 文档正本（API/行为变了改中文，英文攒批同步，见 i18n-gate）→ 格式门禁（`node scripts/check-doc-format.mjs`，用法节一行概括）→ 双语门禁（`node scripts/check-i18n-sync.mjs`，白名单外有 zh 或缺语言文件即不过；交付不跑 `pnpm build`）