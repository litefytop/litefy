---
version: alpha
name: Litefy UI — Minimal
description: Design language of the Litefy UI soft-minimal style template (slug minimal) — a minimal skeleton over quiet soft surfaces: monochrome-first with a single brand colour, diffuse paired shadows, sunken same-tone wells in field groups, and a 4px numeric spacing grid. The YAML block is the sole numeric authority for tokens; the prose states rules and destinations.
colors:
  background: 'oklch(98.5% 0 0)'
  foreground: 'oklch(14.5% 0 0)'
  surface: 'oklch(92.2% 0 0)'
  surface-fg: 'oklch(26.9% 0 0)'
  accent: 'oklch(87% 0 0)'
  accent-fg: 'oklch(37.1% 0 0)'
  border: 'color-mix(in oklab, oklch(87% 0 0) 50%, transparent)'
  primary: 'oklch(14.5% 0 0)'
  primary-fg: 'oklch(98.5% 0 0)'
  primary-accent: 'oklch(37.1% 0 0)'
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
  dark-background: 'oklch(14.5% 0 0)'
  dark-foreground: 'oklch(97% 0 0)'
  dark-surface: 'oklch(26.9% 0 0)'
  dark-surface-fg: 'oklch(92.2% 0 0)'
  dark-accent: 'oklch(37.1% 0 0)'
  dark-accent-fg: 'oklch(87% 0 0)'
  dark-border: 'color-mix(in oklab, oklch(37.1% 0 0) 50%, transparent)'
  dark-primary: 'oklch(98.5% 0 0)'
  dark-primary-fg: 'oklch(14.5% 0 0)'
  dark-primary-accent: 'oklch(87% 0 0)'
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
    fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, sans-serif'
  mono:
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  headline:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 3.75rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.025em
  h1:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.35
  h2:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.375rem
    fontWeight: 600
    lineHeight: 1.35
  h3:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.35
  h4:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1rem
    fontWeight: 600
    lineHeight: 1.35
  h5:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.9375rem
    fontWeight: 600
    lineHeight: 1.35
  h6:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1rem
    lineHeight: 1.75
  description:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 1.125rem
    lineHeight: 1.75rem
  label:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 0.75rem
    fontWeight: 600
    letterSpacing: 0.025em
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
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
  pill: 9999px
  disc: 9999px
spacing:
  base: 0.25rem
  pad-block: 3rem
heights:
  control: 2.75rem
  field: 2.75rem
borders:
  control: 0px
  hair: 1px
  frame: 1px
motion:
  duration-sm: 150ms
  duration-md: 300ms
  duration-lg: 500ms
  ease-frame: 'cubic-bezier(0.4, 0, 0.2, 1)'
components:
  avatar:
    rounded: '{rounded.disc}'
well:
  color: '{colors.surface}'
  padding: 0px
  shadow: 'inset 2px 2px 4px oklch(0% 0 0 / 10%), inset -2px -2px 4px oklch(100% 0 0 / 65%)'
  dark-shadow: 'inset 2px 2px 4px oklch(0% 0 0 / 40%), inset -2px -2px 4px oklch(100% 0 0 / 7%)'
---

## 总览

1. 整体观感：扁平的浅灰中性面、发丝软边界、扩散柔影、8–24px 大圆角、亮档近黑（暗档近白）的一支品牌色、充裕留白、零多余颜色；字段族以同色井承凹——壳与附件同色、井面下沉。识别点七条：**单色优先、发丝软边界、扩散柔影、同色井、大圆角阶梯、一处品牌色、留白分层**。
2. 设计意图：柔和极简是「极简骨架 × 软表面」的混合语言——骨架层无色即品牌，颜色永远携带含义，说不出某块颜色标的是哪种状态或动作，它就不该出现；表面层借轻新拟态的思路表达凹凸（同色井 + 单一光源内阴影），不做高对比立体。层级由字号、留白、边界线与井的沉浮建立，禁止靠降低透明度或调淡文字表达；服务信息密度高的产品界面（工具、控制台、文档、表单）。
3. 权威分工：文件头 YAML 块是 token **数值的唯一权威**；本方案 `index.css` 的 `@theme` 是其实现，两边逐档对齐，不一致以 YAML 为准并报告冲突。组件槽位与角色档位归 `.agents/blueprints/ui/skins/<name>.md`；通用外观律归 delivery 技能；无障碍下限归 ui-rules 技能——本文件只答方案数值与方案语言边界。
4. 冲突裁决：用户明确要求 > 本规范 > 模型自己的品味；用户要求违反硬性禁令时，先说明并给出合规替代，再按用户最终决定执行。代码审计只记录问题、不自动修复，等待指令处理。

## Colors

1. 面积预算 **60 / 30 / 10**：约 60% 画布（`background` / `foreground`——方案常量，亮暗各一套定值，不随表面色板移动）；约 30% 次要容器背景（`surface` / `accent`，表面色板只改写这两个与 `surface-fg`）；≤10% `primary` 与状态色。骨架屏与无内容占位背景色归 `accent`，空态提示文字归 `surface-fg`。
2. 色板只有 22 枚，亮暗各一套（构成与数值见 YAML）。后缀语法全系统一致：背景色不带后缀，文字色加 `-fg`；`-accent` 是强调 / 悬停背景档，没有 `-bg` 档；例外皆显式：画布用全写 `background` / `foreground`。`@theme` 的色彩映射与这 22 枚一一对应，此外没有任何颜色槽位；浮层背景与焦点环是方案机制值，由 `index.css` 派生，不是色板令牌。
3. 逐 token 去处：

   1. `background` — 页面底层、主内容区、控件的默认背景色；浮层背景亮档也是它。bar 类容器（顶栏 / 侧栏 / 底栏）不用它，用 `surface`。
   2. `foreground` — 正文、标题、核心图标的文字色；次要说明文字用 `surface-fg`。
   3. `surface` — 次要容器背景色：bar 类容器、轻量区块、hero、小标签、表头、rail；不用作主内容区背景。
   4. `surface-fg` — 次要文字色：辅助文本、说明、占位符、次要图标，也是 `surface` 容器、引用块与禁用态上的文字色。
   5. `accent` — 中性强调背景色：悬停高亮、静态区块强调、骨架屏与无内容占位，也是 `border` 的派生源。没有品牌含义，不能替代 `primary` 表示动作，也不用作文字色。
   6. `accent-fg` — `accent` 背景上的文字色。
   7. `border` — 全局唯一边框色（`accent` 的 50% 透明）；所有默认边框、分隔线、表格网格、行内 code 描边由它派生。
   8. `primary` — 品牌色：主按钮、选中 / 激活态、焦点环、状态标记、链接。保持稀缺（一屏一个主操作），禁止大面积铺满卡片或页面背景。
   9. `primary-fg` — `primary` 背景上的文字色。
   10. `primary-accent` — 品牌深化档：激活 / 按压态、焦点高亮；焦点环由它派生。不用作常态背景色。
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

4. 对比度：全部令牌在亮、暗两档都满足 WCAG AA（≥ 4.5:1）。语义四色当文字色用，暗档一律提亮到文字可读档；层级不靠压暗文字或发光表达。

## Typography

1. 单一 sans 族（`typography.sans`），代码用 `typography.mono`。九档是**阅读角色**，不是尺寸；阶梯已在方案 `@theme` 命名（`--text-h1…h6`、`--leading-head`、`--leading-body`、`--text-table-code`），业务写档名（`text-h1 leading-head`），不写自造值。
2. 九档表：

   | 档            | 令牌（工具类）                     | 字号                        | 字重 | 用途                       |
   | ------------- | ---------------------------------- | --------------------------- | ---- | -------------------------- |
   | `headline`    | 展示时刻自写                       | 2.25rem → 3.75rem（随断点） | 700  | 仅首屏 / 展示时刻          |
   | `h1`          | `text-h1`                          | 1.75rem                     | 600  | 页面标题                   |
   | `h2`          | `text-h2`                          | 1.375rem                    | 600  | 章节标题（自带底部分隔线） |
   | `h3`–`h6`     | `text-h3`…`text-h6`                | 1.125 → 0.875rem            | 600  | 子章节；**严禁跳级**       |
   | `body`        | `text-base leading-body`           | 1rem / 1.75                 | 400  | 段落                       |
   | `description` | `text-base` → `sm:text-lg`         | 1rem → 1.125rem             | 400  | `surface-fg` 辅助文字      |
   | `label`       | `text-xs font-semibold tracking-*` | 0.75rem，+0.025em 字距      | 600  | 字段标签、分组标题         |
   | `overline`    | `text-xs uppercase tracking-*`     | 0.75rem，大写，最宽字距     | 500  | 章节眉标                   |
   | 行内 code     | `text-sm`（mono）                  | 0.875rem                    | 500  | 标题与正文里的行内代码     |

3. 标题行高统一 `leading-head`（1.35），正文行高统一 `leading-body`（1.75）；段间距 ≥ 1.5 倍行高；禁止两端对齐；可读行宽走 `max-w-[40em]` 居中正文列（默认案 1rem 字号下即 40rem，中文 40 字 / 拉丁 80 字符同时成立，随字号缩放），页面框 80rem；**小屏可聚焦输入字号不得低于 16px**（iOS Safari 聚焦低阈值输入会整页放大），这条下限由方案保证；错误与空状态文案写清「问题 + 下一步动作」。
4. 长文作用域（`typography` 类约定，无组件、无导出）：规则写在 `index.css` 的 `@layer base` 内的 `@scope (.typography) to (.not-typography)` 块里、选择器只写元素名——@scope 不加权，特异度仍只有元素自身，发射在 preflight 之后，变体、`className`、内联值都压得过它（层优先级高于特异度）。排版字符经 `@apply typo-*` 复用单挂家族（`typo-h1…h6` / `typo-body` / `typo-quote` / `typo-list` / `typo-table` / `typo-code` / `typo-link`，约定见 schemes/typography.md 蓝图），scope 只补节奏。节奏只住块间，容器不给首块加顶部外边距；非长文岛（demo 面板、代码块、自带节奏的组件）挂 `not-typography` 隔离（`to` 挖洞语义）；皮肤外观与作用域默认不同的复位由该皮肤自己声明；业务禁止在容器里重抄作用域已经给的东西。基线：Chrome 118+ / Safari 17.4+ / Firefox 128+。

## Layout

1. 留白一律走 Tailwind 数字乘道（`gap-3` / `p-6`），单基础值 `--spacing` 0.25rem（4px 栅格）、含 0.5 半步精修（2px），禁止手写固定 px 与更细刻度；语义档只作文档约定不进 CSS（`xs`≡1 / `sm`≡2 / `md`≡3 / `lg`≡4 / `xl`≡6 / `2xl`≡8），机制值（`px-control-x`、`py-snug` 这类反解档）另计；兄弟间隙基线 1rem（`gap-4`）。
2. 页面留白三角色，互不混用：内联留白（顶栏 / 侧栏 / `main`）`px-4` → `md:px-6` → `lg:px-8`；区块节奏 `py-12` → `md:py-16` → `lg:py-20`（同一组数值另有 `--pad-block` 3rem / 4rem / 5rem 供少数内联样式读取，必须同值）；盒内边距固定 `p-6`，卡片组件与裸元素同一个数。
3. `main` 是 container 不是 block；方案不给页面级裸元素挂全局样式，留白由 markup 自己写数字、按断点给档。
4. Layout 断点三档：40rem / 48rem / 64rem；长文栏自己的 80rem 分界线归 Toc，不占三档。容器查询断点按用途归两族：内容内边距族 36rem / 56rem（Card、Dialog、Drawer 盒内边距升档），紧凑布局族 28rem（Pagination）。新用途先归族，不发明新值。
5. 尺寸与布局：优先 max-width 自适应，内容列 `margin-inline: auto`（正文 `max-w-[40em]` 行宽车道、页面框 `max-w-320` 80rem）；宽度与高度走 `--spacing` 数字乘道、随案缩放，`--container-*` 只任 `@container` 断点不作宽度 utility，不设跨案恒定盒、不写 rem 定值（唯一 em 例外是正文行宽），同一元素只挂一枚宽度 utility；定档件取 16n 单位、浮层宽度对视口负责，六条车道与选道顺序见 delivery `references/skin-rules.md` 第 16 条；浮层自带默认尺寸且不随内容跳动；自由尺寸走内联覆盖。
6. 命中区：`--height-field`（输入类带框壳）与 `--height-control`（其余一切可交互盒）同值 2.75rem（44px），语义分开为的是两类密度能各自调整。三条车道（整盒 `min-height` 到 44 / 伪元素外扩 / 行内文字豁免）、外扩互压 12px 判据、连体组内层让位、输入壳热区细则见 ui-rules 技能 `operable.md` 8–12、23–25 条；禁止为组件开 `data-size` 尺寸阶梯。

## Elevation & Depth

1. 阴影严格分级，与圆角一一配对，语义四级住 `--elevation-*`：`faint`（sm，发丝元素、极小占位）/ `subtle`（sm，小标签、紧凑行内控件、轻悬浮）/ `base`（md，按钮、输入框、标准卡片静止态）/ `elevated`（xl，弹窗、抽屉、浮层、顶级面板）；第五枚 `--elevation-pressed` 按压内阴影只归组件层。亮档只用扩散黑投影（大模糊、低不透明度，弥散不锐利）；暗档每档加淡白亮环（subtle 7% → elevated 14%）与顶部内高光、黑投影降档兜底；语义四级之外的自造档位与任意值阴影一律不出现。轻提示角色 `shadow-hint`（Tooltip / Toast 皮肤点名）答 `elevated` 同值，不另设第五档。
2. 焦点（机制值，`index.css` 的 `--focus-*`）：1px `primary` outline 加 3px `primary` 50% 透明阴影；invalid / danger 转 `danger-fg` 同形阴影。方案不设全局 `:focus-visible` 兜底——每个可聚焦件由皮肤显式挂 `focus-visible:focus-ring`（danger 挂 `focus-ring-danger`），内层件不挂即无环；环是方案层机制，皮肤只挂角色类、不自绘样式。
3. 边界系统（发丝是唯一宽度）：全局中性组件默认边框 = `var(--border)`；品牌交互组件统一走 Brand 色板。输入类规范形态「边框 + `base` 阴影」成套，边框不裸用；裸边框只给微小指示器（Checkbox / Radio / Steps marker）、虚线占位、分隔结构线、浮层内嵌面板。
4. 边框与阴影二选一：带边框的盒子再叠大阴影即 Ghost card，出现即改。
5. 控件边框与宿主互补：无边框宿主上的操作控件必须自带边框；已有边界线的宿主内行内控件只用文字 / 填充形态。
6. 容器自带边界，宿主负责复位：可独立承载内容的容器（列表视口、折叠根、卡片、浮层面板）边框写在方案里，消费方不补；嵌进别的组件时宿主复位（去边框 + 去圆角）。业务侧出口 `data-border="none | solid"`。

## Motion

1. 动效人格：安静。允许的动作只有淡入淡出、位移与压暗（`lift` / `crush`）和折叠展开；禁止弹跳、回弹、速度感应与戏剧化登场（格子波形、摇曳类不进本方案）。动画与过渡只做变换、透明度与颜色（`--transition-frame-properties` 清单），布局属性一律禁止——唯一豁免是折叠高度（`grid-template-rows` 技法，collapse / tree 专用，时长走档）。
2. 时长三档住 `--duration-*`（`sm` 150ms / `md` 300ms / `lg` 500ms），微交互默认档 `--transition-duration-frame` 150ms（`motion-frame` 束即读它）；缓动统一 `ease-frame`。禁止裸时长与裸缓动（`duration-150`、`ease-[ease]` 这类绕档写法不出现——它们同时绕过减动效契约）。
3. 按压唯一入口是 `crush` 工具类（translate 归零 + `brightness(0.95)`）；禁止手写 `translate-(--translate-crush)` 丢掉压暗。
4. 悬停阴影两车道：按钮类不升档（`shadow-frame-hover` 与静止同档，反馈靠 lift / crush）；容器类升一档（`shadow-block-hover` 即 elevated）。滑块拇指、对话框关闭钮这类小控件按按钮类处理，禁止 hover 升 elevated。
5. 减动效契约：`prefers-reduced-motion: reduce` 或 `data-motion="reduce"` 时全部时长令牌清零、CSS 动画压到 1ms；JS 侧动效读 `useMotionPreference`。任何绕过令牌的时长都等于绕过契约。
6. 透明度豁免清单（全方案仅此五条，弱化态不在其中）：`border` 令牌自身的 50% 洗边、禁用契约的 50%、悬停显现过渡的 0↔100（tooltip、toast 关闭钮、字段提示）、遮罩渐隐（scroll-shadow 的画布色渐变）、图表数据编码的透明度（`fill-opacity` 与 donut / radar 的降权 dim——图表以透明度叠色为媒介）。其余弱化态一律 `surface-fg` 文字色或图形差异（划线、换色）表达，不用 opacity。

## Shapes

1. 圆角四档加胶囊，永远与阴影档一致：`sm` 8px 行内标签 / `md` 12px 输入与字段族触发件 / `lg` 16px 独立区块卡 / `xl` 24px 大卡与浮层外壳 / `full` 装饰圆（时间线节点、徽标圆点）/ `disc` 头像（答 `pill`，全圆）/ `pill` 胶囊（按钮、按下钮、特性胶囊、进度条、开关轨道、单选框——按钮族默认成圆）。
2. 本方案重映射为柔和阶梯（`sm`/`md`/`lg`/`xl` = 8/12/16/24px，`@theme` 显式声明，不再依赖核心默认刻度）；只用这几档，`xs` / `2xl` / `3xl` / `4xl` 属别的风格语言，本方案不出现。静态的 `rounded-full` 谁也答不成 0，所以胶囊与头像圆写 `rounded-pill` / `rounded-disc`，由各方案回答。
3. 连体控制组（拼接输入 + 按钮、Segment 条）内角压平为 0，只保留首尾端帽。
4. 轨道族（滑块 / 进度条 / 开关轨）：半径一律胶囊 `pill`、无描边、纯色块，未填充底 `surface`、填充 `primary`；轨道一律连续条，格子形态不进本方案——输入滑块的反馈靠值气泡与按压，不靠格子与速度波。

## Components

1. 组件不拥有颜色与尺寸，只挑档位：颜色取 `colors` 语义名，圆角按 Shapes 四档，间距取五档数字尺度，命中区按 44。数值唯一权威是文件头 YAML；逐属性 API 与变体归组件文档。已迁移组件（Button / Avatar / Banner）的角色与槽位见 `.agents/blueprints/ui/skins/<name>.md`，此处不再重述。
2. Avatar 专属令牌：`disc`（`--radius-disc`，答 `pill`，全圆）。
3. SwipeActions 专属令牌：`--radius-swipe`，答 `xl`（0.75rem，声明在 `@theme`，Avatar `disc` 同款先例）。
4. 未迁移组件档位短条（随各组件重构迁入其皮肤蓝图）：

   1. Input / Select 触发器 / 字段壳：`background` 背景色 + `foreground` 前景色，`md` 圆角 + `base` 阴影，`--height-field` 下限。
   2. Card：`background` 背景色 + `foreground` 前景色，`lg` 圆角，盒内 `p-4`（容器 36rem 起 `p-6`、56rem 起 `p-8`），流体尺寸。
   3. 浮层（Dialog / Drawer / Menu / Popover / Tooltip / 命令面板）：浮层背景（机制值：亮档即 `background`，暗档自动提亮一档）+ `foreground` 文字色，`xl` 圆角 + `border-frame` 描边 + `elevated` 阴影——浮层一律带框，无框派不出现。
   4. bar 形态容器（顶栏 / 侧栏 / 底栏 / hero）：`surface` 背景色 + `surface-fg` 前景色，靠边界线分区，不叠阴影。
   5. 状态块与状态标签：静态背景取 `<status>` 静置背景色，文字取对应 `<status>-fg`；状态色只用于状态，不作装饰、不当大面积背景色。
   6. Toc：长文栏 80rem 分界线归它自己，不占 Layout 三档断点。
5. 组容器井（well）：字段壳与分段壳不挂框距（`--padding-well` 答 0——关井只去框距，与扁平极简同法），井（输入元素 / 值区 / 多行域）挂 `bg-well`（`--color-well` 读 `surface`）+ `shadow-well`（`--shadow-well` 双向内阴影，单一光源左上——暗影落在井口上缘、亮光补在对缘；亮暗各答，数值见 YAML `well` 块，经验规则）+ 同心式圆角（`radius-md − frame 边宽`，式见 delivery `references/skin-rules.md` 第 17 条）。完全关井 = 框距 0 + 井底读 `background`，读法退回纯容器形态。

## Do / Don't（方案语言边界）

1. 品牌色稀缺：一屏一个主操作，`primary` 禁止大面积铺面；状态色只用于状态，不当装饰、不当层级。
2. 阴影档与圆角档成对出现；边框与阴影二选一——「边框 + 大阴影」叠用即 Ghost card，出现即改；静态 Card 加 hover 动效同禁。
3. 焦点环原样保留——它是无障碍的下限。
4. 亮 / 暗两档镜像同一套语义，暗档靠提亮浮层表面与白亮环表达深度；禁止白色模糊外发光。
5. 层级禁止表达成透明度调深浅 / 灰字弱化；非当前态的弱化（日历外月、图例隐藏、降权图标）用 `surface-fg` 文字色或图形差异表达，不用 opacity——透明度只出现在 Motion §6 的豁免清单里。
6. 禁止手写焦点 / 禁用 / hover / 按压样式：交互态归方案层。
7. 通用外观禁令见 delivery 技能，无障碍下限见 ui-rules 技能，此处不重述。
8. 交付自检：替换示例内容后页面仍一眼识别为极简——**灰阶 + 一处品牌色 + 发丝边界 + 扩散柔影 + 大圆角**；没有任一元素跳出五档间距或四级阴影；亮 / 暗两档来回切无破相。克制不等于空：密度靠排版与留白建立，不靠把元素调淡——宁可少一种颜色，不可少一个状态。
