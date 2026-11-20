# Showcase 页（routes/showcase.tsx · routes/neo-showcase.tsx · routes/clinical-showcase.tsx · routes/neon-showcase.tsx）

- 四条车道：minimal 走 `/:lang/showcase/:slug`，neo-brutalist 走 `/neo/:lang/showcase/:slug`，clinical 走 `/clinical/:lang/showcase/:slug`，neon-gradient 走 `/neon/:lang/showcase/:slug`；slug 不可识别渲染 BareNotFound，minimal 车道收到 neo-brutalist / clinical / neon-gradient 时分别重定向进各自车道
- 裸页壳：不挂 docs-shell，自带头部与页脚，观感由当前车道方案令牌渲染
- 头部：左侧锚点导航（色盘 / 令牌 / 排版 / 规则），右侧控件组固定顺序——StyleMenu 风格切换（复用 components/style-select，经 toStylePath 跨 `/neo` 前缀往返并保持滚动位置）→ AppearancePanel 外观与动效 → 语言切换 → 文档入口（neo 车道）/ 返回（minimal 车道）；右侧控件同为一枚完整砖块形态（同边框、同位移阴影、同高，各自独立并排，无拼接容器、无半砖手写件）
- 正文（minimal 车道）：hero（方案标题 + 实时色阶卡）与色盘、令牌清单、排版、设计规则四块，文案双语内置路由内；neo 车道按新野兽派设计语言复刻同构信息
- 按钮形态纪律：页面与 BareNotFound 中所有「按钮观感」的链接（hero CTA、工具组、页脚语言切换、404 返回）一律引用 buttonVariants 既有形态再叠差异类，禁止手写边框/阴影/位移按钮串，禁止 Link 内嵌 Button；法则演示砖为教学画布豁免（演示目标就是原始 utility 行为）
- 共享边框卡片表（BUILT DIFFERENT 六卡）：容器自带四边外框（闭合表格，与页内其余共享边框表一致）；卡片 `h-full` 撑满行高，行内底边齐平；分隔线按各断点列数（1 / 2 / 3 列）只落在非末行底边与非末列右边，末行末列不得出现悬空线或与容器叠加的双线
- 卡片两态：本页卡片区（hero 统计格、BUILT DIFFERENT、设计规则原则卡、页脚色块）均为静态展示——无 hover 动效、无光标动效；动效只属于真交互件（链接、按钮）与法则演示画布（hover 即教学内容）
- 滚动入场：minimal / clinical / neon 三车道正文各块（色盘 / 令牌 / 排版 / 规则等）的内层容器包 `AnimatedContent`（`lg` 档 / `once`），hero 首屏不进入场；minimal 与 neon 答 `up` / `distance` 24（示例值），clinical 方案禁位移答 `distance` 0 纯淡入；neo-brutalist 车道禁 opacity 过渡，不接入场件；时长随各案令牌自答，减动效直接呈现
- neon 车道 hero 装饰底层：hero 色带内铺 `ShaderBackground`（site/widgets/shader-background.md，`absolute inset-0` 包装、内容层相对定位在上），令牌取色随日夜档重采样；同屏只此一处重量级装饰，其余车道不铺
- 动效四法演示对齐方案令牌：01 碾压（active 位移 = 静止阴影偏移，阴影清零）与 02 硬切（色不在过渡列表，无 opacity 淡入）照抄方案档；03 缓动的过渡列表写方案的 `box-shadow, translate`（禁 transition-all），150ms ease-out；04 命名避开方案 focus 语义（focus 是 2px 硬描边），悬停增重演示走桌面档 8→12px（accent-12，primary 粉），演示画布内元素不得自带嵌套 hover
- 调色板纪律：方案已删除默认调色板（`--color-*: initial`），页面一律语义令牌 utility——黑砖 `bg-foreground`、白砖 `bg-background`、其上文字互为 `text-background` / `text-foreground`，primary/accent 填充上的文字走 `text-primary-fg` / `text-accent-fg`，阴影色取 `var(--color-background | -foreground)`；禁 bg-black / bg-white / text-white / text-black / border-white / border-black 及未定义的自造令牌（如 --color-hover）

## clinical 车道（routes/clinical-showcase.tsx · routes/clinical-showcase.css）

- 裸页壳：不挂 docs-shell；独立 Tailwind 入口 clinical-showcase.css（同 neo-showcase.css 形：`tailwindcss source(none)` + clinical 方案，扫描 `ui/skins`、本页、appearance-panel、palette-section）；观感全部读 clinical 令牌——冷白画布、天蓝表面、1px 发丝边界、全直角、零阴影，日夜两档随外观切换整页重绘
- 头部：surface 底 + 底部发丝线，左侧方形标识块（CLINICAL 字标）与锚点导航（色盘 / 交互 / 排版 / 规则），右侧控件组固定顺序 StyleMenu → AppearancePanel → 语言切换 → 文档入口（`/clinical/:lang/docs`）；按钮观感链接一律引用 buttonVariants 既有形态
- hero：surface 色带——overline 眉标、headline 档大标题、方案描述、primary + outline 两 CTA（buttonVariants），底部统计格（0px 圆角 / 1px 描边 / 0 阴影 / 22 枚令牌）发丝线分隔；静态展示无 hover 动效
- 色盘：语义令牌色卡网格，色块内联读 `var(--token)`（随日夜档重绘），卡上令牌名与角色文字；前景/背景对比对（Aa）用令牌 utility 成对取色
- 交互四法则（教学画布，按钮形态纪律豁免）：01 悬停只换色（accent 对，无位移无阴影）；02 按压只压暗（crush：位移 0 + brightness 0.95）；03 焦点是 2px primary 实线 outline、offset 2px（danger 转 danger-fg）；04 克制时长（120ms ease-frame 颜色过渡，对照禁止的弹跳/位移）；演示件只挂颜色过渡，不挂位移动画
- 排版：字阶样本（headline / h1–h6 / body / label / overline / code）+ `.typography` 长文作用域块，档名读方案 `--text-*` 令牌
- 规则：七条识别点原则卡（冷调蓝系 / 发丝边界 / 全直角 / 零阴影 / 边界建层级 / 颜色带语义 / 克制）+ Do / Don't 两栏清单；原则卡静态
- 收尾：六卡「为什么选 clinical」（企业密度 / 状态分明 / AA 对比 / 克制动效 / 无阴影层级 / 零装饰），共享边框卡片表发丝版——容器四边闭合，分隔线只落非末行底边与非末列右边
- 页脚：surface + 顶部发丝线，文档 / 样式 / 安装链接与语言切换；文案双语内置路由内；meta 标题读方案名，noindex
- 缩略图：`assets/showcase/clinical.webp`（2:1，本页首屏截图）登记进 ShowcaseCard THUMBS

## neon-gradient 车道（routes/neon-showcase.tsx · routes/neon-showcase.css）

- 裸页壳：不挂 docs-shell；独立 Tailwind 入口 neon-showcase.css（同 clinical-showcase.css 形：`tailwindcss source(none)` + neon 方案，扫描 `ui/skins`、本页、appearance-panel、palette-section、style-select、bare-not-found、icons）；观感全部读 neon 令牌——浅紫 / 深蓝两档随外观切换整页重绘
- 头部：sticky、bg-surface（渐变填充车道自动上色），左侧方形标识块（N 字标，bg-primary text-primary-fg）与 NEON 字标、锚点导航（色盘 / 交互 / 排版 / 规则）；右侧控件组固定顺序 StyleMenu → AppearancePanel → 语言切换 → 文档入口（`/neon/:lang/docs`）；按钮观感链接一律引用 buttonVariants 既有形态
- hero：bg-surface 渐变色带——overline 眉标、headline 档大标题（font-black）、方案描述、primary + outline 两 CTA；底部统计格（4px 描边 / 12px 圆角 / 500ms 色流 / 22 枚令牌）border-border 分隔；md 起右栏「两档画布同屏」：两枚同源 iframe 各 link 本页 CSS 入口，srcdoc 的 html 不带 `.dark` 答浅档、带 `.dark` 答暗档，内渲同一组标本（品牌按钮、表面卡、状态 chip、输入框、焦点件）——档值全由方案自身 `:root` / `.dark` 答，页面不写一个色值；iframe 带双语 title、定高、内容自适不滚动；外框静态无 hover
- 色盘：22 枚语义令牌色卡（内联读 `var(--token)`，随档重绘）+ 前景/背景对比对（Aa 四对）+ 渐变填充车道色带：八族填充内联读 `var(--fill-*)` 作 background-image，渐变身份直接可见；色卡与填充带静态
- 交互四法则（教学画布，按钮形态纪律豁免）：01 色流悬停（品牌件 hover:bg-primary-accent，background-position 0%→100% 滑过 500ms ease-out，不位移不缩放）；02 按压电激活（active:shadow-frame-active 内白 / 内紫，lift / crush 显式空操作）；03 焦点光晕环（focus-visible:focus-ring 青实线加同族光晕，danger 转 rose）；04 家族光晕随档（hover 换 shadow-frame-hover / shadow-block-hover，浅档答同族柔影）；演示件只挂颜色 / background-position / 阴影过渡，不挂位移动画；对照轨道：500ms ease-out 色流 vs linear（此处禁止）
- 排版：字阶样本（headline / h1–h6 / body / label / overline / code，档名与数值读 neon YAML：h1 2.25rem/900、label 大写 0.08em、mono JetBrains Mono）+ `.typography` 长文作用域块
- 规则：七条识别点原则卡（双档画布 / 渐变填充车道 / 4px 对比边框 / 家族光晕随档 / 大圆角 / 大写标签与 mono / 色流不位移）+ Do / Don't 两栏清单（Don't 含 rounded-none、细边框、灰卡、渐变文字、纯色家族填充、浅档饱和霓虹）；原则卡静态
- 收尾：六卡「为什么选 neon」（双档成立 / 渐变即身份 / 光晕建层级 / 色流反馈 / AA 换深度 / 打印恒白），共享边框卡片表——容器四边闭合，分隔线只落非末行底边与非末列右边
- 页脚：bg-surface + 顶部边框，文档 / 样式 / 安装链接与语言切换；文案双语内置路由内；meta 标题读方案名，noindex
- 缩略图：`assets/showcase/neon-gradient.webp`（2:1，暗档标本卡：色卡带 + 渐变按钮行 + 输入框行 + 勾选/开关/滑杆行，同 clinical 缩略图管线）登记进 ShowcaseCard THUMBS
- 通用车道重定向：showcase.tsx 收到 neon-gradient 时重定向 `/neon/:lang/showcase/neon-gradient`（同 clinical 形）
