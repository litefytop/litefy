---
version: alpha
name: Litefy UI — Neo-Brutalist
description: Design language of the Litefy UI neo-brutalist style template — black and white carry the day structure, at night the canvas and ink reverse to pure black on white-outlined blocks while the surface and brand hues swap places (lime brand, pink container) and the yellow hover lane stays fixed across both tiers; every corner is square, and every shadow is a solid, unblurred offset; every palette token answers a literal colour and every background ships a paired foreground that clears WCAG AA on both the resting and the hover tier. The YAML block is the sole numeric authority for tokens; the prose states rules and destinations.
colors:
  background: 'oklch(96% 0.014 85)'
  foreground: '#000000'
  surface: 'oklch(89.7% 0.196 126.665)'
  surface-fg: '#000000'
  disabled: 'oklch(92.2% 0 none)'
  disabled-fg: 'oklch(43.9% 0 none)'
  surface-raised: '#ffffff'
  surface-raised-fg: '#000000'
  accent: 'oklch(90.5% 0.182 98.111)'
  accent-fg: '#000000'
  border: '#000000'
  primary: 'oklch(52.5% 0.223 3.958)'
  primary-fg: '#ffffff'
  primary-accent: 'oklch(40.8% 0.153 2.432)'
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
  dark-surface: 'oklch(52.5% 0.223 3.958)'
  dark-surface-fg: '#ffffff'
  dark-disabled: 'oklch(26.9% 0 none)'
  dark-disabled-fg: 'oklch(70.8% 0 none)'
  dark-surface-raised: 'oklch(20.5% 0 none)'
  dark-surface-raised-fg: '#ffffff'
  dark-accent: 'oklch(90.5% 0.182 98.111)'
  dark-accent-fg: '#000000'
  dark-border: '#ffffff'
  dark-primary: 'oklch(89.7% 0.196 126.665)'
  dark-primary-fg: '#000000'
  dark-primary-accent: 'oklch(76.8% 0.233 130.85)'
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
    fontFamily: '{typography.sans.fontFamily}'
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
  base: 0.25rem
  pad-block: 3rem
components:
  avatar:
    rounded: '{rounded.disc}'
recess:
  shadow: none
  dark-shadow: none
  radius-inner: 0px
---

## 总览

1. 本文件是 **neo-brutalist 这套风格唯一的规则正本**，描述设计语言，不是 Litefy UI 总说明书——库内组件清单、装配方式、逐属性 API 与可运行示例归组件文档。往本文件加内容前先问：这是 neo-brutalist 的设计约束，还是与风格无关的用法说明？后者外链组件文档，不抄进来。
2. 权威分工：文件头 YAML 块是 token **数值的唯一权威**；本方案 `index.css` 的 `@theme` 是其实现，两边逐档对齐，不一致以 YAML 为准并报告冲突。组件槽位与角色档位归 `.agents/blueprints/ui/skins/<name>.md`；通用外观律归 delivery 技能；无障碍下限归 ui-rules 技能——本文件只答方案数值与方案语言边界。
3. 外观通道：本方案把 Tailwind utility 类名当自己的词汇表，组件外观住共用皮肤层 `app/ui/skins/*.tsx` 的 utility 串里；`index.css` 只放 utility 串表达不了的东西——令牌阶梯、`@custom-variant`（把消费者声明的档位接进 utility）、`@layer base` 全局行为、无对应命名空间的 `@utility` 角色类、全案同构的 `bg-*` 填充家族（蓝图 rule 4，本方案 `--fill-*` 全答 `none`，渲染与核心生成的纯色一致）。包内没有第二份 CSS。`@theme` 里 `--color-*` 与 `--shadow-*` **整命名空间删除**，`bg-blue-500` / `shadow-lg` 根本不生成；`--radius-*` 不删除而是**每一档答成 0px**——共享代码写来的 `rounded-lg` 在本车道得到直角，而不是什么都得不到。
4. 皮肤导出的 utility 串：走不到组件入口的宿主（渲染不出 `<button>` 的 `<Link>`、自己组合外框的字段壳）组合皮肤导出的串过本方案的 `cn` 合并（`buttonBase` / `buttonFrame` / `cardClasses` / `chipClasses` 等，正本 `app/ui/skins/index.ts` 与各皮肤文件）。这条道没有 `data-variant` 接线——要哪个角色就把对应的串传进 `cn`；两套方案经各自 `index.css` 回答同一份串。
5. 三条契约：**令牌是唯一数值来源**（皮肤串禁 `shadow-[4px_4px_0_0_#000]` 字面量，档位名才跟两档阶梯走）；**皮肤层是唯一外观通道**（骨架零 class 只发逻辑态；档位 `data-variant` 由 `@custom-variant` 接进 utility——`quiet` / `plain` / `borderless` / `bordered`，档位值住皮肤）；**交互态归方案层**（五态业务不手写）。
6. 整体观感：暖纸画布上的纯黑粗描边、零模糊实体偏移阴影、全直角、高对比平涂色块；日间画布 `oklch(96% 0.014 85)`（实测值：黑字 18.65:1），卡面与浮层答机制值 `surface-raised` 纯白（实测值：黑字 21.00:1）——画布让出最亮位给内容容器，明度分层律见 `ui/schemes.md` 第 21 条；夜档画布与前景反转（纯黑画布、纯白文字、描边与硬阴影），表面与品牌色相对调——夜 `surface` 取那枚粉配白字、夜 `primary` 取那枚酸橙绿配黑字，悬停面日夜同为亮黄配黑字。识别点：**黑白承重、粗边框、硬阴影、全直角、指定填色、硬切不淡出**。风格收敛律（`ui/schemes.md` 第 26 条）下的签名清单五项：**硬偏移纯色阴影（静置 4px / hover 6px 档）、2px 实线边框、零圆角、yellow-300 悬停强调档（日夜同值）、夜间画布反转与粉绿对调**——签名之外的排版节奏类参数（间距基数、行高、默认字体、标签大小写）全案同构，不承载风格。
7. 设计意图：新野兽派源于建筑领域的野兽派运动——原始、未经修饰、功能先行，反对一切柔化：不圆角、不渐变、不发光、不淡出。层级由描边重量、字号与位移建立，禁止透明度或灰字；颜色不是装饰，说不出某块色标的是哪个动作或状态，它就不该出现。
8. 冲突裁决：用户明确要求 > 本规范 > 模型自己的品味；违反硬性禁令时先说明并给合规替代，再按用户最终决定执行。代码审计只记录问题、不自动修复，等待指令处理。

## Colors

1. 面积预算 **6 / 3 / 1**：结构（文字、描边与硬阴影，日黑字黑边、夜白字白边）占 6，表面与状态（日间 `surface` 的 lime、`accent` 的 yellow；夜间 `surface` 换成粉、`accent` 仍是那枚黄）占 3，品牌（`primary` 的 CTA 与选中，日粉夜绿）占 1。彩色全部取 Tailwind v4 色板具名档位：pink-700 / pink-900 / lime-300 / lime-500 / yellow-300 加语义四族的 200 / 300 档；**夜间不新造色相**，只做两件事——画布与前景反转（`background` 纯黑、`foreground` 与 `border` 纯白），表面与品牌色相对调（夜的 `primary` 用日 `surface` 那枚绿、夜的 `surface` 用日 `primary` 那枚粉）；`accent` 悬停档日夜同值，永远是那枚亮黄配黑字。夜间硬阴影随 `foreground` 转白。实测：夜白描边对画布 / 表面粉 / 浮层为 21.00 / 6.11 / 17.91，夜间品牌黑字与其悬停黑字 16.12 / 10.69，夜间表面白字 6.11，黄面黑字日夜同值 15.91。运行期换色梯见本节第 5 条，取色纪律不变。
2. 色板 24 枚加一枚浮层成对槽（`surface-raised` / `surface-raised-fg`），亮暗各一套（构成与数值见 YAML）。后缀语法全系统一致：背景色不带后缀，文字色加 `-fg`，`-accent` 是悬停背景档，配对由主体 `-fg` 兼任；`@theme` 映射一一对应，此外没有任何颜色槽位；焦点环是方案机制值，由 `index.css` 派生。成套、禁衍生、状态档配对与车道可辨按 `ui/schemes.md` 第 24 条：每枚背景配一枚前景，同一枚 `-fg` 对静置背景与 `-accent` 档都实测 ≥4.5:1，皮肤换底就换该档配对前景；本案色板逐枚字面定色，`color-mix()` 与透明斜杠不出现。
3. 逐 token 去处：

   1. `background` — 日间暖纸 `oklch(96% 0.014 85)`、夜间纯黑 `#000000` 画布：页面底层与主内容区的静止背景。卡片、输入框与浮层不共用它——内容容器与浮层读成对槽 `surface-raised`（日纯白 / 夜 `oklch(20.5% 0 none)`）。
   2. `foreground` — 日间纯黑、夜间纯白 `#ffffff` 的文字色：正文、标题与透明背景上的控件文字；描边与硬阴影另读 `border` 与 `shadow-color`，二者夜间同转白。
   3. `surface` — 日间酸橙绿 lime-300 `oklch(89.7% 0.196 126.665)`、夜间粉 pink-700 `oklch(52.5% 0.223 3.958)`（与 `primary` 对调）：Hero 与横幅、侧栏、长文表头与行内 code 的填充、成功提示的背景；不用作正文颜色。
   4. `surface-fg` — `surface` 背景上的表面文字与图标（日纯黑 16.12 / 夜纯白 6.11，实测值）；画布与透明背景读 `foreground`，浮层读 `surface-raised-fg`；禁用态文字统一读 `disabled-fg`。
   5. `surface-raised` — 内容容器与浮层背景（日纯白 / 夜近黑 `oklch(20.5% 0 none)`，对夜画布道距 0.205）：与 `background` 分层的机制槽，成对律照第 24 条走。
   6. `surface-raised-fg` — 浮层与内容容器上的文字与图标（日黑 21.00 / 夜白 17.91，实测值）；浮层不再借 `foreground` 定字色。
   7. `accent` — 亮黄 yellow-300 `oklch(90.5% 0.182 98.111)`，**日夜同值固定**：任何可交互表面的悬停背景、输入框聚焦填充、空槽骨架填充。夜间不得转中性档——它是夜档唯一的行为强调面（道距：对画布 0.923 / 对表面粉 0.483 / 对浮层 0.723，实测值）。没有品牌含义，不能替代 `primary`。
   8. `accent-fg` — `accent` 背景上的文字色，日夜同为纯黑，对黄面 15.91（实测值）；任何落到黄面的文字与图标都读它，不继承 `foreground`。
   9. `border` — 全局唯一描边色（日间纯黑 / 夜间纯白）：2px 恒定承重描边、分隔线与控件边界；夜档对画布、表面粉与浮层为 21.00 / 6.11 / 17.91（实测值），压黄悬停面只有 1.32——黄面内的描边改读 `accent-fg`（见本节第 4 条边界）。
   10. `primary` — 品牌背景：日间粉 pink-700 `oklch(52.5% 0.223 3.958)`、夜间酸橙绿 lime-300 `oklch(89.7% 0.196 126.665)`，与 `surface` 对调：CTA、选中态、选区、卡片悬停的阴影色、进度填充；不用作正文颜色。
   11. `primary-fg` — `primary` 背景上的文字色，随品牌档走：日档白（压粉 6.11）、夜档黑（压绿 16.12），实测值；两档对各自 `-accent` 也达标（9.69 / 10.69）。
   12. `primary-accent` — 品牌同族加深档：日 pink-900 `oklch(40.8% 0.153 2.432)`、夜 lime-500 `oklch(76.8% 0.233 130.85)`（道距 0.136 / 0.135，实测值）：primary 按钮悬停 / 按压；其他交互面仍读 `accent`。悬停方向与语义四族一致——静置→悬停同族换一档，配对前景不换。
   13. `danger-fg` — `danger` 与 `danger-accent` 背景上的文字色（red-900 `oklch(39.6% 0.141 25.723)`，日夜同值，对两档 5.24 / 6.94，实测值）；独立错误文字、图标与边框挂 `text-danger-independent` / `border-danger-independent`，亮档读 `danger-fg`、暗档读 `danger-accent`。
   14. `danger` — 错误块静置背景（red-300 `oklch(80.8% 0.114 19.571)`，日夜同值）。
   15. `danger-accent` — 错误块的悬停背景（red-200 `oklch(88.5% 0.062 18.334)`，日夜同值）：语义四族两档共用一套值，静置→悬停同族减淡一档，块上文字始终是那枚 900 深字；暗档独立状态文字也读这一档（保持背景档冻结前的夜档文字亮度）。
   16. `info-fg` — `info` 与 `info-accent` 背景上的文字色（blue-900，日夜同值）；独立信息文字、图标与边框挂 `text-info-independent` / `border-info-independent`，亮档读 `info-fg`、暗档读 `info-accent`；正文链接同法。
   17. `info` — 信息块静置背景（blue-300，日夜同值）。
   18. `info-accent` — 信息块的悬停背景（blue-200，日夜同值）。
   19. `warning-fg` — `warning` 与 `warning-accent` 背景上的文字色（yellow-900，日夜同值）；独立警示文字、图标与边框挂 `text-warning-independent` / `border-warning-independent`，亮档读 `warning-fg`、暗档读 `warning-accent`。
   20. `warning` — 警示块静置背景（yellow-300，日夜同值）。
   21. `warning-accent` — 警示块的悬停背景（yellow-200，日夜同值）。
   22. `success-fg` — `success` 与 `success-accent` 背景上的文字色（green-900，日夜同值）；独立成功文字、图标与边框挂 `text-success-independent` / `border-success-independent`，亮档读 `success-fg`、暗档读 `success-accent`。
   23. `success` — 成功块静置背景（green-300，日夜同值）。
   24. `success-accent` — 成功块的悬停背景（green-200，日夜同值）。
   25. `disabled` — 禁用控件背景色；四案同答固定中性灰（亮档灰 200 档 92.2，暗档灰 800 档 26.9，用户定 2026-11-26 下沉改档），不随本案身份色表面档变化；与静态三档不再设道距要求，沉向背景是禁用的预期语义；与悬停档错开一阶（亮 92.2 对 yellow-300 ΔE 0.183、暗 26.9 对 90.5 ΔE 0.661）。
   26. `disabled-fg` — 禁用控件文字、图标与边框色；与 `disabled` 保持可读对比（本案亮 6.19:1、暗 5.83:1）。

4. 对比度：文字、图标与边框按实际背景配对，普通文字在亮、暗两档满足 WCAG AA（≥ 4.5:1）。成套与状态档配对按 `ui/schemes.md` 第 24 条：同一枚 `-fg` 对该角色的静置背景与 `-accent` 档两档都达标，皮肤换哪档背景就写那档的配对前景（`hover:bg-accent hover:text-accent-fg`），日夜同串不分叉。日档成套实测 5.24–21.00，夜档同一套值（语义四族背景日夜同值，其余角色夜档另表）。日 `foreground` 压画布 18.69、`surface-fg` 压 lime 16.12、`accent-fg` 压 yellow 15.91、`primary-fg` 压粉与其悬停档 6.11 / 9.69、浮层 21.00、禁用 6.20；夜 `foreground` 压黑 21.00、`surface-fg` 压粉 6.11、`primary-fg` 压绿与其悬停档 16.12 / 10.69、浮层白字 17.91、禁用 5.83，`accent-fg` 对黄面两档同为 15.91。悬停道距实测（OKLab）：日 0.177 / 0.095 / 0.205、夜 0.923 / 0.483 / 0.723（画布 / 表面 / 浮层 → `accent`），品牌同族加深 0.136 / 0.135。独立状态文字、图标与边框挂 `text-<status>-independent` / `border-<status>-independent`，亮档读 `<status>-fg`、暗档读 `<status>-accent`（背景档冻结后夜档文字亮度不变：danger 14.49 / info 14.76 / success 17.35 / warning 18.04 压纯黑画布，压 `accent` 黄面 1.08–1.14）；状态块及其悬停背景上的文字读对应 `<status>-fg`。语义四族背景日夜同值，同一枚 `<status>-fg` 压静置与悬停两档实测 danger 5.24 / 6.94、info 5.74 / 7.31、success 6.49 / 7.49、warning 6.57 / 7.47（实测值）。两条边界（黄面专属）：夜间白描边压黄面 1.32、夜间独立状态文字压黄面 1.08–1.14——凡落到 `accent` 面的描边与彩色文字，同串改读 `accent-fg` 的黑（`hover:border-accent-fg`），黄面内不并存第二种前景。

5. 运行期换色梯（蓝图 `ui/schemes.md` 第 23 条，用户定 2026-11-26）：开 `[data-brand]` 与 `[data-accent]` 两梯，值住 `index.css` 的 ramp 块。brand 梯 14 档（default + 13 色相）：日档 `--primary` 复用 minimal 日档同名值（深色阶，白字），`--primary-accent` 按 oklch L×0.82 深化派生；夜档答 300 → 500 档深化对（黑字），default 档夜答 lime-300 / lime-500（与 `:root` / `.dark` 同值）。`--primary-fg` 恒白 / 黑，不随档变。accent 梯 12 档（default yellow-300 + 11 色相）：300 档高彩阶 + 黑字，日夜同值；indigo（彩度 C 0.065 < 0.08）与 lime（与日间身份表面同值，道距 0）不进梯。成套实测（临时脚本逐档核算，实测值）：brand 日档白字对静置与 `-accent` 两档最低 4.96 / 7.46，夜档黑字最低 4.59 / 4.77，同族道距最低 0.061；accent 梯黑字最低 8.83，车道道距日 / 夜最低 0.095 / 0.289。锁件：`--background`、`--foreground`、`--border`、`--stroke`、`--shadow-brutal-*`、`--radius-*` 与 `--surface` 身份色不随梯动（第 26 条签名不开放换色）。

## Typography

1. 两族：**标题用 sans（Inter，字重 900）**，**正文与默认字体回归 sans**（排版节奏类参数不承载风格，收敛律见 `ui/schemes.md` 第 26 条）；控件标签与字段沿用 mono 标签声（`font-label` 全案同构）。字号阶梯 **px 锁定不随断点变**，组件串禁止 `md:text-*` / `lg:text-*`；唯一例外是 `headline` 展示档——clamp 随视口流动；行盒锁 1.1（`5xl` / `6xl` 为 1，`headline` 同为 1）。
2. 档位表：

   | 档            | 工具类                                                      | 字号                     | 字重 | 用途                             |
   | ------------- | ----------------------------------------------------------- | ------------------------ | ---- | -------------------------------- |
   | `headline`    | `typo-headline`                                             | clamp 36px → 60px（随视口） | 900  | 仅首屏 / 展示时刻，每屏至多一个  |
   | `kicker`      | `typo-kicker`                                               | 26px / 900 / +0.1em 大写 | 900  | 首屏引导行（正文 × φ 黄金档，mono） |
   | `h1`–`h2`     | `text-h1 leading-head tracking-tight`                       | 30px / 24px              | 900  | 页面与章节标题，靠字重与描边分级 |
   | `h3`–`h6`     | `text-h3`…`text-h6`                                         | 22 / 20 / 18 / 16px      | 700  | 子章节；**严禁跳级**             |
   | `body`        | `text-base leading-body`                                    | 16px / 1.625             | 400  | 段落                             |
   | `label`       | `text-label font-black tracking-label case-label`           | 16px / 900 / +0.1em      | 900  | 控件与字段标签                   |
   | `overline`    | `typo-overline`                                             | 12px / 900 / +0.1em 大写 | 900  | 首屏与分区眉标（mono）           |
   | `field`       | `text-field leading-field font-bold`                        | 16px / 1.4               | 700  | 输入框内的文字                   |
   | 行内 code     | `text-sm`（mono，长文作用域自动填充 `surface`：日 lime / 夜下沉中性，文字读 `surface-fg`） | 14px                     | 500  | 标题与正文里的行内代码           |
   | 表格里的 code | `text-table-code`                                           | 14px                     | 500  | 单元格密度最高的一档             |

3. 规则：标题只靠字重与大字号表达，不引入额外 webfont；**禁止灰字弱化**——区块小标题写 `text-sm font-black uppercase tracking-[0.2em] text-foreground border-b-2 border-border pb-2 mb-6`，层级靠字号与描边；正文行高 ≥ 1.5；禁止两端对齐；**小屏可聚焦输入字号不得低于 16px**，这条下限由方案保证；错误与空状态文案写清「问题 + 下一步动作」。
4. 长文作用域：规则同 minimal 同形（`typography` 类约定无组件、`@scope (.typography) to (.not-typography)`，特异度与优先级原理见 minimal 的 Typography 节；单挂家族 `typo-*` 见 schemes/typography.md 蓝图）。本方案同段不同相：**Inter 900 标题压在 sans 正文上，整条长文道统一 2px 前景色描线**，chip 与表头 `surface` 填充（日酸橙绿配黑字 / 夜粉配白字），全直角。岛挂 `not-typography` 隔离；业务禁止在容器里重抄作用域已经给的东西。

## Layout

1. **尺寸只给一档**：`--stroke` 恒 2px、`--shadow-brutal-*` 恒定（静置 4px / hover 6px）、`--padding-control-x` 1.5rem 恒定、`--translate-crush` 0.25rem 恒定——桌面翻倍档随风格收敛撤销（`ui/schemes.md` 第 22 / 26 条）；字号 px 锁定、控件高度 2.75rem 常量本就不翻倍。页面级留白（区块节奏 / 容器内边距）仍可由页面自己给 `md:` / `lg:` 两档，那是版式选择，不再是方案强制。
2. 角色数值表：

   | 角色           | 写法                            | 桌面档              |
   | -------------- | ------------------------------- | ------------------- |
   | 区块节奏       | `py-12`                         | `md:py-24 lg:py-32` |
   | 容器内边距     | `px-4`                          | `md:px-8 lg:px-12`  |
   | 卡片留白       | `p-6`                           | `md:p-8`            |
   | 兄弟间隙       | `gap-4`                         | `md:gap-6`          |
   | 控件水平内边距 | `px-6`（`--padding-control-x`） | 恒定，不翻倍        |

3. 留白没有命名档代持，直接写数字尺度：单基础值 `--spacing` 0.25rem（4px 栅格，与其他案同构，全部乘道落整像素），语义档只作文档约定（`xs`≡1 / `sm`≡2 / `md`≡3 / `lg`≡4 / `xl`≡6 / `2xl`≡8）；基础值之外的自造档位禁止，禁止手写固定 px。粗野体量只由签名角色令牌承载（`--stroke` 2px、`--shadow-brutal-*` 硬偏移、`--pad-block` 3 / 4 / 5rem 三档），不由基础值承载。少数内联样式读 `--pad-block`（3rem / 4rem / 5rem），必须与区块节奏三档同值。
4. 断点两档：48rem / 64rem（Tailwind 的 `md` / `lg` 前缀，写在 utility 串上，不是令牌）；长文栏自己的 80rem 分界线不占这两档。
5. 命中区：`--height-control` 2.75rem 常量，全端恒定、无紧凑档（`ui/schemes.md` 第 11 条）；三条车道、外扩互压 12px 判据、连体组让位、输入壳热区细则见 ui-rules 技能 `operable.md` 8–12、23–25 条；可点行保持块级布局用 `py-tight|snug|loose` 反解（行盒 1.2 / 1.25 / 1.625rem）；禁止为组件开 `data-size` 尺寸阶梯，禁止为组件新造令牌命名空间。
6. 内容宽度走 `--spacing` 数字乘道：说明文本与正文列 `max-w-168`（42rem），窄栏 `max-w-144`（36rem）；`--container-*` 只任 `@container` 断点不作宽度 utility。同一元素只挂一枚宽度 utility。

## Elevation & Depth

1. 阴影是**实体偏移，模糊半径恒为 0**，形态 `Xpx Xpx 0 0 阴影色`。日间阴影色为 `foreground`（纯黑），夜档随它反转为纯白，由方案机制值 `--shadow-color` 单点回答；档位只从命名阶梯取，写名字不写字面量：

   | 档                   | 值                         | 用途                                |
   | -------------------- | -------------------------- | ----------------------------------- |
   | `shadow-brutal-2`    | 2px                        | 透明背景色角色 hover 时补回的第一档 |
   | `shadow-brutal-4`    | 4px                        | 静止承重面（按钮、卡片、输入外壳）  |
   | `shadow-brutal-6`    | 6px                        | hover 与 focus 的抬升一档           |
   | `shadow-accent-6`    | 6px，色为 `primary`        | 可点卡片的 hover 阴影换色           |
   | `shadow-none`        | 清零                       | 按下（Physical Crushing）与禁用     |

2. `--shadow-*` 默认命名空间被整档删除，`shadow-sm|md|lg|xl|2xl` 与 `drop-shadow-*` 在本车道根本不生成。透明背景色角色要取消上一档必须写 `shadow-none`。
3. **边框与阴影成套**（与 minimal 的「二选一」相反）：凡承重的面同带 `border-2 border-border` 与一档硬阴影；半档表面（行内状态标签）只描边、不承重，没有阴影。容器自带边界宿主复位；业务侧出口只有 `data-border="none | solid"`。例外：轻提示（Tooltip / Toast）是不承重的浮层，只有描边、没有阴影（`shadow-hint` 答 `none`）。选中/未选中环 `shadow-checked` / `shadow-unchecked` 是 blur 0 双环不是阴影；`--shadow-unchecked` 引用 `var(--shadow-frame)` 并入承重硬阴影，radio 未选中环不破承重律。
4. 焦点：2px 硬描边 outline（`--focus-outline: 2px solid var(--foreground)`，offset 2px）+ 抬升一档阴影，**禁止发光与柔和阴影**（`--focus-glow: none`）。方案不设全局 `:focus-visible` 兜底——每个可聚焦件由皮肤显式挂 `focus-visible:focus-ring` 或由外壳洪泛自答，内层件不挂即无环。焦点环禁止消失，允许换形态（背景色洪泛），不得只去掉 outline 而不给替代。
5. 滚动条：硬边方块——12px 宽、`foreground` 色滑块、2px 背景色描边、无圆角（`-webkit-` 专有属性：标准 thin scrollbar 会被渲染成圆头胶囊）；箭头按钮隐藏、corner 透明；Firefox 车道（`@-moz-document`）标准属性答 `thin` + `var(--foreground)`。标准属性不得出现在 Chromium——非初始值会丢弃 webkit 定档、退化为覆盖式滚动条自动隐藏；组件层一律不设 scrollbar 样式。
6. 暗档：深度仍由描边与硬阴影读出，`--shadow-color` 恒等于 `foreground`，夜间随文字反转为纯白——黑画布上的白硬阴影正是本案夜档的承重手段；不引入任何发光。

## Shapes

1. **全直角是唯一形状答案**：`@theme` 用 0px 回答半径阶梯每一档，共享代码写来的 `rounded-lg` 在这里得到直角而不是不生成——两套方案都答了这个维度，切换方案时改变的是观感而不是丢失。皮肤禁止写 `rounded-full`（静态圆不读令牌，谁也答不成 0）——圆点、胶囊、圆钮一律 `rounded-pill`（本方案答 0px，得直角），本方案无圆形。禁用态不用圆角表达，由皮肤独立禁用类串使用 `bg-disabled`、`text-disabled-fg`、`cursor-not-allowed` 与 `shadow-frame-disabled` 表达。

## Components

1. 所有交互组件共享五态，各态去处固定；皮肤写角色名，本方案给每一档答的值——切换方案时这一列换成另一套答案，皮肤不动：

   | 状态     | 皮肤写的角色                                                                                            | 本方案答的值                                                   |
   | -------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
   | Default  | `border-control`（按钮）/ `border-frame`（卡片）+ `shadow-frame` / `shadow-block` + 静止面背景色        | `--stroke` 2px 恒定；硬阴影 4px 档                              |
   | Hover    | 背景色**硬切**：primary 按钮换 `primary-accent`，其余交互面换 `accent` 背景档（文字色保持静置那一枚）；阴影升一档 + `hover:lift`       | 阴影 6px 档；`--translate-lift` 0rem——hover 不位移（平移会把停在边缘的指针移出盒子，hover 反复抖动），位移通道只留按压 crush |
   | Active   | `active:crush active:shadow-frame-active`                                                               | 位移等于静止阴影偏移并清零：`--translate-crush` 0.25rem 恒定 |
   | Focus    | `focus-visible:focus-ring`；输入族由外壳背景色洪泛回答                                                  | 2px 硬描边 + 阴影 6px 档                                       |
   | Disabled | 皮肤独立禁用类串：`bg-disabled`、`text-disabled-fg`、`cursor-not-allowed`、`shadow-frame-disabled` | 使用禁用背景色与禁用文字色，阴影清零                         |

2. 动效：时长三档 `--duration-sm` 0ms（颜色）/ `--duration-md` 150ms（位移与阴影）/ `--duration-lg` 200ms（进出场），缓动统一 `ease-out`。transition 列表**只允许位移与阴影**（`motion-frame` 只携带这三项）；禁止 `transition-all`；禁止 opacity 过渡或半透明染色代替背景色硬切。`prefers-reduced-motion` 与 `data-motion` 开关在 `index.css` 的 `@layer base` 收口，业务动效用 `motion-safe:` 前缀。
3. 可点条目的交互态全库走两枚共享 token，组件不得另设：悬停吃 `accent` 背景档并写它的配对前景（`hover:bg-accent hover:text-accent-fg`——成套律见 `ui/schemes.md` 第 24 条），选中 / 激活吃 `primary` 对（`bg-primary text-primary-fg`），填充行悬停留在同族换 `primary-accent` 档、不落 `accent`（配对前景对静置与悬停日 6.11 / 9.69、夜 16.12 / 10.69，实测值）——菜单项、列表行、树行、下拉选项、命令行、标签页、分段项、日历格、表格行、TOC 项一视同仁；键盘高亮（`data-highlighted`）与指针悬停同观感；两档背景色硬切实心色，不做透明染色。
4. 按钮档位按同排内容选，不按好看选：同排同优先级不许出现 `bg-primary`；次高 outline（`bg-background text-foreground` + 硬阴影）；danger 只标危险动作（`bg-danger text-danger-fg`）；同排有文字读数用文字角色（透明背景色、文字色恒 `foreground`，hover 加下划线、不换色不换底）；同排无文字也不分优先级默认 outline。基准串正本 `app/ui/skins/button.tsx`，写角色名不写字面量。
5. 骨架脉冲：走核心模板 `animate-pulse`，本方案在 `@theme` 把 `--animate-pulse` 重答为硬两档切 opacity（0–49% 全亮、50–100% 0.85，linear——本语言没有渐变洗色）；**必须配 `motion-safe:` 前缀**。
6. 共享皮肤层写的语义档：`shadow-faint` / `shadow-subtle` = `shadow-brutal-2`、`shadow-base` = `shadow-brutal-4`；`shadow-elevated` = `shadow-brutal-6`、`shadow-surface` = `shadow-brutal-4`（恒定，不随断点翻倍）；`shadow-hint` = `none`（轻提示例外：Tooltip / Toast 只有描边、不带阴影）；`border-hair` / `border-frame` / `border-control` 都读 `--stroke`（恒 2px）；字重三角色 `font-field` / `font-emphasis` / `font-strong` = 700 / 700 / 900，标签字体档 `font-label` = mono 族 + `font-strong`；`line-cap` / `line-join` 答 `butt` / `miter`（SVG 初始值——本方案的线切平）。
7. Avatar 专属令牌：`disc`（`--radius-disc` 0px）。
8. 未迁移组件档位短条（随各组件重构迁入其皮肤蓝图）：

   1. Card：`rounded-lg` + `border-frame` + `p-panel` + `background`/`foreground` + `shadow-block`；可点卡再接 `hover:lift` / `active:crush` / `hover:shadow-block-hover`；静态卡禁一切 hover 动效。
   2. 输入族：外壳承重（边框 + 硬阴影 + `min-h-control`），内层输入元素 `bg-surface` 凹槽档（本案 `--surface` 日酸橙绿 / 夜粉，文字随档读 `surface-fg`）、`border-0 outline-none`；聚焦 = 外壳背景色整壳换 `accent` 配 `accent-fg`；`invalid` 在亮档换 `danger-fg`、暗档换 `danger`，不复用默认焦点。
   3. 行内状态标签：半档底色不承重、无阴影；基准底色 `surface` 配 `surface-fg`，primary 档底色 `--primary`，状态变体填语义背景色档，文字统一取对应 `<status>-fg`；独立状态文字、图标与边框挂 `text-<status>-independent` / `border-<status>-independent`，亮档读 `<status>-fg`、暗档读 `<status>-accent`。

9. SwipeActions 行体为方角轨道面（同 Banner），不用圆角（全直角宪法）。
10. 组容器凹陷（recess）：凹陷不设独立色档——第四档「井」随三档阶梯撤销（用户定 2026-11-25），旧 `--padding-well` 删除（答 0，删后无位移）、`--shadow-recess` 答 `none`——字段族内区与 Segment 凹陷道平涂 `surface` 同一档身份色（日酸橙绿 / 夜粉，本案没有比画布更深的中性档）、全直角、无拟态阴影，靠对画布的色相差自辨；轨道族（Slider 槽 / Progress / Meter / MeterGroup 未填充底 / Steps 连接线）自 2026-11-26 改读 `border` 对比线（日黑 / 夜白），细轨靠对比发声、不吃身份色；选中项衬底读 `primary`（取值以皮肤蓝图 `ui/skins/segment-group.md` 为准）。

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
12. 交付自检：全直角无残留（装饰圆除外）；阴影全部命名档且模糊为 0；边框 `border-2`；位移与阴影走 `duration-150 ease-out`，背景色不在列表；hover 阴影增大一档、只有 active 清零；active 位移等于静止阴影偏移；焦点是 2px 硬描边；填充上的前景色读对应 `-fg`；控件高度未翻倍；日夜两档一眼可分辨；替换示例内容后页面**仍一眼识别为新野兽派**。
