---
version: alpha
name: Litefy UI — Neo-Brutalist
description: Design language of the Litefy UI neo-brutalist style template — black and white carry the structure, three flat accent hues land only where the design assigns them, every corner is square, and every shadow is a solid, unblurred offset. The YAML block is the sole numeric authority for tokens; the prose states rules and destinations.
colors:
  background: '#ffffff'
  foreground: '#000000'
  surface: 'oklch(89.7% 0.196 126.665)'
  surface-fg: '#1a1a1a'
  accent: 'oklch(90.5% 0.182 98.111)'
  accent-fg: '#000000'
  border: '#000000'
  primary: 'oklch(59.2% 0.249 0.584)'
  primary-fg: '#000000'
  primary-accent: 'oklch(52.5% 0.223 3.958)'
  danger-fg: 'oklch(39.6% 0.141 25.723)'
  danger: 'oklch(80.8% 0.114 19.571)'
  danger-accent: 'oklch(88.5% 0.062 18.334)'
  info-fg: 'oklch(37.9% 0.146 265.522)'
  info: 'oklch(80.9% 0.105 251.813)'
  info-accent: 'oklch(88.2% 0.059 254.128)'
  warning-fg: 'oklch(42.1% 0.095 57.708)'
  warning: 'oklch(90.5% 0.182 98.111)'
  warning-accent: 'oklch(94.5% 0.129 101.54)'
  success-fg: 'oklch(39.3% 0.095 152.535)'
  success: 'oklch(87.1% 0.15 154.449)'
  success-accent: 'oklch(92.5% 0.084 155.995)'
  dark-background: '#000000'
  dark-foreground: '#ffffff'
  dark-surface: 'oklch(89.7% 0.196 126.665)'
  dark-surface-fg: '#d9d9d9'
  dark-accent: 'oklch(90.5% 0.182 98.111)'
  dark-accent-fg: '#000000'
  dark-border: '#ffffff'
  dark-primary: 'oklch(59.2% 0.249 0.584)'
  dark-primary-fg: '#000000'
  dark-primary-accent: 'oklch(52.5% 0.223 3.958)'
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
  xs:
    fontSize: 12px
    lineHeight: 1.1
  sm:
    fontSize: 14px
    lineHeight: 1.1
  base:
    fontSize: 16px
    lineHeight: 1.1
  lg:
    fontSize: 18px
    lineHeight: 1.1
  xl:
    fontSize: 20px
    lineHeight: 1.1
  2xl:
    fontSize: 24px
    lineHeight: 1.1
  3xl:
    fontSize: 30px
    lineHeight: 1.1
  4xl:
    fontSize: 36px
    lineHeight: 1.1
  5xl:
    fontSize: 48px
    lineHeight: 1
  6xl:
    fontSize: 60px
    lineHeight: 1
  headline:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 'clamp(36px, 24px + 3vw, 60px)'
    fontWeight: 900
    lineHeight: 1
    letterSpacing: -0.01em
  h1:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 30px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: -0.01em
  h2:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 24px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: -0.01em
  h3:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.1
  h4:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.1
  h5:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 18px
    fontWeight: 700
    lineHeight: 1.1
  h6:
    fontFamily: '{typography.sans.fontFamily}'
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 16px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: 0.1em
  overline:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 12px
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: 0.1em
    textTransform: uppercase
  kicker:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 26px
    fontWeight: 900
    lineHeight: 1
    letterSpacing: 0.1em
    textTransform: uppercase
  field:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.4
  code:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.25rem
  table-code:
    fontFamily: '{typography.mono.fontFamily}'
    fontSize: 14px
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
  base: 0.375rem
  pad-block: 3rem
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

1. 本文件是 **neo-brutalist 这套风格唯一的规则正本**，描述设计语言，不是 Litefy UI 总说明书——库内组件清单、装配方式、逐属性 API 与可运行示例归组件文档。往本文件加内容前先问：这是 neo-brutalist 的设计约束，还是与风格无关的用法说明？后者外链组件文档，不抄进来。
2. 权威分工：文件头 YAML 块是 token **数值的唯一权威**；本方案 `index.css` 的 `@theme` 是其实现，两边逐档对齐，不一致以 YAML 为准并报告冲突。组件槽位与角色档位归 `.agents/blueprints/ui/skins/<name>.md`；通用外观律归 delivery 技能；无障碍下限归 ui-rules 技能——本文件只答方案数值与方案语言边界。
3. 外观通道：本方案把 Tailwind utility 类名当自己的词汇表，组件外观住共用皮肤层 `app/ui/skins/*.tsx` 的 utility 串里；`index.css` 只放 utility 串表达不了的东西——令牌阶梯、`@custom-variant`（把消费者声明的档位接进 utility）、`@layer base` 全局行为、无对应命名空间的 `@utility` 角色类、全案同构的 `bg-*` 填充家族（蓝图 rule 4，本方案 `--fill-*` 全答 `none`，渲染与核心生成的纯色一致）。包内没有第二份 CSS。`@theme` 里 `--color-*` 与 `--shadow-*` **整命名空间删除**，`bg-blue-500` / `shadow-lg` 根本不生成；`--radius-*` 不删除而是**每一档答成 0px**——共享代码写来的 `rounded-lg` 在本车道得到直角，而不是什么都得不到。
4. 皮肤导出的 utility 串：走不到组件入口的宿主（渲染不出 `<button>` 的 `<Link>`、自己组合外框的字段壳）组合皮肤导出的串过本方案的 `cn` 合并（`buttonBase` / `buttonFrame` / `cardClasses` / `chipClasses` 等，正本 `app/ui/skins/index.ts` 与各皮肤文件）。这条道没有 `data-variant` 接线——要哪个角色就把对应的串传进 `cn`；两套方案经各自 `index.css` 回答同一份串。
5. 三条契约：**令牌是唯一数值来源**（皮肤串禁 `shadow-[4px_4px_0_0_#000]` 字面量，档位名才跟两档阶梯走）；**皮肤层是唯一外观通道**（骨架零 class 只发逻辑态；档位 `data-variant` 由 `@custom-variant` 接进 utility——`quiet` / `plain` / `borderless` / `bordered`，档位值住皮肤）；**交互态归方案层**（五态业务不手写）。
6. 整体观感：纯白画布上的纯黑粗描边、零模糊实体偏移阴影、全直角、高对比平涂色块、等宽正文、大写 900 字重控件文字。识别点七条：**黑白承重、粗边框、硬阴影、全直角、指定填色、mono 正文、硬切不淡出**。
7. 设计意图：新野兽派源于建筑领域的野兽派运动——原始、未经修饰、功能先行，反对一切柔化：不圆角、不渐变、不发光、不淡出。层级由描边重量、字号与位移建立，禁止透明度或灰字；颜色不是装饰，说不出某块色标的是哪个动作或状态，它就不该出现。
8. 冲突裁决：用户明确要求 > 本规范 > 模型自己的品味；违反硬性禁令时先说明并给合规替代，再按用户最终决定执行。代码审计只记录问题、不自动修复，等待指令处理。

## Colors

1. 面积预算 **6 / 3 / 1**：黑白结构（画布、文字、描边与硬阴影）占 6，表面与状态（`surface` 的 lime、`accent` 的 yellow）占 3，品牌（`primary` 的 CTA 与选中）占 1。彩色全部取 Tailwind v4 色板具名档位，不手调色值；填充三色两档同值、夜间一动不动——本方案是固定色方案，预算是取色纪律，不是运行期换色。
2. 色板只有 22 枚，亮暗各一套（构成与数值见 YAML）。后缀语法全系统一致：背景色不带后缀，文字色加 `-fg`，`-accent` 是悬停背景档；`@theme` 映射一一对应，此外没有任何颜色槽位；浮层背景与焦点环是方案机制值，由 `index.css` 派生。
3. 逐 token 去处：

   1. `background` — 日间纯白画布：页面底层、卡片与输入框的静止背景（浮层背景亮档也是它），也是深色实心块上白字的来源。
   2. `foreground` — 黑色文字色：正文、标题、描边与硬阴影（与 `border` 同值），也是夜间深色实心块上黑字的来源；本方案没有灰阶正文。
   3. `surface` — 黄绿（lime）背景色：Hero 与横幅、侧栏、长文表头与行内 code 的填充、成功提示的背景；不用作正文颜色。
   4. `surface-fg` — lime 背景上的次要文字与禁用态文字（日 `#1a1a1a` / 夜 `#d9d9d9`）。
   5. `accent` — 亮黄（yellow-300）背景色：任何可交互表面的悬停背景、输入框聚焦填充、空槽骨架填充。没有品牌含义，不能替代 `primary`。
   6. `accent-fg` — `accent` 与 lime 背景上的黑色文字（对比 15.83 / 16.17，全过 4.5）。
   7. `border` — 全局唯一描边色（纯黑 / 纯白随日夜互换）：2px（桌面 4px）承重描边、分隔线、焦点描边；灰色边框由 lint 拦截。
   8. `primary` — 粉色品牌背景：CTA、选中态、选区、卡片悬停的阴影色、进度填充；不用作正文颜色。
   9. `primary-fg` — pink 背景上的黑色文字（压 pink-600 为 4.63）。
   10. `primary-accent` — 品牌深化档 pink-700：按压 / 激活；悬停不用它（悬停恒为亮黄 `accent`）。
   11. `danger-fg` — 错误块上的文字色（red-900，亮暗同档）。
   12. `danger` — 错误块静置背景（日 red-300 / 夜 red-200）。
   13. `danger-accent` — 错误块的悬停背景（日 red-200 / 夜 red-300）。
   14. `info-fg` — 信息块上的文字色（blue-900，亮暗同档）：画布上的信息文字与正文链接语义色。
   15. `info` — 信息块静置背景（日 blue-300 / 夜 blue-200）。
   16. `info-accent` — 信息块的悬停背景（日 blue-200 / 夜 blue-300）。
   17. `warning-fg` — 警示块上的文字色（yellow-900，亮暗同档）。
   18. `warning` — 警示块静置背景（日 yellow-300 / 夜 yellow-200）。
   19. `warning-accent` — 警示块的悬停背景（日 yellow-200 / 夜 yellow-300）。
   20. `success-fg` — 成功块上的文字色（green-900，亮暗同档）。
   21. `success` — 成功块静置背景（日 green-300 / 夜 green-200）。
   22. `success-accent` — 成功块的悬停背景（日 green-200 / 夜 green-300）。

4. 对比度：全部令牌在亮、暗两档满足 WCAG AA（≥ 4.5:1，实测值见 schemes.md 规则 3）。语义块上文字恒读 `-fg`（900，亮暗同档）：日间 300 / 200 两档、夜间 200 / 300 两档均叠 900 深字——语义块夜间翻为浅粉彩块，不随画布黑白反转。

## Typography

1. 两族：**标题用 sans（Inter，字重 900）**，**正文与控件用 mono**——等宽正文是识别点，禁止换 Inter / Roboto / Geist 当正文。字号阶梯 **px 锁定不随断点变**，组件串禁止 `md:text-*` / `lg:text-*`；唯一例外是 `headline` 展示档——clamp 随视口流动；行盒锁 1.1（`5xl` / `6xl` 为 1，`headline` 同为 1）。
2. 档位表：

   | 档            | 工具类                                                      | 字号                     | 字重 | 用途                             |
   | ------------- | ----------------------------------------------------------- | ------------------------ | ---- | -------------------------------- |
   | `headline`    | `typo-headline`                                             | clamp 36px → 60px（随视口） | 900  | 仅首屏 / 展示时刻，每屏至多一个  |
   | `kicker`      | `typo-kicker`                                               | 26px / 900 / +0.1em 大写 | 900  | 首屏引导行（正文 × φ 黄金档，mono） |
   | `h1`–`h2`     | `text-h1 leading-head tracking-tight`                       | 30px / 24px              | 900  | 页面与章节标题，靠字重与描边分级 |
   | `h3`–`h6`     | `text-h3`…`text-h6`                                         | 22 / 20 / 18 / 16px      | 700  | 子章节；**严禁跳级**             |
   | `body`        | `font-mono text-base leading-body`                          | 16px / 1.625             | 400  | 段落                             |
   | `label`       | `text-label font-black uppercase tracking-label case-label` | 16px / 900 / +0.1em 大写 | 900  | 控件与字段标签                   |
   | `overline`    | `typo-overline`                                             | 12px / 900 / +0.1em 大写 | 900  | 首屏与分区眉标（mono）           |
   | `field`       | `text-field leading-field font-bold`                        | 16px / 1.4               | 700  | 输入框内的文字                   |
   | 行内 code     | `text-sm`（mono，长文作用域自动填充黄绿）                   | 14px                     | 500  | 标题与正文里的行内代码           |
   | 表格里的 code | `text-table-code`                                           | 14px                     | 500  | 单元格密度最高的一档             |

3. 规则：标题只靠字重与大字号表达，不引入额外 webfont；**禁止灰字弱化**——区块小标题写 `text-sm font-black uppercase tracking-[0.2em] text-foreground border-b-2 border-border pb-2 mb-6`，层级靠字号与描边；正文行高 ≥ 1.5；禁止两端对齐；**小屏可聚焦输入字号不得低于 16px**，这条下限由方案保证；错误与空状态文案写清「问题 + 下一步动作」。
4. 长文作用域：规则同 minimal 同形（`typography` 类约定无组件、`@scope (.typography) to (.not-typography)`，特异度与优先级原理见 minimal 的 Typography 节；单挂家族 `typo-*` 见 schemes/typography.md 蓝图）。本方案同段不同相：**Inter 900 标题压在 mono 正文上，整条长文道统一 2px 前景色描线**（长文承不住 `--stroke` 桌面档 4px 的海报重量），chip 与表头 lime `surface` 填充，全直角。岛挂 `not-typography` 隔离；业务禁止在容器里重抄作用域已经给的东西。

## Layout

1. **尺寸给两档是本方案的宪法**：边框、阴影、位移、留白、分隔线厚度在 `@media (width >= 48rem)` 整体翻倍，移动端数值 ≈ 桌面端 50%。两个例外：**字号 px 锁定不翻倍**，**控件高度是常量也不翻倍**（44px 命中区不变量）。
2. 角色数值表：

   | 角色           | 写法                            | 桌面档              |
   | -------------- | ------------------------------- | ------------------- |
   | 区块节奏       | `py-12`                         | `md:py-24 lg:py-32` |
   | 容器内边距     | `px-4`                          | `md:px-8 lg:px-12`  |
   | 卡片留白       | `p-6`                           | `md:p-8`            |
   | 兄弟间隙       | `gap-4`                         | `md:gap-6`          |
   | 控件水平内边距 | `px-6`（`--padding-control-x`） | `md:px-8`           |

3. 留白没有命名档代持，直接写数字尺度：单基础值 `--spacing` 0.375rem（6px 栅格，默认案 0.25rem 的 1.5 倍），语义档只作文档约定（`xs`≡1 / `sm`≡2 / `md`≡3 / `lg`≡4 / `xl`≡6 / `2xl`≡8）；基础值之外的自造档位禁止，禁止手写固定 px。少数内联样式读 `--pad-block`（3rem / 6rem / 8rem），必须与区块节奏三档同值。
4. 断点两档：48rem / 64rem（Tailwind 的 `md` / `lg` 前缀，写在 utility 串上，不是令牌）；长文栏自己的 80rem 分界线不占这两档。
5. 命中区：`--height-control` 2.75rem 常量不翻倍；三条车道、外扩互压 12px 判据、连体组让位、输入壳热区细则见 ui-rules 技能 `operable.md` 8–12、23–25 条；可点行保持块级布局用 `py-tight|snug|loose` 反解（行盒 1.2 / 1.25 / 1.625rem）；禁止为组件开 `data-size` 尺寸阶梯，禁止为组件新造令牌命名空间。
6. 内容宽度走 `--spacing` 数字乘道、随案缩放（neo 1.5×）：说明文本与正文列 `max-w-168`（42rem），窄栏 `max-w-144`（36rem）；`--container-*` 只任 `@container` 断点不作宽度 utility。同一元素只挂一枚宽度 utility。

## Elevation & Depth

1. 阴影是**实体偏移，模糊半径恒为 0**，形态 `Xpx Xpx 0 0 前景色`。档位只从命名阶梯取，写名字不写字面量：

   | 档                                        | 值（移动 / 桌面）          | 用途                                |
   | ----------------------------------------- | -------------------------- | ----------------------------------- |
   | `shadow-brutal-2`                         | 2px                        | 透明背景色角色 hover 时补回的第一档 |
   | `shadow-brutal-4` / `md:shadow-brutal-8`  | 4px / 8px                  | 静止承重面（按钮、卡片、输入外壳）  |
   | `shadow-brutal-6` / `md:shadow-brutal-12` | 6px / 12px                 | hover 与 focus 的抬升一档           |
   | `shadow-accent-6` / `md:shadow-accent-12` | 6px / 12px，色为 `primary` | 可点卡片的 hover 阴影换色           |
   | `shadow-none`                             | 清零                       | 按下（Physical Crushing）与禁用     |

2. `--shadow-*` 默认命名空间被整档删除，`shadow-sm|md|lg|xl|2xl` 与 `drop-shadow-*` 在本车道根本不生成。透明背景色角色要取消上一档必须 `shadow-none md:shadow-none` **两条都写**（`cn` 只取消同前缀的类）。
3. **边框与阴影成套**（与 minimal 的「二选一」相反）：凡承重的面同带 `border-2 md:border-4 border-border` 与一档硬阴影；半档表面（行内状态标签）只描边、不承重，没有阴影。容器自带边界宿主复位；业务侧出口只有 `data-border="none | solid"`。例外：轻提示（Tooltip / Toast）是不承重的浮层，只有描边、没有阴影（`shadow-hint` 答 `none`）。
4. 焦点：2px 硬描边 outline（`--focus-outline: 2px solid var(--foreground)`，offset 2px）+ 抬升一档阴影，**禁止发光与柔和阴影**（`--focus-glow: none`）。方案不设全局 `:focus-visible` 兜底——每个可聚焦件由皮肤显式挂 `focus-visible:focus-ring` 或由外壳洪泛自答，内层件不挂即无环。焦点环禁止消失，允许换形态（背景色洪泛），不得只去掉 outline 而不给替代。
5. 滚动条：硬边方块——12px 宽、`foreground` 色滑块、2px 背景色描边、无圆角（`-webkit-` 专有属性：标准 thin scrollbar 会被渲染成圆头胶囊）；箭头按钮隐藏、corner 透明；Firefox 车道（`@-moz-document`）标准属性答 `thin` + `var(--foreground)`。标准属性不得出现在 Chromium——非初始值会丢弃 webkit 定档、退化为覆盖式滚动条自动隐藏；组件层一律不设 scrollbar 样式。
6. 暗档：深度仍由描边与硬阴影读出，`--foreground` 转白后阴影自动跟着反转（阴影色就是 `var(--foreground)`），不引入任何发光。

## Shapes

1. **全直角是唯一形状答案**：`@theme` 用 0px 回答半径阶梯每一档，共享代码写来的 `rounded-lg` 在这里得到直角而不是不生成——两套方案都答了这个维度，切换方案时改变的是观感而不是丢失。皮肤禁止写 `rounded-full`（静态圆不读令牌，谁也答不成 0）——圆点、胶囊、圆钮一律 `rounded-pill`（本方案答 0px，得直角），本方案无圆形。禁用态不用圆角表达，用虚线边框表达。

## Components

1. 所有交互组件共享五态，各态去处固定；皮肤写角色名，本方案给每一档答的值——切换方案时这一列换成另一套答案，皮肤不动：

   | 状态     | 皮肤写的角色                                                                                            | 本方案答的值                                                   |
   | -------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
   | Default  | `border-control`（按钮）/ `border-frame`（卡片）+ `shadow-frame` / `shadow-block` + 静止面背景色        | `--stroke` 2px→4px；硬阴影 4→8                                 |
   | Hover    | 背景色**硬切** `hover:bg-accent hover:text-accent-fg` + 阴影升一档 + `hover:lift`                       | 阴影 6→12；`--translate-lift` 0rem——hover 不位移（平移会把停在边缘的指针移出盒子，hover 反复抖动），位移通道只留按压 crush |
   | Active   | `active:crush active:shadow-frame-active`                                                               | 位移等于静止阴影偏移并清零：`--translate-crush` 0.25rem→0.5rem |
   | Focus    | `focus-visible:focus-ring`；输入族由外壳背景色洪泛回答                                                  | 2px 硬描边 + 阴影 6→12                                         |
   | Disabled | `disabled:border-dashed disabled:shadow-frame-disabled`，压暗与禁指针由 `index.css` 的 `@layer base` 给 | 阴影清零、边框转虚线，不改背景色                               |

2. 动效：时长三档 `--duration-sm` 0ms（颜色）/ `--duration-md` 150ms（位移与阴影）/ `--duration-lg` 200ms（进出场），缓动统一 `ease-out`。transition 列表**只允许位移与阴影**（`motion-frame` 只携带这三项）；禁止 `transition-all`；禁止 opacity 过渡或半透明染色代替背景色硬切。`prefers-reduced-motion` 与 `data-motion` 开关在 `index.css` 的 `@layer base` 收口，业务动效用 `motion-safe:` 前缀。
3. 可点条目的交互态全库走两枚共享 token，组件不得另设：悬停吃 `accent` 对（`hover:bg-accent hover:text-accent-fg`），选中 / 激活吃 `primary` 对（`bg-primary text-primary-fg`）——菜单项、列表行、树行、下拉选项、命令行、标签页、分段项、日历格、表格行、TOC 项一视同仁；键盘高亮（`data-highlighted`）与指针悬停同观感；两档背景色硬切实心色，不做透明染色。
4. 按钮档位按同排内容选，不按好看选：同排同优先级不许出现 `bg-primary`；次高 outline（`bg-background text-foreground` + 硬阴影）；danger 只标危险动作（`bg-danger`，块上文字随画布）；同排有文字读数用文字角色（透明背景色、文字色恒 `foreground`，hover 加下划线、不换色不换底）；同排无文字也不分优先级默认 outline。基准串正本 `app/ui/skins/button.tsx`，写角色名不写字面量。
5. 骨架脉冲：走核心模板 `animate-pulse`，本方案在 `@theme` 把 `--animate-pulse` 重答为硬两档切 opacity（0–49% 全亮、50–100% 0.85，linear——本语言没有渐变洗色）；**必须配 `motion-safe:` 前缀**。
6. 共享皮肤层写的语义档：`shadow-faint` / `shadow-subtle` = `shadow-brutal-2`、`shadow-base` = `shadow-brutal-4`；`shadow-elevated` / `shadow-surface` 是 `@media` 里翻倍的裸变量（elevated 移动 6px / 桌面 12px；surface 4px / 8px）；`shadow-hint` = `none`（轻提示例外：Tooltip / Toast 只有描边、不带阴影）；`border-hair` / `border-frame` / `border-control` 都读 `--stroke`（2px → 4px）；字重三角色 `font-field` / `font-emphasis` / `font-strong` = 700 / 700 / 900，标签字体档 `font-label` = mono 族 + `font-strong`；`line-cap` / `line-join` 答 `butt` / `miter`（SVG 初始值——本方案的线切平）。
7. Avatar 专属令牌：`disc`（`--radius-disc` 0px）。
8. 未迁移组件档位短条（随各组件重构迁入其皮肤蓝图）：

   1. Card：`rounded-lg` + `border-frame` + `p-panel` + `background`/`foreground` + `shadow-block`；可点卡再接 `hover:lift` / `active:crush` / `hover:shadow-block-hover`；静态卡禁一切 hover 动效。
   2. 输入族：外壳承重（边框 + 硬阴影 + `min-h-control`），内层输入元素 `bg-well` lime 井底、`border-0 outline-none`；聚焦 = 外壳背景色整壳换 `accent` 配 `accent-fg`；`invalid` 换 `danger`，不复用默认焦点。
   3. 行内状态标签：半档底色不承重、无阴影；基准底色 `surface` 配 `surface-fg`，primary 档底色 `--primary`，状态变体填语义背景色档（info / danger 深块的文字取 `background`（日白夜黑），success / warning 亮块配恒黑 `accent-fg`）。

9. SwipeActions 行体为方角轨道面（同 Banner），不用圆角（全直角宪法）。
10. 组容器井（well）：`--padding-well` 0、`--color-well` 答 `surface`（lime 色井）、`--shadow-well` `none`——字段族井底与 Segment 轨道平涂 lime、全直角、无拟态阴影，井读法退化为「色井贴边的扁平字段」；浮起药丸读 `background` 与 lime 轨道分离（取值以皮肤蓝图 `ui/skins/segment.md` 为准）。

## Do / Don't（方案语言边界）

1. 禁圆角：任何非零半径；本方案皮肤只写 `rounded-none` 与 `rounded-pill`（后者在本方案答 0px），禁止 `rounded-full` 与任何字面圆角值。
2. 禁模糊阴影：`shadow-sm|md|lg|xl|2xl`、`drop-shadow-*`、任何 blur > 0 的自定义阴影。
3. 阴影一致性：可交互组件的承载面必有阴影（`shadow-frame` 系——checkbox / radio / switch 的控制面、upload 投放区、分页数字盒、色样、独立 List 框等）；纯展示件可不带；`text` 变体按钮豁免（不加阴影与动效）。浮层族（popover / dialog / drawer / menu / select 面板）走 `shadow-elevated`，轻提示族 `shadow-hint` 本方案答 none。
4. 禁灰边框（`border-gray-*` / `border-slate-*` / `border-neutral-*`）与灰正文——弱化的文字用前景色深档，不用中间灰。唯一例外（用户定 2026-11-20）：日历外月日期文字 50% 透明（`text-foreground/50`，全案皮肤约定，见 schemes.md 蓝图第 18 条），为用户接受取舍。
5. 禁 tint 色档（`color-mix(… transparent)`、`bg-primary/10`）；禁颜色参与过渡——`transition-all` 与任何把 color / background / opacity 列入的 transition 列表；禁止用 opacity 过渡或半透明染色代替背景色硬切。
6. 禁柔化缓动：`bounce`、`elastic`、spring 曲线。
7. 禁把填充色当正文字色（正文级彩色只有语义四色）；禁止前景色与档位错配——黑色前景压日档深填充只有 3.56–4.26（不过 4.5），白色前景压夜档亮填充同理。
8. 禁按钮 active 位移小于静止阴影偏移（压不平就失去碾压感）；禁 hover 只用位移替代阴影增长（hover 必须更重）；禁柔和阴影或 focus 发光；禁 `focus:outline-none` 而不给替代描边。
9. 禁组件串里出现 `md:text-*` / `lg:text-*`：字号 px 锁定。
10. 禁单侧粗边框装饰（`border-l-*` / `border-r-*` 强调条）、卡片套卡片、彩色背景上放灰字；禁每个区块标题上方一枚 tiny uppercase 眉标；禁 Inter / Roboto / Geist 当正文字体。
11. 通用外观禁令见 delivery 技能，无障碍下限见 ui-rules 技能，此处不重述。
12. 交付自检：全直角无残留（装饰圆除外）；阴影全部命名档且模糊为 0；边框 `border-2 md:border-4`；位移与阴影走 `duration-150 ease-out`，背景色不在列表；hover 阴影增大一档、只有 active 清零；active 位移等于静止阴影偏移；焦点是 2px 硬描边；填充上的前景色恒黑；控件高度未翻倍；边框、阴影、留白都给了两档；日夜两档一眼可分辨；替换示例内容后页面**仍一眼识别为新野兽派**。
