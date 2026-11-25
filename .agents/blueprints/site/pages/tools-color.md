# 颜色工具（routes/tools-color.tsx · routes/tools-color-view.tsx · routes/neo-tools-color.tsx · routes/flat-tools-color.tsx · routes/neon-tools-color.tsx）

- 四条车道同页：minimal 走 `/:lang/tools/color`，neo-brutalist 走 `/neo/:lang/tools/color`，flat-minimal 走 `/flat/:lang/tools/color`，neon-gradient 走 `/neon/:lang/tools/color`；页面主体只在 `tools-color-view.tsx` 一份，每道一个薄路由文件（同 `docs-view.tsx` 与 `neo-docs.tsx` 的分工形）。
- 薄路由文件只做三件事：link 本道唯一样式入口（minimal `app/global.css`、neo `routes/neo-site.css`、flat `routes/flat-site.css`、neon `routes/neon-site.css`，一页只加载一个方案）、挂 `SiteSkinProvider`、给出带车道前缀的 canonical；主体不重复实现，也不在各道分支判定车道。
- 两项能力：前景色按透明度对背景色合成并给出实际颜色；文字色与背景色按 WCAG 计算对比度并标注 AA / AAA / UI 通过项。
- **纯颜色输入**：每个颜色槽 = 原生取色器（`input[type=color]`）+ 文本框双向同步，取色器侧固定 HEX；文本框接受可解析的 CSS 颜色——HEX、`rgb()`、`hsl()`、`lab()`、`lch()`、`oklab()`、`oklch()`、`color(srgb…)`（解析与色彩空间转换正本在 `app/lib/color.ts`，lab / lch 为 CIE Lab → XYZ D50 → Bradford 适配到 D65 → 线性 sRGB，超出色域钳制；`none` 分量按 0 处理）；不接受 `var()` / `color-mix()`。透明度对「背景色」字段合成；对比度对 alpha 颜色按白色合成。
- **令牌模块**（独立整宽卡片，置于双卡之下）：枚举当前车道方案 22 枚颜色令牌，芯片 = 色板（直接 `var(--…)` 引用，零解析）+ 令牌名 + **原值**（`getComputedStyle` 读 `--…` 原文，如 `oklch(…)` / `color-mix(…)`，不转 HEX），点击复制原值——取代在工具字段里手填令牌的工作流。
- 页面用 `HomeShell` + `SiteSkinProvider`，文案与标题随路由语言；`meta` 的 canonical 随车道前缀（`/neo/zh/tools/color` 形），语言切换与返回文档链接经 `toSchemeHref` 留在本道。
- 排版：左对齐页头（`text-2xl` 标题 + 一行副标题，不居中）；内容容器 `max-w-288` 居中、上下留白 `py-8`；双卡 `lg:grid-cols-2` 桌面并排、移动端纵叠（`items-start`）。
- 合成卡：字段行（前景色 + 背景色 `sm:grid-cols-2` 同行）→ 透明度行（`w-24 shrink-0` NumberInput + `flex-1` Slider 同行，显式 `orientation="horizontal"`、常显值隐藏）→ 结果条（`size-14` 大色板 + HEX/RGB 两行 mono + 右侧复制 / 填入按钮，`bg-surface` 条）。
- 对比卡：字段行（文字色 + 背景色同行）→ 预览条（两色的**有效色**内联渲染：示例文字 + 右侧大号比值）→ 通过徽章行（徽章自带阈值与 ✓/✗，无图例段）。
- 卡内纵向节奏经 `classNames.inner` 整体换串施加（Card 的 `className` 落在外壳、内容承载在 inner 槽——gap 写在 Card 上无效；换串会连默认串一起替换，Card 自带内间距须随串带回）：`flex flex-col gap-6 p-4`。
- 复制反馈统一走本地成功态，不用 toast，Button 组件零改动：结果条 HEX 复制钮显式传 `icon={<Copy/>}`，复制成功原位换成 check 徽标（success 背景圆底 + success-fg check，纯消费方组合复用 icon 槽）；令牌芯片复用 Button（`data-variant="outline"`），色板 span 作 `icon` 传入、令牌名 + 原值作 children 直渲，复制成功 status 槽以同尺寸 check 徽标（success 圆底）原位替换色板，令牌名与原值零位移；各复制钮挂 sr-only `role="status"` 播报复制结果，成功徽标 3 秒收回。
- 文字色配对（`site/shell/contrast.md`）：页头、字段标签、卡片说明与令牌说明位于画布，读 `foreground`；HEX/RGB 结果条铺 `bg-surface`，整条配 `text-surface-fg`；条内 outline 按钮保留自己的 `bg-background text-foreground`。
