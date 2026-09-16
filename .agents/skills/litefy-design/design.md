---
name: litefy-design
description: Litefy UI 设计规范。定义Surface容器色系、Brand品牌交互色、Interactor全局交互样式、组件使用规则，统一色彩、边框、焦点、布局与组件编码规范。
---

# Litefy UI Design Spec

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

## 2. 边框

- 全局中性组件默认边框：`var(--accent)/50` 半透明边框
- 品牌交互组件（Primary按钮、核心选中控件）不使用默认边框，统一复用 Brand 色板

## 3. 焦点环体系

全局焦点、基础禁用样式由 `interactive.css` 统一托管，业务代码禁止手动编写焦点、基础禁用样式。

- 中性组件焦点环：使用 `var(--accent)`
- Brand 品牌组件焦点环：1px 实线 `var(--primary-accent)` + 3px 光晕 `var(--primary-accent)/50`
- 焦点环禁止移除，支持 `prefers-reduced-motion` 自动关闭焦点动画
- 焦点环轻微偏移，避免与组件边框重叠
- 表单容器支持 `:has(:focus-within)` 容器级整体高亮
- 表单 invalid 错误状态，独立专属焦点错误样式，不复用默认焦点

## 4. 间距体系

全局统一 8px 基准缩放间距，所有内外边距、组件间隙、布局留白**禁止手写固定px**，仅使用以下语义 Token：
`space-xs / space-sm / space-md / space-lg / space-xl`

## 5. 阴影与圆角分级

阴影严格分级，与圆角等级一一匹配，暗色模式自动适配透明度，禁止硬编码色值。

- shadow-faint + rounded-sm：微小行内元素、极简占位
- shadow-subtle + rounded-sm：小标签、紧凑行内控件、轻悬浮
- shadow-base + rounded-md：按钮、输入框、标准卡片
- shadow-elevated + rounded-xl：弹窗、悬浮浮层、顶级浮层

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

## 10. 全局强制约束（AI 编码规则）

1. 优先使用 Litefy 内置组件，禁止直接手写 div + 原生样式搭建业务UI
2. 所有颜色必须引用全局 CSS 变量，禁止硬编码色值
3. 组件默认样式仅可通过 Props 显式覆盖，禁止隐式篡改底层全局样式
4. 整体遵循 WCAG 2.2 AA 无障碍基线，关键场景按需适配 AAA
5. 代码审计仅记录问题，不自动修复，等待指令处理

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
- 支持变体：surface、outline、primary、success、warning、error、info
- surface：中性默认形态，muted 色系低视觉权重
- outline：边框型次要标签，轻量化展示
- primary：品牌强调标签，突出重点属性
- success / warning / error / info：标准系统语义状态色
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
- 支持语义变体：success、warning、error、info
- 各变体采用对应语义色低透底色 + 语义文字色，保证柔和且统一
- 圆角默认 rounded-md
- 设计约束：仅用于区块提示，短状态标记使用 Chip，行内操作使用 text Button

### Navigator

- 设计定义：独立筛选导航UI组件，承载查询条件、筛选控件、标题文本，不属于Table组件本体
- 设计 rationale：将视图与状态解耦；提供Navigator组件用于标准开箱布局，配套useNavigator Hook暴露纯状态逻辑；业务可按需二选一：直接用组件快速搭建，或单独引入Hook完全自定义DOM结构；不内置分页逻辑，分页属于Table复合套件；可与Table外部组合，不可作为Table内部子组件
- 布局特性：组件容器为flex，支持内部自动换行；同行放置其他控件时，控件组垂直居中对齐
- 设计约束：不内置分页逻辑，分页属于Table复合套件；可与Table进行外部组合，不可作为Table内部子组件

### Table

- 设计定义：结构化数据展示组件，具备桌面/移动端双形态；配套分页、页码摘要属于该复合组件的组成部分；Navigator为独立组件，由业务外部组装搭配
- 设计 rationale：桌面完整表格保证信息密度，移动端卡片化保证移动端可读性。分页与页码摘要和表格数据状态强绑定，纳入套件；筛选导航业务差异大，抽离为独立Navigator组件，避免业务耦合。
  1. 默认组合布局：Navigator与Table配套分页控件放在独立单行容器，容器宽度独立于表格；Navigator内文本支持自动换行，分页控件组在容器内垂直居中；该方案将控件区域与表格解耦，避免长文本挤压表格，长短表格均可使用。
  2. 可选品字变体：仅用于不搭配Navigator、仅基础页码的长表格；表格在上，底部左侧页码summary文本、右侧分页控件。
- 桌面端渲染标准表格，移动端自动转为卡片列表结构
- 无内置斑马纹，避免默认视觉干扰，业务需要可自行添加中性底色条纹
- 表头使用中性 accent 强调，不使用品牌色，保证品牌色只用于交互控件
- 列宽采用 max-width 约束膨胀，禁止固定死宽，保证自适应一致性

  **列宽强制设计约束**

1. 普通数据列最大宽度 max-w-48，防止列过度膨胀
2. 控件列可完全收缩，不受宽度限制
3. 禁止写死固定px列宽
4. 备注长文本列单独放宽至 max-w-80
5. 超长文本统一 ellipsis 省略，hover 提供完整提示
6. 禁止AI随意自定义每列宽度
