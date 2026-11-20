# Neon Showcase 门面页（app/routes/neon-showcase.tsx）

- 路由：`/neon/:lang/showcase/neon-gradient`，neon-gradient 风格模板的门面页；自有 Tailwind 入口 `neon-showcase.css`（方案主题层 + 共享 skins 车道 + 本路由与关联组件源码扫描）

## 页面结构

- chrome：页头（NEON 品牌、色盘/交互/排版/规则锚点导航、外观面板、EN 切换）与页脚，随站点 `.dark` 日/夜切换整页实时重刷
- hero：单列——eyebrow、模板名标题、lead、双 CTA（锚 `#palette`、链 `/neon/:lang/docs`）、四格 stats
- 调色板节（`#palette`）：palette-section 组件，纯 DOM 令牌色板，一次只呈现当前档，随外观面板日/夜切换实时翻转
- 其余节（交互 / 排版 / 规则）维持既有陈列
- 页面不写死任何色值，色值全部由方案令牌回答

## 明确不做

- hero 不设标本卡、不使用 iframe（与其他风格模板门面页一致；同屏双档陈列取消）
