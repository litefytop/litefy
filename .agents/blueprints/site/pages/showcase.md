# Showcase 页（routes/showcase.tsx · routes/neo-showcase.tsx · routes/flat-showcase.tsx · routes/neon-showcase.tsx）

- 四条车道：minimal 走 `/:lang/showcase/:slug`，neo-brutalist 走 `/neo/:lang/showcase/:slug`，flat-minimal 走 `/flat/:lang/showcase/:slug`，neon-gradient 走 `/neon/:lang/showcase/:slug`；slug 不可识别渲染 BareNotFound，minimal 车道收到 neo-brutalist / flat-minimal / neon-gradient 时分别重定向进各自车道
- 裸页壳：不挂 docs-shell，自带头部与页脚，观感由当前车道方案令牌渲染
- 头部：左侧锚点导航（色盘 / 令牌 / 排版 / 交互 / 规则），右侧控件组固定顺序——StyleMenu 风格切换（复用 components/style-select，经 toStylePath 跨 `/neo` 前缀往返并保持滚动位置）→ AppearancePanel 外观与动效 → 语言切换 → 主页，四枚控件全部为纯图标方砖（同边框、同位移阴影、同高、aspect-square，各自独立并排，无拼接容器、无半砖手写件）；四车道顺序一致，主页 minimal / flat / neon 指 `/:lang`，neo 指 `/neo/:lang`（车道首页）；语言切换同 docs-shell LangSwitch 形（当前 zh 显 Letters、en 显 Languages），主页显 House；图标件的 aria-label 与 title 保留原文案；文档入口不设头部图标——入口由 hero 阅读文档 CTA 与页脚链接承担；纯图标一律经 `data-pure-icon` 属性 + `pure-icon` 类契约（链接型直挂属性并挂类答方型与零内距），禁手写 `px-0` / `aspect-square` 与 after 外扩命中（命中即盒，见 ui/skins/button.md 第 2 条）
- 正文（minimal 车道）：hero（kicker 眉标 + headline 档方案标题 + 方案描述 + 双 CTA + 实时色阶卡）与色盘、令牌清单、排版、交互、设计规则五块，文案双语内置路由内；双 CTA 各车道同对——primary 查看组件 → 本车道 `docs/overview`，outline 阅读文档 → 本车道 `docs`；neo 车道按新野兽派设计语言复刻同构信息，首屏题同走 headline 档（三行大字 + 描边字复刻保留，字号读方案 `--text-headline`，禁档外任意值与裸数字档名）
- 交互区（minimal 车道，四法则教学画布，按钮形态纪律豁免）：01 悬停上移——hover:lift 纵向上移半步、主色加深走 primary-accent 档；02 按压先落回再内凹——active:crush 位移归零、active:shadow-frame-active 经 --press-inset-delay 延迟跟进，释放立即回弹；03 染色柔影——faint / subtle / base / elevated 四档静态陈列，随品牌色阶切换染色，暗档维持纯黑加白亮环；04 克制时长——motion-frame 150ms 微反馈，对照三档 150 / 300 / 500 与减动效归零；演示砖色值全走语义令牌，交互件挂 focus-visible:focus-ring。
- 规则卡文案随柔和激进档与染色柔光取值同步：大圆角阶梯（sm 8 / md 12 / lg 16 / xl 24，按钮族默认胶囊）、染色柔影（亮档品牌染色柔光层）、按压先落回再内凹；反模式清单答四项——渐变文字 / 悬停才显示的控件 / 页面写死色值 / 双线边框（玻璃拟态表面与白色模糊假阴影不在禁列）。
- 排版区四案同构：双卡网格——字阶样本卡（headline / kicker / h1–h6 / body / label / overline / code 全档，逐行挂方案单挂 utility，code 行挂 mono 族档、label 行挂 `--text-label` 机制族；按场景分组陈列——首屏展示档 headline / kicker、阅读档 h1–h6 / body、机制档 label / overline / code，组题挂机制族；headline 行样本与规格上下分行防溢出；规格文案读本方案令牌实值，只写尺寸与字重，不含语言相关注记）+ `.typography` 长文作用域卡（卡题在作用域外；作用域容器挂 `max-w-[40em]`，内容是真实长文样本——阅读主题短文：h2 题、连续两段正文、h3 小节、含行内 code 的正文句、三条列表、署名引文，四案共用同一样本文、双语内置；作用域卡不装系统自述文案）；四案只换方案画布与令牌，不各写一套陈列
- 按钮形态纪律：页面与 BareNotFound 中所有「按钮观感」的链接（hero CTA、工具组、页脚语言切换、404 返回）一律引用 buttonVariants 既有形态再叠差异类，禁止手写边框/阴影/位移按钮串，禁止 Link 内嵌 Button；法则演示砖为教学画布豁免（演示目标就是原始 utility 行为）
- 共享边框卡片表（BUILT DIFFERENT 六卡）：容器自带四边外框（闭合表格，与页内其余共享边框表一致）；卡片 `h-full` 撑满行高，行内底边齐平；分隔线按各断点列数（1 / 2 / 3 列）只落在非末行底边与非末列右边，末行末列不得出现悬空线或与容器叠加的双线
- 卡片两态：本页卡片区（hero 统计格、BUILT DIFFERENT、设计规则原则卡、页脚色块）均为静态展示——无 hover 动效、无光标动效；动效只属于真交互件（链接、按钮）与法则演示画布（hover 即教学内容）
- 滚动入场：minimal / flat-minimal / neon 三车道正文各块（色盘 / 令牌 / 排版 / 规则等）的内层容器包 `AnimatedContent`（`lg` 档 / `once`），hero 首屏不进入场；minimal 与 neon 答 `up` / `distance` 24（示例值），flat-minimal 方案禁位移答 `distance` 0 纯淡入；neo-brutalist 车道禁 opacity 过渡，不接入场件；时长随各案令牌自答，减动效直接呈现
- neon 车道 hero 装饰底层：hero 色带内铺 `ShaderBackground`（site/widgets/shader-background.md，`absolute inset-0` 包装、内容层相对定位在上），令牌取色随日夜档重采样；同屏只此一处重量级装饰，其余车道不铺
- 动效四法演示对齐方案令牌：01 碾压（active 位移 = 静止阴影偏移，阴影清零）与 02 硬切（色不在过渡列表，无 opacity 淡入）照抄方案档；03 缓动的过渡列表写方案的 `box-shadow, translate`（禁 transition-all），150ms ease-out；04 命名避开方案 focus 语义（focus 是 2px 硬描边），悬停只增长阴影、不位移，演示走桌面档 8→12px（accent-12，primary 粉），避免边缘指针离开命中区后反复触发 hover；演示画布内元素不得自带嵌套 hover
- 调色板纪律：方案已删除默认调色板（`--color-*: initial`），页面一律语义令牌 utility——黑砖 `bg-foreground`、白砖 `bg-background`、其上文字互为 `text-background` / `text-foreground`，primary/accent 填充上的文字走 `text-primary-fg` / `text-accent-fg`，阴影色取 `var(--color-background | -foreground)`；禁 bg-black / bg-white / text-white / text-black / border-white / border-black 及未定义的自造令牌（如 --color-hover）
- 文字色配对（`site/shell/contrast.md`）：每条车道的 `bg-surface` 头部、hero、表面分区与页脚都配 `surface-fg`；换回 `bg-background` 的卡片、轨道与嵌套演示面重新配 `foreground`。neon 的 hero 大标题、统计值、分区标题、收尾标题与表面图标盒不得继承画布白色；画布上的排版组题等次要文字读 `foreground`。`surface-fg` 令牌说明统一为「表面文字 / Surface text」，不写成通用次级文字。
- minimal 车道漏项：hero 与页脚的 `text-on-surface` 改 `text-surface-fg`；`DemoBrick` 的 press / duration 两枚 `bg-surface` 演示钮改 `text-surface-fg`，duration 的 hover 继续切 `primary-fg`；透明卡片与 `bg-background` 演示面上的说明、规格、令牌角色与统计标签改 `foreground`。hero 内透明色阶卡重新显式配 `foreground`。
- flat-minimal 车道漏项：`EYEBROW` / `LEAD` 常量不固定文字色，hero 与统计格调用时配 `surface-fg`，画布上的 `SectionHead` 配 `foreground`；色卡角色、交互说明、轨道标签、排版规格、原则卡与收尾卡正文改 `foreground`；无状态背景的危险演示文字改 `text-danger`。真实 `bg-surface` 色块、收尾分区标题与页脚保留 `surface-fg`，收尾分区内的 `bg-background` 卡片及其中 `bg-surface` 图标盒分别重新配对。

- neo 车道色盘的夜间 primary 对比对读绿色 `#bbf451` + 深色字 `#1a1a1a`，标签明确写「黑压绿 · 夜 / BLACK ON GREEN · NIGHT」；日间色卡不变，法则卡的固定演示色不冒充方案令牌。

## flat-minimal 车道（routes/flat-showcase.tsx · routes/flat-showcase.css）

- 裸页壳：不挂 docs-shell；独立 Tailwind 入口 flat-showcase.css（同 neo-showcase.css 形：`tailwindcss source(none)` + flat-minimal 方案，扫描 `ui/skins`、本页、appearance-panel、palette-section）；观感全部读 flat-minimal 令牌——冷白画布、天蓝表面、1px 发丝边界、全直角、零阴影，日夜两档随外观切换整页重绘
- 头部：surface 底 + 底部发丝线，左侧方形标识块（FLAT MINIMAL 字标）与锚点导航（色盘 / 交互 / 排版 / 规则），右侧控件组固定顺序 StyleMenu → AppearancePanel → 语言切换（纯图标，同 docs-shell LangSwitch 形）→ 主页（House 图标，`/:lang`）；按钮观感链接一律引用 buttonVariants 既有形态；纯图标经 `data-pure-icon` 属性 + `pure-icon` 类契约，禁手写方型 / 零内距类
- hero：surface 色带——kicker 眉标、headline 档大标题、方案描述、primary + outline 两 CTA（buttonVariants：primary 查看组件 → `/flat/:lang/docs/overview`，outline 阅读文档 → `/flat/:lang/docs`），底部统计格（0px 圆角 / 1px 描边 / 0 阴影 / 22 枚令牌）发丝线分隔；静态展示无 hover 动效
- 色盘：语义令牌色卡网格，色块内联读 `var(--token)`（随日夜档重绘），卡上令牌名与角色文字；前景/背景对比对（Aa）用令牌 utility 成对取色
- 交互四法则（教学画布，按钮形态纪律豁免）：01 悬停只换底色（accent 背景档，并写它的配对前景，无位移无阴影）；02 按压只压暗（crush：位移 0 + brightness 0.95）；03 焦点是 2px primary 实线 outline、offset 2px（danger 转 danger-fg）；04 克制时长（120ms ease-frame 颜色过渡，对照禁止的弹跳/位移）；演示件只挂颜色过渡，不挂位移动画
- 排版：同构双卡（见上），样本档名与规格文案读方案 `--text-*` 令牌
- 规则：七条识别点原则卡（冷调蓝系 / 发丝边界 / 全直角 / 零阴影 / 边界建层级 / 颜色带语义 / 克制）+ Do / Don't 两栏清单；原则卡静态
- 收尾：六卡「为什么选 flat-minimal」（企业密度 / 状态分明 / AA 对比 / 克制动效 / 无阴影层级 / 零装饰），共享边框卡片表发丝版——容器四边闭合，分隔线只落非末行底边与非末列右边
- 页脚：surface + 顶部发丝线，文档 / 样式 / 安装链接与语言切换；文案双语内置路由内；meta 标题读方案名，noindex
- 缩略图：`assets/showcase/flat-minimal.webp`（2:1，本页首屏截图）登记进 ShowcaseCard THUMBS

## neon-gradient 车道（routes/neon-showcase.tsx · routes/neon-showcase.css）

- 裸页壳：不挂 docs-shell；独立 Tailwind 入口 neon-showcase.css（同 flat-showcase.css 形：`tailwindcss source(none)` + neon 方案，扫描 `ui/skins`、本页、appearance-panel、palette-section、style-select、bare-not-found、icons）；观感全部读 neon 令牌——浅紫 / 深蓝两档随外观切换整页重绘
- 头部：sticky、bg-surface（渐变填充车道自动上色），左侧方形标识块（N 字标，bg-primary text-primary-fg）与 NEON 字标、锚点导航（色盘 / 交互 / 排版 / 规则）；右侧控件组固定顺序 StyleMenu → AppearancePanel → 语言切换（纯图标，同 docs-shell LangSwitch 形）→ 主页（House 图标，`/:lang`）；按钮观感链接一律引用 buttonVariants 既有形态；纯图标经 `data-pure-icon` 属性 + `pure-icon` 类契约，禁手写方型 / 零内距类
- hero：bg-surface 渐变色带——kicker 眉标、headline 档大标题（字重随方案令牌）、方案描述、primary + outline 两 CTA（primary 查看组件 → `/neon/:lang/docs/overview`，outline 阅读文档 → `/neon/:lang/docs`）；底部统计格（4px 描边 / 12px 圆角 / 500ms 色流 / 22 枚令牌）border-border 分隔；hero 不设标本卡、不使用 iframe（装饰底层 ShaderBackground 见共享条）；外框静态无 hover
- 色盘：22 枚语义令牌色卡（内联读 `var(--token)`，随档重绘）+ 前景/背景对比对（Aa 四对）+ 渐变填充车道色带：八族填充内联读 `var(--fill-*)` 作 background-image，渐变身份直接可见；色卡与填充带静态
- 交互四法则（教学画布，按钮形态纪律豁免）：01 色流悬停（品牌件 hover:bg-primary-accent，background-position 0%→100% 滑过 500ms ease-out，不位移不缩放）；02 按压电激活（active:shadow-frame-active 内白 / 内紫，lift / crush 显式空操作）；03 焦点光晕环（focus-visible:focus-ring 青实线加同族光晕，danger 转 rose）；04 家族光晕随档（hover 换 shadow-frame-hover / shadow-block-hover，浅档答同族柔影）；演示件只挂颜色 / background-position / 阴影过渡，不挂位移动画；对照轨道：500ms ease-out 色流 vs linear（此处禁止）
- 排版：同构双卡（见上），headline 档独立样本行（不复用 h1 档类）；规格文案读 neon YAML（h1 2.25rem/900、label 大写 0.08em、mono JetBrains Mono）
- 规则：七条识别点原则卡（双档画布 / 渐变填充车道 / 4px 对比边框 / 家族光晕随档 / 大圆角 / 大写标签与 mono / 色流不位移）+ Do / Don't 两栏清单（Don't 含 rounded-none、细边框、灰卡、渐变文字、纯色家族填充、浅档饱和霓虹）；原则卡静态
- 收尾：六卡「为什么选 neon」（双档成立 / 渐变即身份 / 光晕建层级 / 色流反馈 / AA 换深度 / 打印恒白），共享边框卡片表——容器四边闭合，分隔线只落非末行底边与非末列右边
- 页脚：bg-surface + 顶部边框，文档 / 样式 / 安装链接与语言切换；文案双语内置路由内；meta 标题读方案名，noindex
- 缩略图：`assets/showcase/neon-gradient.webp`（2:1，暗档标本卡：色卡带 + 渐变按钮行 + 输入框行 + 勾选/开关/滑杆行，同 flat-minimal 缩略图管线）登记进 ShowcaseCard THUMBS
- 通用车道重定向：showcase.tsx 收到 neon-gradient 时重定向 `/neon/:lang/showcase/neon-gradient`（同 flat-minimal 形）
