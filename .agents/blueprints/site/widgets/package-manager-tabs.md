# 包管理器命令（app/components/package-manager-tabs.tsx）

- 固定 npm / pnpm / yarn / bun 四行，展示同一条 `litefy` 命令。
- 每行 `$` 在左、命令 `break-all` 换行、复制按钮常驻右侧；复制成功 2 秒内显示对勾。
- 列表在父面板内垂直居中，复制标签随路由语言。
