---
name: litefy-design
description: Litefy UI 设计规范。定义Surface容器色系、Brand品牌交互色、Interactor全局交互样式、组件使用规则，统一色彩、边框、焦点、布局与组件编码规范。
---

# Litefy UI Design Spec

## 1. 色彩体系

配色方案：一个中性色板 surface，一个品牌色板 brand。
surface包含前景色（--foreground）、背景色（--background）、次要前景色(--muted-foreground)、次要背景色(--muted-background)、强调色(--accent)、中性色(--neutral)。
background用于优先度比较高的容器背景色，他通常直接包含内容。
foreground用于正文文本。
muted-foreground用于补充说明、备注。
muted-background用于次要背景，通常是最外层的容器的背景色。
accent用于hover状态、border或者其他需要强调的场景。
neutral用于没有前景色的中性背景，比如骨架屏。
brand包含品牌色（--primary）、品牌强调色(--primary-accent)。
primary用于品牌交互元素。
primary-accent用于品牌交互元素的强调状态、焦点环。

## 2. 边框

- 全局默认基础边框：使用 var(--accent)/50。
- 品牌交互组件边框不使用默认边框，使用brand色板。
- 禁用态边框：在基础边框基础上降低透明度，搭配muted色系。
- 圆角统一使用全局圆角变量，禁止手写固定px。

## 3. 焦点环

全局焦点、禁用样式由interactive.css统一管理，业务代码无需手动编写焦点、禁用相关样式。

- 普通中性组件焦点环：var(--accent)。
- Brand品牌交互组件焦点环：1px实线 outline 使用 var(--primary-accent)，搭配3px光晕 ring 使用 var(--primary-accent)/50。
- 焦点环不可完全移除；支持prefers-reduced-motion，禁用焦点动画。
- 焦点环偏移少量距离，避免和控件本身边框重叠。
- 特殊场景补充：
  1. 表单输入容器使用 :has(:focus-within) 实现容器级焦点高亮。
  2. 表单校验失败（invalid）状态，需要单独补充错误焦点样式。

## 4. 间距体系

全部使用全局间距token，禁止手写固定px。
间距遵循8px基准缩放，统一语义：space-xs / space-sm / space-md / space-lg / space-xl。
内边距、外边距、组件间隙，全部复用这套token。

## 5. 阴影

阴影与圆角配套分级，一一对应：

- shadow-subtle：搭配rounded-sm，卡片、浮层轻微阴影，用于次要容器。
- shadow-base：搭配rounded-md，标准卡片、抽屉。
- shadow-elevated：搭配rounded-xl，弹窗、悬浮下拉，最高层级浮层。
  暗色模式自动调整阴影透明度，不硬编码色值。

## 6. 圆角分级

全部使用全局圆角变量，禁止手写固定px。

- rounded-sm：行内元素、小标签、紧凑行内控件
- rounded-md：普通表单控件、按钮（默认）
- rounded-lg：独立小容器，无嵌套子容器
- rounded-xl：大容器、页面级卡片、Drawer/弹窗外壳

## 7. 尺寸与布局

1. 文本容器组件TextBlock：默认max-w-160（max-width:640px），width:100%；允许用户显式props覆盖。仅用于大段连续正文，表格、表单、标题不套用该限制。
2. 表格仅桌面端渲染；移动端不渲染多列表格，单行数据转为卡片/list展示。
3. 桌面端表格行内小图标操作按钮：不强制44px触摸目标（桌面为精细指针输入）。
4. 移动端卡片内所有交互控件，可点击区域满足WCAG目标大小规范。
5. 容器使用max-width优先，尽量避免写死固定width。

## 8. 过渡 / 动画

- 所有动画遵守prefers-reduced-motion，检测到该偏好时移除非必要动画。
- 仅对opacity、transform做过渡；禁止对width/height/top/left这类布局属性做动画，防止布局抖动。
- 动画时长统一全局token，不手写时间。
- 骨架屏动画属于必要状态反馈，可保留。

## 9. 交互状态

所有交互控件统一五态：default / hover / active / focus / disabled。
focus、disabled、button专属active按压态由interactive.css全局托管；hover需要在组件内手动实现，无法全局预判。

> active仅对Button组件生效，其他控件不自动注入按压效果；若特定Button实例不需要按压感，可通过props关闭。

- hover：中性组件使用 --accent；brand组件使用primary系列。
- active：仅Button可用，按压瞬时状态，在hover基础上加深视觉反馈。
- disabled：降低透明度，文字使用muted-foreground，禁止鼠标pointer。
- 不依赖hover作为唯一功能入口（适配触屏）。

## 10. 排版

- 段落行高 ≥1.5，段落间距大于等于1.5倍行高。
- 禁止text-align: justify两端对齐，仅左对齐。
- 字体大小使用全局字号token，禁止手写px。
- 标题层级严格按h1~h6语义，不可跳级。

## 11. 全局约束（AI强制规则）

1. 优先使用Litefy内置组件，不直接手写div+原生样式做业务组件。
2. 颜色全部引用CSS变量，禁止硬编码色值。
3. 组件默认值可通过props显式覆盖；隐式改写底层样式不允许。
4. 代码层面遵循WCAG 2.2 AA基线，按需向AAA增强。
5. 审计只记录问题，不自动修复，等待后续命令处理。

## 12. 组件专项规则

### Button

- 品牌主按钮：使用brand色板 primary / primary-accent。
- 次要/中性按钮：使用surface accent。
- 空心按钮hover可填充背景，边框与hover色统一。
- active按压态由interactive.css全局提供，默认开启；支持props关闭按压效果。
- 圆角默认rounded-md。
- 禁用态：muted色系，取消交互。

### Tag

- 标签使用surface accent做边框/背景弱化高亮。
- 文字使用muted-foreground，保证对比度。
- 圆角默认rounded-sm。

### Input / Form 控件

- 默认背景：var(--background)，和父容器内容层一致，依靠边框区分边界。
- 焦点：边框/焦点环使用 --accent。
- 只读状态：背景改为--muted-background。
- 禁用状态：背景--muted-background，文字--muted-foreground。
- 表单必须绑定label，不可仅靠placeholder。
- 圆角默认rounded-md。

### Table

- 仅桌面端渲染完整多列表格视图。
- 移动端不渲染表格DOM，转换为卡片列表。
- 表格行内操作图标仅桌面可用，不强制44px触摸目标。
- 斑马纹使用透明度叠加，不新增独立色值。
- 表格单元格无额外圆角；表格外层容器按需使用rounded-md。

### 折叠面板 / Drawer

- Drawer浮层使用shadow-elevated，圆角默认rounded-xl。
- 背景遮罩：半透明muted-background。
- 内部内容容器背景使用--background。
- Drawer打开时锁定页面滚动；支持键盘ESC关闭。
- 焦点管理：打开Drawer自动将焦点移入，关闭时归还焦点到触发控件。
- 折叠面板标题可点击，语义button；展开/收起状态使用aria-expanded。
- 折叠面板容器圆角默认rounded-lg。
