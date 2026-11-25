# 皮肤通用外观律（app/ui/skins/**）

1. 本文件约束所有皮肤 utility 串的通用律；方案取值看各方案 `design.md`，无障碍下限看 ui-rules 技能，令牌契约看蓝图 `ui/schemes.md`——已有的律只引用不重复。
2. 每个视觉数值解析到令牌或命名档位：禁字面量色值（`#hex`、调色板类）、任意值阴影（`shadow-[…]`）、自造阴影 / 圆角 / 间距档。
3. 语义色只用于状态，不作装饰、不当层级。
4. 组件默认样式只可经显式 props / 覆盖通道改写，禁止隐式篡改底层全局样式。
5. 图标只用库内置图标组件，禁 emoji 当图标；禁渐变文字、渐变按钮、装饰性色块。
6. 成品与零件二选一：选了成品就禁止再往它的 children 放它自己的零件（Dialog 已内置关闭按钮）；禁 Tabs 套 Tabs、Drawer / Popover 冒充侧栏。
7. 静态件（非交互内容）禁 hover 动效。
8. 禁后代选择器（`[&_svg]:size-*`）定消费者传入图标（`leading` / `trailing` / `icon` / `prefix`）的尺寸——那是一条压不回来的上限；皮肤自己的图标盒用 `size-*` 定档、骨架渲染的节点 `[&_svg]:size-full` 吃满是许可（现例 `app/ui/skins/tree.tsx` 的 `icon` 一键）。
9. 已删颜色槽位缺省不新增使用（词表见蓝图 `ui/schemes.md` 第 4 条）；确要恢复先修订 schemes.md 第 4 条纳回色板，恢复后即可正常取用，未恢复前的存量消费随组件重构清除。
10. 皮肤不自带定位类（`relative` / `absolute` 等）：仅当组件自身渲染了脱离文档流的子元素（伪元素命中区、绝对定位槽位）需要锚点时按该形态条件补写，且写成同变体普通类，让消费方的定位类经类名合并后写胜出。
11. 形态复用优先：皮肤内出现与既有变体同形态的样式串（文字钮、图标钮、危险钮等）一律引用既有变体（如 `buttonVariants`）再叠加差异 utilities，禁止手写重复串；差异只写该形态确实不同的部分。
12. 纵向间距按排布形态定，不设全局禁令：行式列表（menu / list / 设置行一族）默认行界由 `not-last:border-b-hair` 分隔线承担、行高由 `py-snug` 撑到命中区，不另插 `gap-y`——插间距会把连续分隔线断成虚线，并在两行之间留下点不到的死区；这是缺省写法不是禁令，确要留白节奏的行式组由消费方显式取舍。卡内「文本 + 控件」的上下搭配（表单 label 与控件一类）纵向衔接由文本行高 / 行高档与小块外距承担（`fieldChromeClasses` 的 `[&>*+*]:mt-1` 先例）——44 命中行已自带节奏，尽量不引入 `gap-y`。分组靠分隔线与组眉（第 15 条），不靠留白。非行式交互件两轴 gap 都可用（滑块标签 / 轨道 / 值同轴、工具栏、chip 与 token 流、chat 与 timeline 的内容块），换行流式组两轴都要写。承载面容器（card / dialog 一族）的内排版必须自带默认纵向 gap（数字乘道 `gap-4`），不靠消费方手补间距。
13. 间距走 Tailwind 数字乘道，禁自造间距令牌与命名档；栅格基础值与紧凑档 ramp 见蓝图 `ui/schemes.md` 第 11 / 12 条，方案取值以 `design.md` Layout §1 为准：
   1. 内外层级：一组元素的内间距必须小于它与外部的间距（组内 `gap` < 组间 `mt`、控件 `px` < 控件之间的 `gap`），层级差至少一档（4 单位）——两者相等就读不出分组，这是格式塔邻近性的可判定写法，只写「4 的倍数」不构成约束
   2. 大容器（card / dialog 一族）内边距固定 `p-4`（数字乘道，紧凑档随 `--spacing` 收缩），不设容器查询升档；容器体量与形态差异由各方案圆角档承担，不靠内边距表达
   3. 输入类控件内部必须保留横向内边距，禁止贴边；固定格子（OTP 格）按格档例外
   4. 组合输入类（group + input + icon 一族）横向分两层：容器框距 `p-well`（方案令牌 `--padding-well`，答 0 即无框），文字内边距 `px-3` 记在井（输入元素）上，附件（addon / 图标钮）自带 `px-3` 呼吸；零件纵向仍不加——居中由 `items-center` + 拉伸保证；井底 `bg-well`、井内阴影 `shadow-well` 与井同心圆角（第 17 条第 1 项）由井自答，方案关井（框距 0 + 井底答 `background`）时读法退回纯容器形态
   5. 宽度走第 16 条的车道与公式，不在此重复
14. 下拉面板宽度两车道：y 轴锚定（面板随触发器上下开合、x 不移）——精确同宽，经 `data-float-match-width` 锁触发器宽（Select / Combobox / Picker 一族）；x 轴自由（可横移定位）——不锁宽、固定档（下拉菜单一族：DropdownMenu / ContextMenu / Menu 子面板 `w-48`）。
15. 分组标签（菜单 / 列表的组眉）统一声：`font-mono font-strong`（字重比交互正文大——交互条目一律常规字重）+ `tracking-label` + `case-label` + `text-surface-fg`，`py-snug` 与行同高、`text-sm leading-5` 与行同节奏；字族与字重双轴区分，不靠字号差。
16. 宽度先选车道再取值，同一元素只写一条车道、一枚 `max-w-*`；多个上限合成 `min()`。任意值内禁空格，calc 的空位写 `_`（类名扫描按空白切分，带空格的串静默不生成 CSS）：
   1. 行宽车道——连续阅读的正文：`max-w-[40em]`，随字号而不是随栅格缩放。
   2. 字段车道——Input / Password / Textarea / NumberInput / Select / MultiSelect / Combobox / Cascader / Picker / DatePicker / DateRangePicker / FilterCombobox / Upload 等字段控件：`w-full min-w-0 max-w-[20rem]`，320px 是设备适配常量，不随 `--spacing` 缩放，不设固定最小宽；父容器更窄时自动收缩。
   3. 内容容器车道——有层级的独立内容块使用 `w-full min-w-0` 加固定 rem 语义上限：`sm` 20rem、`md` 24rem、`lg` 28rem、`xl` 32rem，Transfer 另加 `2xl` 40rem。默认值为 Card 24rem、Form / List 28rem、Chat 32rem、Transfer 40rem；消费者可用组件尺寸 prop、`className`、`classNames.root` 或 `style` 覆盖。
   4. 结构车道——Banner / Callout / Accordion / Collapse / Details，以及图表、量具、表格、树、页签、步骤、时间线等需要占满宿主的结构组件：`w-full min-w-0`；内部滚动或换行负责窄容器，不给根组件加固定最小宽。
   5. 浮层车道——popover 类内容按内容取宽，统一 `max-w-[min(20rem,calc(100vw_-_1rem))]`，不设固定最小宽；锚定字段的浮层可精确同宽。Dialog 默认 `max-w-[28rem]` 并受 stage 宽度让位；Drawer 主轴使用 `w-full` / `h-full` 加 20 / 24 / 32rem 固定上限与 `min-w-0` / `min-h-0`，窄视口自动收缩。
   6. 定档车道——固定形态控件、Toc 固定栏、纸张与内部结构尺寸使用 `--spacing` 数字乘道；控件级小容器取 11 的倍数，容器级取 16 的倍数。`min-w-control`、`min-w-11` 与 `size-*` 属于内部稳定尺寸，不作通用根最小宽。
   7. 消费方只在需要改变语义默认值时覆盖，不重复添加默认档位；宽度 prop 提供运行期值时可用内联样式，组件必须允许后写的 `style` 覆盖。
17. 光学修正写成可计算式，不靠目测：几何对齐不等于视觉对齐，嵌套圆角是最常见的一处。
   1. 同心圆角：内圆角 = 外圆角 − 外件内边距 − 外件边框宽，由方案派生令牌作答——各案 `:root` 静态派生（`--radius-field-inner` / `--radius-well-inner`，契约见蓝图 `ui/schemes.md` 第 9 条），皮肤只经 `rounded-(--令牌)` 引用（角位用 `rounded-s-(--令牌)` 一类侧变体），类串内不写 calc 任意值；`max(0px,…)` 钳位写在令牌定义内，无圆角方案（neo-brutalist 全档 `--radius-*: 0px`）自然归零，不为补偿另立令牌；方案 CSS 内间距写 `var(--spacing)*N` 乘法，新容器壳按同式补对应派生令牌
   2. 只有确实嵌套的两层写这条式子（面板里的卡片、输入区里的附件块）；同层并列件各取自己的圆角档，不做补偿
   3. 图标与文字同排时按视觉重心对齐（`items-center` 是几何居中，字形基线与图标外框不等高时由皮肤给图标盒定档补差），不靠消费方塞 margin
18. 相连堆叠的条目不各自带阴影：整组投影只归外根容器，条目间用分隔线分界；要每件独立投影就断开相连（留白或间距），不让阴影投进相邻件（手风琴先例，2026-11-22）。
19. 状态档成对书写：换背景档就在同串写上新档的配对前景——`hover:bg-accent` 必带 `hover:text-accent-fg`，`data-[active]:bg-primary` 必带 `data-[active]:text-primary-fg`，`data-[highlighted=true]:bg-accent` 同理；同一枚 `-fg` 对静置背景与 `-accent` 悬停档都过 AA，所以日/夜两档不必再切文字色。填充态留在同族 `-accent` 档、跨角色换底与继承文字的两条边界皆见蓝图 `ui/schemes.md` 第 24 条，门禁 `scripts/check-color-pairs.mjs` 逐案核。
