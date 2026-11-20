---
name: delivery
description: 任何代码或文档改动前调用——蓝图先行，按域分支施工，门禁后逐环交付（demo→文档→双语门禁）。合并原 blueprint / ui-source-workflow / ui-docs-workflow / guide-workflow / batching；UI 约束法则见 ui-rules，结构落位见 file-map，新增风格见 new-scheme。
---

# 交付链（改了上游就逐环检查下游，不许只改一环）

1. 蓝图先行：开工前读 `references/blueprint.md`，按域判定找 `.agents/blueprints/` 对应蓝图；无蓝图先补域定义再建文件。源码改动先把目标态写进蓝图经用户同意，施工中蓝图只读。
2. 域分支施工：
   1. UI 库源码（components / skins / utils，不含 schemes）→ `references/ui-source.md`
   2. 组件/utils 文档与 demo（content/docs/component、utils，app/demos）→ `references/ui-docs.md`
   3. 指南页（content/docs 根目录六篇正文）→ `references/guide.md`
   4. 新增风格（schemes 第三套起）→ 转 new-scheme 技能
3. 门禁：源码 `pnpm types:check` 零警告（内含 tsc 与 check-blueprint-sync / check-doc-format / check-ui-css 三道脚本门禁）+ lint 零警告；双语 `node scripts/check-i18n-sync.mjs`；交付不跑 build（翻译攒批会拦 build）。
4. 源码门禁通过后必须走 `references/ui-docs.md` 交付 demo/文档，禁止跳过或绕开手写。
5. 攒批判定：改中文文档只移出白名单不翻译，发布前一次性同步；一次性修复当场修——细则 `references/batching.md`。

# 参考文件（按触发条件读，不凭记忆）

1. `references/blueprint.md`——任何改动前读：域划分、三层目录、命名与写法
2. `references/ui-source.md`——写改 UI 源码前读：源码律、门禁、维护链
3. `references/ui-docs.md`——写改 demo/文档前读：格式路由与维护链
4. `references/guide.md`——维护指南页前读
5. `references/batching.md`——判定攒批 vs 当场修时读
6. `references/skin-rules.md`——写改任何皮肤串前读：通用外观律（含间距层级、宽度车道、光学修正）
7. `references/typography.md`——定字号 / 行高 / 字距 / 行宽、写中文正文前读
8. `references/motion.md`——定时长 / 缓动、写过渡与动画前读
9. `references/decoration.md`——写渐变背景 / 光晕 / 着色器 / 动态背景前读
10. `references/doc-format.md` / `demo-format.md` / `i18n-gate.md`——写正文 / 写 demo / 双语门禁时读

# 最小示例

按钮皮肤改动一条过：blueprint 定蓝图 → ui-source 施工（皮肤读 skin-rules）→ 门禁零警告 → ui-docs 改 demo/文档 → i18n-gate 登记白名单。