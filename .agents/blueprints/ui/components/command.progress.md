# ui/components/command.md 施工进度

- 已完成：蓝图定稿（移除组级 disabled：触发器禁用 + open 强制 false 一并去除；条目级 disabled 保留）
- 进行中：`app/ui/components/command.tsx` 去组级 disabled；demo 改条目级（对齐 menu 整组禁用 + inert 模式）；zh.mdx 同步
- 临时清单：改后 `pnpm types:check` + lint + class-length + dev 实测 `[inert]` 光标；完工删除本文件
