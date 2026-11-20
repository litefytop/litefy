---
version: alpha
name: Litefy UI — Clinical
description: Design language of the Litefy UI clinical style template — a calm, square-cornered system for enterprise consoles and medical applications. Cool white canvas, pale-sky surfaces, deep-sky brand, 1px hairline boundaries, zero radius, zero shadow. The YAML block is the sole numeric authority for tokens; the prose states rules and destinations.
colors:
  background: 'oklch(99.2% 0.005 236)'
  foreground: 'oklch(17.5% 0.032 243)'
  surface: 'oklch(95% 0.026 236.824)'
  surface-fg: 'oklch(29.4% 0.066 243.157)'
  accent: 'oklch(90.1% 0.058 230.902)'
  accent-fg: 'oklch(29.4% 0.066 243.157)'
  border: 'color-mix(in oklab, oklch(17.5% 0.032 243) 14%, transparent)'
  primary: 'oklch(39.1% 0.09 240.876)'
  primary-fg: 'oklch(99.2% 0.005 236)'
  primary-accent: 'oklch(37.9% 0.078 243.435)'
  danger-fg: 'oklch(39.6% 0.141 25.723)'
  danger: 'oklch(80.8% 0.114 19.571)'
  danger-accent: 'oklch(88.5% 0.062 18.334)'
  info-fg: 'oklch(37.9% 0.146 265.522)'
  info: 'oklch(80.9% 0.105 251.813)'
  info-accent: 'oklch(88.2% 0.059 254.128)'
  success-fg: 'oklch(39.3% 0.095 152.535)'
  success: 'oklch(87.1% 0.15 154.449)'
  success-accent: 'oklch(92.5% 0.084 155.995)'
  warning-fg: 'oklch(42.1% 0.095 57.708)'
  warning: 'oklch(90.5% 0.182 98.111)'
  warning-accent: 'oklch(94.5% 0.129 101.54)'
  dark-background: 'oklch(16.5% 0.03 243)'
  dark-foreground: 'oklch(96% 0.012 236)'
  dark-surface: 'oklch(29.4% 0.066 243.157)'
  dark-surface-fg: 'oklch(90.1% 0.058 230.902)'
  dark-accent: 'oklch(37.9% 0.078 243.435)'
  dark-accent-fg: 'oklch(90.1% 0.058 230.902)'
  dark-border: 'color-mix(in oklab, oklch(96% 0.012 236) 14%, transparent)'
  dark-primary: 'oklch(68.5% 0.169 237.323)'
  dark-primary-fg: 'oklch(16.5% 0.03 243)'
  dark-primary-accent: 'oklch(74.6% 0.16 232.661)'
  dark-danger-fg: 'oklch(39.6% 0.141 25.723)'
  dark-danger: 'oklch(88.5% 0.062 18.334)'
  dark-danger-accent: 'oklch(80.8% 0.114 19.571)'
  dark-info-fg: 'oklch(37.9% 0.146 265.522)'
  dark-info: 'oklch(88.2% 0.059 254.128)'
  dark-info-accent: 'oklch(80.9% 0.105 251.813)'
  dark-success-fg: 'oklch(39.3% 0.095 152.535)'
  dark-success: 'oklch(92.5% 0.084 155.995)'
  dark-success-accent: 'oklch(87.1% 0.15 154.449)'
  dark-warning-fg: 'oklch(42.1% 0.095 57.708)'
  dark-warning: 'oklch(94.5% 0.129 101.54)'
  dark-warning-accent: 'oklch(90.5% 0.182 98.111)'
typography:
  sans:
    fontFamily: 'Inter, system-ui, sans-serif'
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  headline:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.015em
  h1:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.75rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.01em
  h2:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.375rem
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: -0.01em
  h3:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
  h4:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.4
  h5:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.4
  h6:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1rem
    lineHeight: 1.7
  description:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.125rem
    lineHeight: 1.75rem
  label:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.02em
  overline:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.75rem
    fontWeight: 500
    letterSpacing: 0.1em
  code:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.25rem
  table-code:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 0.8125rem
rounded:
  none: 0px
  xs: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  2xl: 0px
  3xl: 0px
  4xl: 0px
  full: 9999px
  pill: 0px
  disc: 0px
spacing:
  base: 0.25rem
  pad-block: 3rem
heights:
  control: 2.75rem
  field: 2.75rem
borders:
  control: 1px
  hair: 1px
  frame: 1px
motion:
  duration-sm: 120ms
  duration-md: 240ms
  duration-lg: 480ms
  ease-frame: 'cubic-bezier(0.2, 0, 0, 1)'
components:
  avatar:
    rounded: '{rounded.disc}'
well:
  color: '{colors.surface}'
  padding: 0px
  shadow: none
  dark-shadow: none
---

## 总览

1. 整体观感：冷白画布、浅天蓝表面、深天蓝品牌色、1px 发丝边界、全直角、零阴影、充裕留白。识别点七条：**冷调蓝系、发丝边界、全直角、零阴影、边界建层级、颜色带语义、克制**。
2. 设计意图：为企业后台与医疗应用设计——信息密度高、状态必须一眼分明、操作不容歧义。层级由边界线、表面阶梯与留白建立，禁止靠阴影、透明度或调淡文字表达；颜色永远携带含义，说不出某块颜色标的是哪种状态或动作，它就不该出现。
3. 固定色方案：不设 `[data-brand]` / `[data-surface]` 运行期换色 ramp，色板即产品身份；亮暗两档镜像同一套语义。
4. 权威分工：文件头 YAML 块是 token **数值的唯一权威**；本方案 `index.css` 的 `@theme` 是其实现，两边逐档对齐，不一致以 YAML 为准并报告冲突。组件槽位与角色档位归 `.agents/blueprints/ui/skins/<name>.md`；通用外观律归 delivery 技能；无障碍下限归 ui-rules 技能——本文件只答方案数值与方案语言边界。
5. 冲突裁决：用户明确要求 > 本规范 > 模型自己的品味；用户要求违反硬性禁令时，先说明并给出合规替代，再按用户最终决定执行。代码审计只记录问题、不自动修复，等待指令处理。

## Colors

1. 面积预算 **60 / 30 / 10**：约 60% 画布（`background` / `foreground`）；约 30% 次要容器背景（`surface` bar 类容器与轻量区块、`accent` 悬停与占位）；≤10% `primary` 与状态色。骨架屏与无内容占位背景色归 `accent`，空态提示文字归 `surface-fg`。
2. 色板只有 22 枚，亮暗各一套（构成与数值见 YAML）。sky 家族取 Tailwind v4 色板具名档位：品牌 `primary` sky-800（暗档反转为 sky-500 配深字）、表面 `surface` sky-100（暗档 sky-950）、悬停档 `accent` sky-200（暗档 sky-900）。语义四族与 minimal、neo 同构同值（schemes.md 规则 3 共享实测值）。后缀语法全系统一致：背景色不带后缀，文字色加 `-fg`，`-accent` 是强调 / 悬停背景档；例外皆显式：画布用全写 `background` / `foreground`。`@theme` 的色彩映射与这 22 枚一一对应，此外没有任何颜色槽位；浮层背景与焦点环是方案机制值，由 `index.css` 派生。
3. 逐 token 去处：

   1. `background` — 页面底层、主内容区、控件的默认背景色；浮层背景亮档也是它。bar 类容器（顶栏 / 侧栏 / 底栏）不用它，用 `surface`。
   2. `foreground` — 正文、标题、核心图标的文字色，也是 `border` 的派生源；次要说明文字用 `surface-fg`。
   3. `surface` — 次要容器背景色：bar 类容器、轻量区块、hero、小标签、表头、rail；不用作主内容区背景。
   4. `surface-fg` — 次要文字色：辅助文本、说明、占位符、次要图标，也是 `surface` 容器、引用块与禁用态上的文字色。
   5. `accent` — 中性强调背景色：悬停高亮、静态区块强调、骨架屏与无内容占位。没有品牌含义，不能替代 `primary` 表示动作，也不用作文字色。
   6. `accent-fg` — `accent` 背景上的文字色。
   7. `border` — 全局唯一边框色（前景色 14% 透明，随底色自适应亮暗与表面）；所有默认边框、分隔线、表格网格、行内 code 描边由它派生。
   8. `primary` — 品牌色：主按钮、选中 / 激活态、焦点环、状态标记、链接。保持稀缺（一屏一个主操作），禁止大面积铺满卡片或页面背景。
   9. `primary-fg` — `primary` 背景上的文字色；亮档白字（压 sky-800 实测 7.56:1、压 sky-900 9.46:1），暗档深字（压 sky-500 实测约 6.1:1、压 sky-400 7.84:1）。
   10. `primary-accent` — 品牌深化档（亮档 sky-900）/ 提亮档（暗档 sky-400）：激活 / 按压态；焦点环由 `primary` 派生。不用作常态背景色。
   11. `danger-fg` — 错误文字色：错误边框与错误焦点环、危险按钮前景色、状态提示文字。状态色只用于状态，不作装饰。
   12. `danger` — 错误提示静置背景色。
   13. `danger-accent` — 错误提示悬停背景色。
   14. `info-fg` — 信息文字色：信息提示与状态提示的文字、链接的语义变体。
   15. `info` — 信息提示静置背景色。
   16. `info-accent` — 信息提示悬停背景色。
   17. `success-fg` — 成功文字色。
   18. `success` — 成功提示静置背景色。
   19. `success-accent` — 成功提示悬停背景色。
   20. `warning-fg` — 警示文字色。
   21. `warning` — 警示提示静置背景色。
   22. `warning-accent` — 警示提示悬停背景色。

4. 对比度：全部令牌在亮、暗两档都满足 WCAG AA（≥ 4.5:1）。亮档 `primary` / `primary-fg` 与 `-fg` 叠底均为实测值（改档要重新量）；语义四族 `-fg` 叠两档背景沿用 schemes.md 规则 3 共享实测值。暗档 `primary` 反转为 sky-500：深天蓝 700 配白字在深底上只有约 2.8:1（作文字与描边双双不过 3:1），故暗档品牌统一反转为亮档 sky + 深字；块上文字恒读 `-fg`，不做黑白反转。

## Typography

1. 单一 sans 族（`typography.sans`），代码用 `typography.mono`。九档是**阅读角色**，不是尺寸；阶梯已在方案 `@theme` 命名（`--text-h1…h6`、`--leading-head`、`--leading-body`、`--text-table-code`），业务写档名（`text-h1 leading-head`），不写自造值。
2. 九档表：

   | 档            | 令牌（工具类）                     | 字号           | 字重 | 用途                       |
   | ------------- | ---------------------------------- | -------------- | ---- | -------------------------- |
   | `headline`    | 展示时刻自写                       | 2.5rem         | 700  | 仅首屏 / 展示时刻          |
   | `h1`          | `text-h1 leading-head tracking-tight` | 1.75rem     | 700  | 页面标题                   |
   | `h2`          | `text-h2 leading-head tracking-tight` | 1.375rem    | 700  | 章节标题（自带底部分隔线） |
   | `h3`–`h6`     | `text-h3`…`text-h6`                | 1.125 → 0.875rem | 600 | 子章节；**严禁跳级**      |
   | `body`        | `text-base leading-body`           | 1rem / 1.7     | 400  | 段落                       |
   | `description` | `text-base` → `sm:text-lg`         | 1rem → 1.125rem | 400 | `surface-fg` 辅助文字      |
   | `label`       | `text-xs font-semibold tracking-*` | 0.75rem，+0.02em 字距 | 600 | 字段标签、分组标题   |
   | `overline`    | `text-xs uppercase tracking-*`     | 0.75rem，大写，最宽字距 | 500 | 章节眉标            |
   | 行内 code     | `text-sm`（mono）                  | 0.875rem       | 500  | 标题与正文里的行内代码     |
   | 表格里的 code | `text-table-code`                  | 0.8125rem      | 500  | 单元格密度最高的一档       |

3. 标题行高统一 `leading-head`（1.4），正文行高统一 `leading-body`（1.7）——医疗向阅读留足行间；段间距 ≥ 1.5 倍行高；禁止两端对齐；可读行宽走 `max-w-[40em]` 居中正文列（中文 40 字 / 拉丁 80 字符同时成立，随字号缩放），页面框 80rem；**小屏可聚焦输入字号不得低于 16px**（iOS Safari 聚焦低阈值输入会整页放大），这条下限由方案保证；错误与空状态文案写清「问题 + 下一步动作」。
4. 长文作用域：规则写在 `index.css` 的 `@layer base` 内的 `@scope (.typography) to (.not-typography)` 块里、选择器只写元素名——@scope 不加权，发射在 preflight 之后，变体、`className`、内联值都压得过它。排版字符经 `@apply typo-*` 复用单挂家族（约定见 schemes/typography.md 蓝图），scope 只补节奏；岛挂 `not-typography` 隔离；业务禁止在容器里重抄作用域已经给的东西。基线：Chrome 118+ / Safari 17.4+ / Firefox 128+。

## Layout

1. 留白一律走 Tailwind 数字乘道（`gap-3` / `p-6`），单基础值 `--spacing` 0.25rem（4px 栅格）、含 0.5 半步精修（2px），禁止手写固定 px 与更细刻度；语义档只作文档约定不进 CSS（`xs`≡1 / `sm`≡2 / `md`≡3 / `lg`≡4 / `xl`≡6 / `2xl`≡8），机制值（`px-control-x`、`py-snug` 这类反解档）另计；兄弟间隙基线 1rem（`gap-4`）。
2. 页面留白三角色，互不混用：内联留白（顶栏 / 侧栏 / `main`）`px-4` → `md:px-6` → `lg:px-8`；区块节奏 `py-12` → `md:py-16` → `lg:py-20`（同一组数值另有 `--pad-block` 3rem / 4rem / 5rem 供少数内联样式读取，必须同值）；卡面内边距读 `--padding-panel` 1.5rem 恒值。
3. `main` 是 container 不是 block；方案不给页面级裸元素挂全局样式，留白由 markup 自己写数字、按断点给档。
4. Layout 断点三档：40rem / 48rem / 64rem；长文栏自己的 80rem 分界线归 Toc，不占三档。容器查询断点按用途归两族：内容内边距族 36rem / 56rem，紧凑布局族 28rem。新用途先归族，不发明新值。
5. 尺寸与布局：优先 max-width 自适应，内容列 `margin-inline: auto`；宽度与高度走 `--spacing` 数字乘道、随案缩放，`--container-*` 只任 `@container` 断点不作宽度 utility，不设跨案恒定盒、不写 rem 定值（唯一 em 例外是正文行宽），同一元素只挂一枚宽度 utility；定档件取 16n 单位、浮层宽度对视口负责，六条车道与选道顺序见 delivery `references/skin-rules.md` 第 16 条；浮层自带默认尺寸且不随内容跳动；自由尺寸走内联覆盖。
6. 命中区：`--height-field`（输入类带框壳）与 `--height-control`（其余一切可交互盒）同值 2.75rem（44px），语义分开为的是两类密度能各自调整。三条车道、外扩互压 12px 判据、连体组内层让位、输入壳热区细则见 ui-rules 技能 `operable.md` 8–12、23–25 条；禁止为组件开 `data-size` 尺寸阶梯。

## Elevation & Depth

1. **零阴影是本方案的身份**：`--shadow-frame` / `--shadow-block` / `--shadow-surface` / `--shadow-focus` / `--shadow-elevated` / `--shadow-hint` 与按压内阴影全部答 `none`，`--elevation-*` 不设档。皮肤串照常写 `shadow-frame` 系角色类，本车道得到「无阴影」而不是缺失——切换方案时改变的是观感而不是丢失。唯一豁免是 `shadow-checked` 扁平双环（画布色间隙 + 主色外环，四案同答）：它是选中环不是阴影，blur 为 0。
2. 层级三车道，只靠它们建立：**边界线**（1px `border`，control / hair / frame 同值 1px）、**表面阶梯**（`background` 画布 → `surface` 容器 → `surface-raised` 浮层，亮档浮层即 `background`、暗档浮层提亮到 `surface`）、**留白**。禁止用阴影或透明度补深度。
3. 浮层（Dialog / Drawer / Menu / Popover / Tooltip / 命令面板）一律带框：`border-frame` 描边 + `surface-raised` 背景，无阴影派不出现；轻提示（Tooltip / Toast）同样只有描边（`shadow-hint` 答 `none`），Toast 卡面为语义浅底（状态块规则）。
4. 无边框宿主上的操作控件必须自带边界：控件默认形态「填充或文字 + 1px 边框」，承重面不裸放。容器自带边界宿主复位；业务侧出口 `data-border="none | solid"`。
5. 焦点（机制值，`index.css` 的 `--focus-*`）：2px `primary` 实线 outline、offset 2px、无阴影 glow；invalid / danger 转 `danger-fg` 同形。方案不设全局 `:focus-visible` 兜底——每个可聚焦件由皮肤显式挂 `focus-visible:focus-ring`（danger 挂 `focus-ring-danger`），内层件不挂即无环；环是方案层机制，皮肤只挂角色类、不自绘样式。焦点环禁止消失，允许换形态，不得只去掉 outline 而不给替代。
6. 滚动条：默认 thin 细滚动条，不另造形态。

## Motion

1. 动效人格：克制、利落、无位移。允许的动作只有颜色换档与淡入淡出（透明度 0↔100）、折叠展开；禁止弹跳、回弹、速度感应、位移抬升与戏剧化登场（格子波形、摇曳类不进本方案）。`lift` 在本车道位移为 0——悬停反馈只换色，不挪动。
2. 时长三档住 `--duration-*`（`sm` 120ms / `md` 240ms / `lg` 480ms），微交互默认档 `--transition-duration-frame` 120ms（`motion-frame` 束即读它）；缓动统一 `ease-frame` `cubic-bezier(0.2, 0, 0, 1)`。禁止裸时长与裸缓动（`duration-150`、`ease-[ease]` 这类绕档写法不出现——它们同时绕过减动效契约）。
3. 按压唯一入口是 `crush` 工具类：位移 0 + `brightness(0.95)` 压暗；禁止手写 `translate-(--translate-crush)` 丢掉压暗，禁止位移代替换色。
4. 悬停反馈只换色：可点条目悬停吃 `accent` 对，品牌件悬停吃 `primary-accent` 深化档；不升阴影档（没有阴影可升）、不位移。
5. 减动效契约：`prefers-reduced-motion: reduce` 或 `data-motion="reduce"` 时全部时长令牌清零、CSS 动画压到 1ms；JS 侧动效读 `useMotionPreference`。任何绕过令牌的时长都等于绕过契约。
6. 透明度豁免清单（全方案仅此五条，弱化态不在其中）：`border` 令牌自身的 14% 洗边、禁用契约的 50%、悬停显现过渡的 0↔100（tooltip、toast 关闭钮、字段提示）、遮罩渐隐（scroll-shadow 的画布色渐变）、图表数据编码的透明度（`fill-opacity` 与 donut / radar 的降权 dim——图表以透明度叠色为媒介）。其余弱化态一律 `surface-fg` 文字色或图形差异（划线、换色）表达，不用 opacity。

## Shapes

1. **全直角是唯一形状答案**：`@theme` 用 0px 回答半径阶梯每一档（含 `pill` / `disc` / `swipe`），共享代码写来的 `rounded-lg` 在这里得到直角而不是不生成——切换方案时改变的是观感而不是丢失。皮肤禁止写 `rounded-full`（静态圆不读令牌，谁也答不成 0）——圆点、胶囊、圆钮一律 `rounded-pill` / `rounded-disc`（本方案答 0px，得直角），本方案无圆形。
2. 轨道族（滑块 / 进度条 / 开关轨）：矩形直角、无描边、纯色块，未填充底 `surface`、填充 `primary`；轨道一律连续条，格子形态不进本方案——输入滑块的反馈靠值气泡与按压，不靠格子与速度波。
3. 连体控制组（拼接输入 + 按钮、Segment 条）内角自然为 0，端帽无需处理。

## Components

1. 组件不拥有颜色与尺寸，只挑档位：颜色取 `colors` 语义名，间距取数字尺度，命中区按 44。数值唯一权威是文件头 YAML；逐属性 API 与变体归组件文档。已迁移组件的角色与槽位见 `.agents/blueprints/ui/skins/<name>.md`，此处不再重述。
2. Avatar 专属令牌：`disc`（`--radius-disc`，答 0px）。SwipeActions 专属令牌：`--radius-swipe`，答 0px（全直角宪法管到每一枚半径令牌）。
3. 未迁移组件档位短条（随各组件重构迁入其皮肤蓝图）：

   1. Input / Select 触发器 / 字段壳：`background` 背景色 + `foreground` 前景色，1px `border` 描边 + `--height-field` 下限，无阴影；聚焦 = 描边转 `primary` 2px 或外壳换 `accent` 填充，`invalid` 转 `danger-fg`。
   2. Card：`background` 背景色 + `foreground` 前景色，1px `border-frame` 描边，盒内边距读 `--padding-panel`，流体尺寸；可点卡悬停只换边界与文字色，静态卡禁一切 hover 动效。
   3. 浮层（Dialog / Drawer / Menu / Popover / Tooltip / 命令面板）：`surface-raised` 背景 + `foreground` 文字色 + `border-frame` 描边，无阴影——浮层一律带框。
   4. bar 形态容器（顶栏 / 侧栏 / 底栏 / hero）：`surface` 背景色 + `surface-fg` 前景色，靠边界线分区，不叠阴影。
   5. 状态块与状态标签：静态背景取 `<status>` 静置背景色，文字取对应 `<status>-fg`；状态色只用于状态，不作装饰、不当大面积背景色。
   6. Toc：长文栏 80rem 分界线归它自己，不占 Layout 三档断点。
7. 组容器井（well）：`--padding-well` 答 0（无框距）、`--color-well` 读 `surface`（平涂色井）、`--shadow-well` 答 `none`——字段内区平铺浅天蓝表面、全直角、无拟态阴影，井读法退化为「色井贴边的扁平字段」。

## Do / Don't（方案语言边界）

1. 禁圆角：任何非零半径；本方案皮肤只写 `rounded-none` 与 `rounded-pill` / `rounded-disc`（本方案答 0px），禁止 `rounded-full` 与任何字面圆角值。
2. 禁阴影：`shadow-sm|md|lg|xl|2xl`、`drop-shadow-*`、任何 blur ≥ 0 的 box-shadow；唯一豁免 `shadow-checked` 扁平双环（blur 0、四案同答）。层级只靠边界线、表面阶梯与留白。
3. 焦点环原样保留——它是无障碍的下限；禁止 `focus:outline-none` 而不给替代描边。
4. 品牌色稀缺：一屏一个主操作，`primary` 禁止大面积铺面；状态色只用于状态，不当装饰、不当层级。暗档禁止白字压 sky-600 / sky-700 一类中亮蓝（4.12 / 5.34 的 700 虽过 4.5 但描边不过 3:1——品牌统一走 sky-500 + 深字）。
5. 层级禁止表达成透明度调深浅 / 灰字弱化；非当前态的弱化（日历外月、图例隐藏、降权图标）用 `surface-fg` 文字色或图形差异表达，不用 opacity——透明度只出现在 Motion §6 的豁免清单里。
6. 禁手写焦点 / 禁用 / hover / 按压样式：交互态归方案层；禁悬停位移与升档阴影（无阴影可升）。
7. 禁灰边框（`border-gray-*` / `border-slate-*` / `border-neutral-*`）：边框一律读 `border` 令牌。
8. 通用外观禁令见 delivery `references/skin-rules.md`，排版见 `references/typography.md`，动效见 `references/motion.md`，装饰见 `references/decoration.md`，无障碍下限见 ui-rules 技能，此处不重述。
9. 交付自检：替换示例内容后页面仍一眼识别为冷静直角——**冷调蓝系 + 发丝边界 + 全直角 + 零阴影**；没有任一元素跳出数字间距或出现阴影；亮 / 暗两档来回切无破相。克制不等于空：密度靠排版与留白建立，不靠把元素调淡——宁可少一种颜色，不可少一个状态。
