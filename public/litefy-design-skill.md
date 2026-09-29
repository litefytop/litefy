---
name: litefy-design
description: Litefy UI 设计规范（任何使用 Litefy UI 的项目的"宪法"，官网 https://litefy.top/）。当需要创建、修改、重构、审查任何使用 Litefy UI 的界面或组件时使用：写业务页面、新建/改造组件、选择组件、写颜色/边框/阴影/圆角/间距/焦点样式、排查视觉不一致、审计 UI 代码合规性。不适用于：不使用 Litefy UI 的项目、纯逻辑/数据层代码、文档文字编辑。规范与代码冲突时以本规范为准并报告冲突。
metadata:
  version: 2.8.0
---

# Litefy UI Design Spec

本文件是 Litefy UI 的设计宪法。官网 **<https://litefy.top/>**：组件文档（中文 `/zh/docs/component/<name>`，英文版把 `/zh` 换成 `/en`）、面向 AI 的文档索引 `/zh/llms.txt` 与全文 `/zh/llms-full.txt`、技能分发页 `/zh/docs/skill`。impeccable 等通用设计 skill 管"怎么思考和验证"，本规范管"**这个仓库里具体怎么写**"——两者同时生效时，冲突处以本规范为准。

> 分层约定：本规范只管"怎么写合规"（Token、结构、反模式、验证）；"组件怎么用"（props / API 细节）**不内嵌**进本文件——组件用法速查以仓库根 `AGENTS.md` 为单一事实源，组件详细文档以 `content/docs`（官网同步自它）为准。往本文件加内容前先问：这是设计约束，还是用法说明？后者一律外链，不抄进来。

## 0. 工作流

写任何 UI 前按此顺序：

1. **选组件**：有内置组件就绝不手写 div。组件用法速查按所在环境二选一：**本仓库**查根目录 `AGENTS.md`（组件速查），组合指南类（Combobox / PreviewCard）读 `content/docs/component/<name>.mdx` 的配方；**装进业务项目后**（官网分发的技能，目标仓库没有 AGENTS.md）查官网 <https://litefy.top/>——`/zh/llms.txt`（索引）、`/zh/llms-full.txt`（全文）、`/zh/docs/component/<name>`（单组件），按需抓取。成品与零件二选一（§10 第 6 条）。
2. **套 Token**：颜色 / 阴影 / 圆角 / 间距 / 字号 / 动效时长一律用语义 Token，见 §1–§9。
3. **查反模式**：动手前后各对照一次 §10.5 的 Refuse 列表。
4. **验证**：完成后跑 §12 验证清单，并执行 skill 自带的 `node .agents/skills/litefy-design/scripts/design-detect.mjs`（见 §12.4）做机器检查——审计模式仅记录，开发模式直接修。
5. **记录决策**：组件级设计决策（为什么这样定）写进本文件对应条目，跨会话不丢。

冲突裁决：用户明确要求 > 本规范 > impeccable > 模型自己的品味。用户要求违反本规范硬性禁令（如硬编码色值）时，先说明并给出合规替代，再按用户最终决定执行。

---

## 1. 色彩体系

配色分为两层体系：中性容器色板（Surface）、品牌交互色板（Brand），适配亮色/暗色主题，全组件统一复用，无自定义杂色。
**Surface 中性色板（页面容器、文本、通用状态）**

- --foreground：主要正文文本、标题、核心图标
- --background：页面最底层、组件默认背景
- --muted-foreground：辅助文本、说明文字、占位、次要图标
- --muted-background：次要容器、悬浮底色、轻量区块背景
- --accent：中性强调色，用于表头、hover高亮、常规边框、静态区块抬升
- --neutral：骨架屏、空状态、无内容占位底色
  **Brand 品牌交互色板（高优先级交互专属）**
- --primary：品牌主色，首要按钮、核心交互、选中态、链接
- --primary-accent：交互激活态、按压态、焦点高亮、强强调场景

> 语义强制规则：本系统 --primary 为品牌交互主色；--accent 为**中性静态强调色**，仅做视觉抬升，无品牌属性。不单独使用 accent-foreground，所有文本统一使用 --foreground / --muted-foreground。

正确写法只有一条:`text-muted-foreground` 这类语义色类;Tailwind 调色板类与任意色值由 design-detect 拦截(§12.4)。

## 2. 边框

- 全局中性组件默认边框：`var(--accent)/50` 半透明边框
- 品牌交互组件（Primary按钮、核心选中控件）不使用默认边框，统一复用 Brand 色板
- 禁止"边框 + 大阴影"叠用制造 ghost card；阴影等级已含边界定义，二选一

## 3. 焦点环体系

全局焦点、基础禁用样式由 `interactive.css` 统一托管，业务代码禁止手动编写焦点、基础禁用样式。

- 中性组件焦点环：使用 `var(--accent)`
- Brand 品牌组件焦点环：1px 实线 `var(--primary-accent)` + 3px 光晕 `var(--primary-accent)/50`
- 焦点环禁止移除，支持 `prefers-reduced-motion` 自动关闭焦点动画
- 焦点环轻微偏移，避免与组件边框重叠
- 表单容器支持 `:has(:focus-within)` 容器级整体高亮
- 表单 invalid 错误状态，独立专属焦点错误样式，不复用默认焦点

注意：组件自身带 `shadow-*` 工具类时，base 层的全局焦点光晕会被覆盖——参照 Button / InputGroup 的写法，把焦点环和按压内阴影提升为工具类（`focus-visible:ring-*` / `active:shadow-[inset...]`），视觉不变。**该写法仅限组件库内部（`app/ui`）**：按压内阴影属于组件交互态，业务代码不手写——任意值阴影（含 `inset`）由 design-detect 拦截（§10.5、§12.4）。

## 4. 间距体系

全局统一 8px 基准缩放间距，所有内外边距、组件间隙、布局留白**禁止手写固定px**，仅使用以下语义 Token：
`space-xs / space-sm / space-md / space-lg / space-xl`

## 5. 阴影与圆角分级

阴影严格分级，与圆角等级一一匹配，禁止硬编码色值。亮色用黑色投影；暗色层级由三件套承担——**浮层表面提亮**（`--surface-raised` = 画布亮度 +4.5%，浮层组件用 `bg-surface-raised`，页面级组件保持 `bg-background`）、**白色亮环**（阴影内置 1px 白圈，subtle 7% → elevated 14%）、**顶部白色内高光**（5-11%）；黑色投影降档兜底。禁止白色模糊外发光（glow 与焦点环语义冲突）。Tailwind 默认刻度已在 theme.css 全部映射到语义四级（`2xs/xs→faint`、`sm→subtle`、`md→base`、`lg/xl/2xl→elevated`），语义名与刻度名同值并存；**业务代码一律写语义名（faint / subtle / base / elevated）**，刻度名仅为存量兼容保留，新代码禁用（design-detect 对刻度名报 warn）。映射之外不得自造档位（禁止任意值 `shadow-[...]`）。

- shadow-faint + rounded-sm：微小行内元素、极简占位
- shadow-subtle + rounded-sm：小标签、紧凑行内控件、轻悬浮
- shadow-base + rounded-md：按钮、输入框、标准卡片
- shadow-elevated + rounded-xl：弹窗、悬浮浮层、顶级浮层

等级与圆角一一配对,错配(小控件顶浮层级阴影)由 design-detect 的 arbitrary-shadow / legacy-shadow-name 拦截(§12.4)。

圆角语义：rounded-sm用于行内元素、标签、小型控件；rounded-md为输入框/按钮默认；rounded-lg独立区块卡片；rounded-xl大卡片、弹窗、Drawer外壳。

## 6. 尺寸与布局规范

- TextBlock 文本容器：默认 max-w-120（480px），仅用于大段正文，表单、表格、标题不限制
- Card / Sidebar / Drawer 内容区：最大宽度 max-w-160（640px）
- 单列表单容器：最大宽度 640px，多列表单不强制
- Dialog 外层无固定宽，内部子组件遵循各自宽度约束
- 表格自适应：桌面端完整表格，移动端自动转为卡片列表视图
- 桌面端图标按钮不强制44px触摸尺寸，移动端所有交互控件满足 WCAG 触摸目标规范
- 布局优先使用 max-width 自适应，禁止大量写死固定宽高

> 表格配套导航、页码控件默认放置在独立单行容器，容器宽度独立于表格；导航文本允许自动换行，分页控件组在容器内垂直居中。品字布局仅作为可选变体，仅限无筛选、仅基础页码场景。

## 7. 过渡与动画

- 全局适配 `prefers-reduced-motion`，自动移除非必要动画
- 仅允许对 **opacity、transform** 做过渡，禁止动画 width / height / top / left 等布局属性，避免页面抖动
- 动画时长统一全局 Token，禁止手写时间值
- 骨架屏状态动画为必要反馈，保留执行

## 8. 交互状态全局规则

所有交互组件统一五态：`default / hover / active / focus / disabled`

- focus / disabled / button active 由全局 interactive.css 托管，业务无需手动实现
- hover 组件内按需手动实现，无全局统一预判
- active 按压态仅 Button 生效，其余组件无自动按压反馈

  **禁用态强制统一规则（全局所有组件）**

  opacity: 50%、cursor: not-allowed、文字改为 --muted-foreground，**不修改边框、不改动底色**。

  **hover 规则**

- 中性组件：hover 使用 --accent
- 品牌组件：hover 使用 primary 系列衍生色

  hover仅桌面端生效，触屏设备不存在hover。Tooltip必须双触发：桌面mouseenter唤起，移动端click唤起，点击空白区域关闭，不可仅依赖hover。
  交互不依赖 hover 作为唯一入口，适配触屏设备。

## 9. 排版规范

- 段落行高 ≥ 1.5，段落间距 ≥ 1.5倍行高
- 禁止两端对齐 `justify`，所有文本统一左对齐
- 字号统一全局 Token，禁止手写固定 px
- 标题严格遵循 h1~h6 层级，禁止跳级使用
- 错误与空状态文案写清"问题 + 下一步动作"，禁止把异常堆栈直接抛给用户

## 10. 全局强制约束（AI 编码规则）

1. 优先使用 Litefy 内置组件，禁止直接手写 div + 原生样式搭建业务UI
2. 所有颜色必须引用全局 CSS 变量，禁止硬编码色值
3. 组件默认样式仅可通过 Props 显式覆盖，禁止隐式篡改底层全局样式
4. 整体遵循 WCAG 2.2 AA 无障碍基线，关键场景按需适配 AAA
5. 代码审计仅记录问题，不自动修复，等待指令处理
6. 成品与零件二选一：复合成品（Dialog、Toaster 等）内部已组装好零件并接线完毕，选了成品禁止再往 children 里放它的零件（Dialog 已内置右上角 ESC 关闭按钮，再放 `DialogClose` 会叠加两个按钮）；零件（`DialogRoot` / `DialogContent` / `DialogClose` 等）仅用于自管开闭生命周期的组装场景
7. content/docs 的中英双语文档（`<name>.mdx` / `<name>.zh.mdx`）必须成对同步修改；界面文案跟随站点语言，禁止中英混写

## 10.5 反模式库（Refuse）

视觉层面的一票否决项，出现即改：

- **Ghost card**：边框 + 大阴影叠用（见 §2）。阴影 OR 边框，不叠加。
- **硬编码色值**：`text-gray-500`、`bg-[#fff]`、`shadow-[0_4px_8px_rgba(0,0,0,.1)]` 等一切绕过语义 Token 的写法。
- **语义四级之外的阴影**：任意值 `shadow-[0_4px...]`、自造档位——四级映射之外的阴影一律违规（`shadow-sm` 等默认刻度名已映射到四级，存量合法、新代码写语义名）；按压 `inset` 内阴影仅存在于组件层（§3），业务代码不写。
- **emoji 当图标**：一律用 `lucide-react`。
- **渐变文字 / 渐变按钮**：品牌色平铺即可，渐变不属于本系统语言。
- **hover 当唯一交互入口**：触屏不可用（见 §8）。
- **手写焦点样式**：`outline:` / `focus:ring` 出现在业务代码里即违规，焦点归 interactive.css / 组件层。
- **动布局属性**：transition/animation 到 width / height / top / left（见 §7）。
- **状态语义滥用**：给 Button 加 success/warning 变体需求时，改用 text Button + Chip；角标需求找到 Chip 头上时，改用 Badge。
- **每列手写宽度**：表格列宽走 §11 Table 的强制约束
- **盒中盒**：自带边框/圆角/内部滚动的成品组件（Table、Dialog、下拉面板）外层再包 `border` / `rounded` / `overflow-*` 装饰盒——双滚动条与高度异常的直接来源。需要留白用 padding，需要撑满用 flex（`min-h-0` / `flex-1`）；动画/定位用的 2 层 wrapper 合法（§3、§11 Table），滚动嵌套由 detector 拦截（`nested-scroll` warn，§12.4）。

## 11. 组件专项规范

### Button 按钮

- 设计定义：全局基础交互操作组件，提供固定、语义隔离的操作层级体系
- 设计 rationale：通过固定4种变体区分操作权重，避免按钮语义泛滥、视觉混乱；状态色彩语义统一交给 Chip 组件承载，保证体系单一干净
- primary：最高优先级主操作，独立展示，不嵌入行内
- outline：次要常规操作，独立展示，不嵌入行内
- danger：销毁、高危类操作，独立展示，不嵌入行内
- text：轻量化行内交互，极简无背景形态，用于内嵌操作位
- 设计约束：Button 不提供 success / warning / info 语义变体，状态表达统一采用 text按钮 + Chip 组合实现

### Card

- 设计定义：静态内容区块容器，用于纯粹内容展示
- 设计 rationale：静态容器无交互意图，因此禁用所有hover动效与抬升变化，避免用户误判可点击
- 圆角默认 rounded-lg
- 固定 shadow-base，hover 无样式变更，无上浮层级变化

### CardButton

- 设计定义：卡片形态交互组件，继承 Card 基底布局，具备完整交互状态
- 设计 rationale：可交互区块需要明确视觉反馈，通过 hover 层级抬升暗示可点击属性
- 圆角默认 rounded-lg
- 默认 shadow-base；hover 提升为 shadow-elevated，实现上浮交互反馈
- 交互变体体系与 Button 完全对齐：primary / outline / danger / text

### Chip

- 设计定义：行内状态标签组件，用于短文本标记、状态标识、筛选标签
- 设计 rationale：统一承载系统所有状态色彩语义，集中管理所有色阶标签，避免分散式自定义样式
- 支持变体：primary（默认）、outline、success、warning、danger、info
- primary：品牌强调标签，突出重点属性
- outline：边框型次要标签，轻量化展示
- success / warning / danger / info：标准系统语义状态色（与代码语义 token 同名，不使用 error 命名）
- 圆角默认 rounded-sm
- 设计约束：仅用作行内状态标记，禁止用于角标、悬浮标记

### Badge

- 设计定义：附属标记图层组件，用于挂载在任意元素角落的数字/圆点/短文本标记
- 设计 rationale：与Chip语义隔离，Chip是独立行内标签，Badge是叠加附属标记，不复用Chip组件实例，避免语义混淆；仅在视觉基础圆角、间距上保持统一
- 标记层为独立DOM结构，不依赖Chip组件
- 圆角默认 rounded-sm

### Callout（提示段落块）

- 设计定义：区块级静态反馈组件，用于大段提示、说明、结果反馈
- 设计 rationale：集中承载页面所有区块级状态提示，统一系统反馈视觉口径
- 支持语义变体：info（默认）、success、warning、danger
- 各变体采用对应语义色低透底色 + 语义文字色，保证柔和且统一
- 圆角默认 rounded-md
- 设计约束：仅用于区块提示，短状态标记使用 Chip，行内操作使用 text Button

### DropdownMenu 下拉菜单

- 设计定义：点击触发器弹出菜单的成品组合（Popover + Menu 接线完毕）
- **trigger 本身就是组件渲染的单个 `<button>`**：内容只放图标 + 文字（如 `<><Plus />插入征象</>`）；禁止在 trigger 里再嵌套自带边框/背景/内边距的盒子或按钮——会呈现按钮套按钮。样式经 `className` 覆盖默认主色底（cn 为 tailwind-merge，后写胜出，如 `border bg-background px-2 py-1 text-xs hover:bg-hover` 即 outline 风格）
- 菜单项行动作走 `onSelect`；分组用 `group` 项；层级过深（二级以上）应改用独立 Dialog 承载

### Dialog 对话框

- 设计定义：模态对话框成品，内置右上角"ESC"关闭按钮（§10 第 6 条）
- **内容不得与关闭按钮交集**：有标题一律用 `title` prop——组件把标题与行内 ESC 排成同一行（`flex items-center justify-between`，标题 `min-w-0` 可截断），结构性零交集；不传 `title` 时 ESC 悬浮于 `right-4 top-4`，内容右上角（约 48×40px）禁止放置任何元素，必要时用 padding 预留
- **标题只走 `title` prop，禁止在 children 里手写 `h3` 标题**：children 是正文区，手写标题会与 ESC 行分离、形成两段式头部的错误结构。正文直接从描述性 `<p>` 开始；错误/警示类对话框的语义靠 title 文案本身表达，不用额外造一个正文大字
- 长标题（单号/编号等）在 `title` 里传 `truncate` 的节点，全文用 `title` 属性悬停展示

### Table

- 设计定义：结构化数据展示组件，具备桌面/移动端双形态；配套分页、页码摘要属于该复合组件的组成部分
- 设计 rationale：桌面完整表格保证信息密度，移动端卡片化保证移动端可读性。分页与页码摘要和表格数据状态强绑定，纳入套件；筛选控件行业务差异大，由业务自行搭建，避免组件耦合。
  1. 默认组合布局：筛选控件行与配套分页控件放在独立单行容器，容器宽度独立于表格；控件行文本支持自动换行，分页控件组在容器内垂直居中；该方案将控件区域与表格解耦，避免长文本挤压表格，长短表格均可使用。
  2. 可选品字变体：仅用于无筛选、仅基础页码的长表格；表格在上，底部左侧页码summary文本、右侧分页控件。
- 桌面端渲染标准表格，移动端自动转为卡片列表结构
- 无内置斑马纹，避免默认视觉干扰，业务需要可自行添加中性底色条纹
- 表头使用中性 accent 强调，不使用品牌色，保证品牌色只用于交互控件
- 列宽模型：`table-fixed` 下 width 显式指定 + 弹性列吸收剩余宽度，禁止全部列等分

  **列宽与对齐强制约束**

  1. 所有列统一 start 对齐（右对齐数字会在列间制造大块空白）；tabular-nums 表级常开，数字字形竖向对齐
  2. 数字/徽标/控件列显式给 `width`（如 `"8rem"`）；长文本列用 `width` 限宽（如 `"16rem"`），超长文本 `className="truncate"` ellipsis + hover 完整提示
  3. 只留一列不设 `width` 吸收剩余宽度（通常是主文本列）；未设 width 的列平分剩余
  4. `table-fixed` 下列宽与内容无关，翻页不会引起布局跳动——禁止为"换页稳定"给所有列写死宽度
  5. `align` 仅作例外出口（如控件列 center），业务不得随意右对齐数字列
  6. **分页导航强制**：数据型 Table 必须配套分页导航（Pagination + 条/页 Select + 页码摘要）；服务端分页优先，全量拉取时以客户端分页兜底——"无导航器的数据表格"视为缺陷
  7. **行内操作按钮配色与文案强制**：普通操作 `variant="text"` + `text-primary`，危险操作（删除/撤回）`variant="text"` + `text-danger`；禁止前景色（无色类）与 `text-warning` 作操作色。文案两字动词优先（撤回/删除/明细/打印），单按钮列宽 ≥ 6.5rem，双按钮列 ≥ 12rem；单元格内截断文本用 `block truncate` + `title`（行内 span 的 truncate 无效）

### Tabs 页签

- 设计定义：触发条 + 面板的标签页容器。高级 API（`<Tabs options={[{ value, label, content }]}>`）自渲染 tablist 与 tabpanel；组合 API（`TabsList` / `TabsTrigger` / `TabsContent`，别名 `Tabs.List` / `.Trigger` / `.Content`）供自定义面板布局时组装
- 设计 rationale：tabpanel 的 DOM 契约（`id` / `role="tabpanel"` / `aria-labelledby`，与触发器的 `aria-controls` 对齐）是可访问性根基——只渲染触发条、面板放在组件外，等于读屏与键盘导航全断
- 面板双模式（`unmountOnHide`，默认 `true`）：
  1. **销毁式**（默认）：切走即卸载，适合无状态内容
  2. **隐藏保活**（`unmountOnHide={false}`）：切走保留 DOM（`hidden` 属性 + 行内 display 兜底），带搜索/分页/滚动状态的重面板必用；配合 `panelClassName` 控制面板布局（twMerge 合并，可覆盖默认 `p-4`，如 `min-h-0 flex-1 p-0` 撑满剩余高度）
- 反模式（§10.5）：只渲染 `<Tabs options={...}/>` 触发条（不传 content），面板在组件外用 `className` 三元 + `"hidden"` 手搓——触发器的 `aria-controls` 指向空节点；确需完全自管面板布局时用组合 API 并保持 tabpanel 语义（design-detect：`tabs-manual-panels` warn，§12.4）
- 反模式：**Tabs 嵌套**（Tabs 面板内容里再放 `<Tabs>`）——双层页签打乱 aria 归属与键盘导航路径；内层分组改用 Chip/Segmented 分段控件，或拆分为独立页面（design-detect：`nested-tabs` warn，§12.4）

## 12. 验证闭环

UI 代码完成后必须过一遍以下清单。**审计模式（§10 第 5 条）只记录不修复**；开发模式下小问题直接修。

### 12.1 静态检查清单

- [ ] 无硬编码色值（含任意值形式的 shadow / bg / text）
- [ ] 阴影只用了语义四级，圆角与其等级匹配（§5）
- [ ] 无手写焦点 / 禁用样式（§3、§8）
- [ ] 动效只触碰 opacity / transform，时长用 Token（§7）
- [ ] 间距、字号全部走语义 Token（§4、§9）
- [ ] 交互组件五态齐备（hover 手写，其余托管）
- [ ] 选择了正确组件：静态区块用 Card、可点击卡片用 CardButton、状态标签用 Chip、角标用 Badge、区块提示用 Callout

### 12.2 无障碍检查

语义类无障碍交给标准工具,不自造规则;仅设计系统特有项保留人工核对。

- **静态(结构)**:`oxlint` 内置 jsx-a11y 规则集——label 关联、alt、交互键控、role 完整性。`dlx` 一次性调用,拉取到全局缓存,不进 node_modules、不污染业务仓库:

```bash
pnpm dlx oxlint --jsx-a11y-plugin src
```

  内网无法访问 registry 时,退化为一次性全局安装:`npm i -g oxlint` 后直接 `oxlint --jsx-a11y-plugin src`。
- **渲染后(语义)**:`axe-core` 对运行中的页面审计(id 解析、对比度、可访问名称)——`npx @axe-core/cli http://localhost:<端口>`,或集成进 Playwright 用例
- **设计系统特有项**(标准工具看不见,保留人工核对):图标按钮有可访问文本;触摸目标满足 WCAG(§6);`prefers-reduced-motion` 下无布局动画;焦点环可见且不与边框重叠(§3)

### 12.3 视觉检查（有渲染条件时）

最多两轮有界验证：截图 → 对照清单 → 修复 → 复查一次。仍未通过的项记录为已知问题，不无限迭代。

- [ ] 亮 / 暗两主题下均无破相（透明度 token 已自动适配，重点看自绘区域）
- [ ] 焦点环可见且不与边框重叠
- [ ] 浮层圆角 / 阴影与 §5 一致

### 12.4 机器检测

脚本随 skill 分发：`node .agents/skills/litefy-design/scripts/design-detect.mjs`（在本仓库开发时也可用 `node scripts/design-detect.mjs` 或 `pnpm lint:design`；可传位置参数指定扫描根目录，不传时自动按脚本安装位置推断 `<repo>/app`，兜底当前工作目录）扫描业务代码（排除 `ui` / `generated`）：

- **hardcoded-color（error）**：Tailwind 默认调色板类（`text-red-500`、`bg-black` 等）与 `#hex` / `rgb` / `hsl` / `oklch` 任意色值（§1）；URL 类属性（`href` / `src` / `to` / `id` 等）中的锚点串不计
- **arbitrary-shadow（error）**：`shadow-[...]`（含 `inset` 按压阴影，组件层专属）——只允许语义四级（§5）
- **legacy-shadow-name（warn）**：使用默认刻度名 `shadow-sm` / `shadow-md` 等——已映射到语义四级、存量合法，新代码应写语义名（§5）
- **handwritten-focus（error，仅当 interactive.css 在场）**：`focus*:` / `disabled:` 工具类；豁免：含 `danger` / `invalid`（错误焦点样式 §3）、`has-`+`focus`（容器级高亮）、`focus*:opacity-*`（键盘浮现可见性，非焦点环）
- **deep-same-tag（warn）**：同一原生标签连续嵌套 ≥3 层（`div>div>div`）——滚动/动画包装通常两层足够，三层以上是结构坏味道
- **tabs-manual-panels（warn）**：文件里用了 `<Tabs>` 触发条、却在组件外用 `"hidden"` 类手搓面板，且全文件无 `TabsContent` / `role="tabpanel"`——`aria-controls` 指向空节点，必须改用 options[].content 或语义对齐的自管面板（§11 Tabs）
- **nested-scroll（warn）**：`overflow-*` 元素嵌在另一滚动上下文里，或包住自带内部滚动的组件（Table）——双滚动条与高度异常的直接来源（§10.5 盒中盒）；装饰 div 不计入，动画/定位用的 2 层 wrapper 合法
- **nested-tabs（warn）**：`<Tabs>` 面板内容里再放 `<Tabs>`——双层页签打乱 aria 归属与键盘导航路径（§11 Tabs 反模式）

**边界**：design-detect 只负责**设计语言**规则（标准工具看不见的部分：色彩 Token、阴影分级、Tabs 组件用法等）。**无障碍语义不在其职责内**——静态交给 oxlint `--jsx-a11y-plugin`（§12.2），渲染后交给 axe-core；在此自查会发出"已覆盖无障碍"的错误信号，让用户误以为不需要标准工具链。

error 使脚本以非零码退出（可接 CI），warn 只报告。检测结果为问题清单，处理方式遵循当前模式（审计记录 / 开发修复）。误报豁免用注释标记，禁止为绕过检查而滥用：文件级 `/* design-detect-disable-file <规则|*> */`（主题定义类代码专用，如 theme-switcher），行级 `// design-detect-disable-line <规则>` 或上一行 `// design-detect-disable-next-line <规则>`。

无障碍语义的权威检查在标准工具链：静态用 oxlint `--jsx-a11y-plugin`（一次性 `dlx` 调用，§12.2），渲染后用 axe-core，design-detect 不做无障碍规则。

变更历史见同目录 [CHANGELOG.md](CHANGELOG.md)。
