# Litefy UI Demo 审计报告

> 生成日期：2026-09-29。数据源：`content/docs/component/*.mdx`（英文版 API Reference）、`app/demos/index.ts`（registry）、`app/demos/**/*.tsx`（demo 源码，逐个读过）。

## 概览

| 项   | 值                                                          |
| ---- | ----------------------------------------------------------- |
| 组件 | **75**（英文 mdx 全量，每个组件至少 1 个 demo）             |
| Demo | **182** 个 registry key = 177 个组件 demo + 5 个 hooks demo |

**审计原则（三行）**

1. 一个 demo = 一个 basic 教不了的知识点：纯状态（invalid/disabled/mask）按 HeroUI 化定案为独立小 demo（见原则 4 反转）；代码形态变化（受控接线、校验函数、异步模拟、类型差异、函数 prop）、正交维度（orientation/grouped/图表类型）、parts 拼装保留独立 demo。
2. variants demo 只展示非默认变体（basic 已展示默认变体）；文档结构固定 Basic → Variants → Custom。
3. classNames/styles/className 透传类 prop 不需要 demo（API 表即接口说明）；只有"行为/视觉显著且现有 demo 完全没体现"的 prop 才算缺失，且优先并入现有 demo 而非新建。
4. ~~属性全景 basic（2026-09-29 定案）~~ **已被 HeroUI 化取代（2026-09-29 反转）**：用户审阅示例墙后否决属性全景方向（basic 塞入多状态格后过密、无法压缩、观感差），改为 **HeroUI 风格——一个属性一个 demo**：纯状态（disabled/invalid/mask）恢复/新建独立小 demo，basic 回归单一规范用法；零信息量 controlled 模板（useState+回显）仍然不恢复。性能评估结论：细拆无惩罚（产物 ≠ 请求数，demo chunk 每页只拉 1-5 个；HTTP/2 多路复用下 header/帧开销可忽略；hash 隔离下改一个 demo 只失效自身 chunk，缓存更有利）。

## 行动建议（按优先级）

| #   | 类型 | 对象                              | 建议                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| --- | ---- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 冗余 | `upload-multiple`                 | 与 `upload-basic` 高度重叠：basic 已含 multiple、maxCount、maxSize、拒绝回显及 useUploadMonitor 进度接线；multiple 仅多 accept 过滤一个差异点。建议把 accept 并入 basic 后删除该 demo。**已执行**：basic 加 accept，demo 已删，mdx Restrictions 小节并入 Basic。                                                                                                                                                                                  |
| 2   | 冗余 | `scroll-shadow-size`              | 仅演示边缘渐变高度 h-8 vs h-32（`classNames.edge` 覆盖内置 h-16/w-16）的参数对比，属纯视觉参数（原则①），API 表已说明机制。建议并入 `scroll-shadow-position` 一起展示，或删除。顺带发现：AGENTS.md 称 ScrollShadow 有 `size` prop（默认 64px），但 mdx API 表没有此 prop，两处文档不一致，建议核对源码后统一。**已执行**：size 并入 position（追加 classNames.edge h-8/h-32 两格成 2×2）后删除 demo；已核实源码无 `size` prop，AGENTS.md 已修正。 |
| 3   | 可选 | steps 的 `clickable` / `maxIndex` | 全部 demo 未体现（basic 只有 index/onChange，vertical 只有 orientation）。Wizard 已隐含展示锁定导航；如需，可并入 `steps-basic`，不建议新建。**已执行**：basic 加 maxIndex state + go()（组合 Steps 内部派生 clickable={i<=maxIndex && i!==index}，无需显式传）。                                                                                                                                                                                 |

**复核结论：值得新建 0；真冗余 2（#1、#2）；可选并入 1（#3）——三条均已执行（2026-09-29），demo 总数 156 → 154。后续追加（同日）：form-validation 并入 form-basic、form-item-validation 并入 form-item/basic（表单 basic 统一自带校验），demo 总数 → 152。**

**HeroUI 化反转（2026-09-29，用户定案后直接执行）**：上两段按"属性全景 basic"执行的合并全部回退——恢复 upload-multiple、scroll-shadow-size、form-validation、form-item-validation、image-loading、input-otp-mask、number-field-invalid、password-invalid、radio-disabled、switch-disabled（basic 同步瘦身回退，mdx 恢复小节）；badge 三合一拆回 basic + sizing + marker-color；steps 拆出 locked（maxIndex/clickable）独立 demo。新建 18 个：14 组件 disabled（checkbox/password/select/input-otp/number-input/date-picker/dual-picker/upload/chat-input/pagination/query-builder/form-item/segment/wizard）+ combobox-invalid + combobox-empty + timeline-marker + donut-value-formatter（gap 不再单建——donut-pie 已演示）。仍不恢复：5 个 controlled 模板、table/atoms-test。本报告各组件行的"并入 basic"表述均按反转后的口径重新理解。demo 总数 → 182。
其余边缘 prop 均按原则判为"不缺"，理由见各组件行：datepicker 的 `isDateDisabled`（与 calendar/disabled 同知识点）、pager 的 `transition` / `offset`、timeline 的 `marker` / `connector`、transfer 的 `renderItem`、query-builder 的 `operatorLabels`、list 的 `onScrollBottom`（masonry/custom 已演示 useLoadMore 无限加载接线）、popover 的 `mode="hover"`、chart 的组合配置。

## 逐组件审计（按 mdx 文件名序）

#### Avatar

| 接口                                                                                                                 | 说明                                                     |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `src`（必填）、`skeleton`、`fallback`                                                                                | 图片三态：加载骨架 → 图片 → 失败兜底（兜底可传任意节点） |
| `className` / `style` / `classNames.image` / `styles` 透传                                                           | 尺寸、圆角自定                                           |
| 现有 demo：`avatar-basic`（正常图＋自定义骨架/坏图兜底）｜`avatar-custom`（AvatarRoot+AvatarImage 拼装圆角头像容器） |
| 缺失：无 ｜ 冗余：无                                                                                                 |

#### Badge

| 接口                                                                                                           | 说明                           |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `label`（角标内容，数字/文本）、`children`（主体，常为图标）                                                   | 右上角附着角标，非独立状态标签 |
| `className` / `classNames.label` / `styles` 透传                                                               | 换角标颜色等                   |
| 现有 demo：`badge-basic`（空徽标、数字/文本角标、包裹图标、classNames.label 换色——三合一后的 basic，既定保留） |
| 缺失：无 ｜ 冗余：无                                                                                           |

#### Banner

| 接口                                                                                                                                        | 说明             |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `items`（必填）、`speed`（秒/圈，默认 30）、`direction`、`pauseOnHover`                                                                     | 自动滚动 marquee |
| `className` / `classNames.track` / `classNames.item` / `styles` 透传                                                                        | 间距与条目样式   |
| 现有 demo：`banner-basic`（三条公告 + speed + hover 暂停）｜`banner-custom`（BannerViewport/Track/Item 拼装，direction="right"、图标+文字） |
| 缺失：无 ｜ 冗余：无                                                                                                                        |

#### Breadcrumb

| 接口                                                                                       | 说明             |
| ------------------------------------------------------------------------------------------ | ---------------- |
| `items`（label / href，末项为当前页）                                                      | 数据驱动导航路径 |
| `className` / `classNames.list` / `link` / `page` / `separator` 透传                       | 分段样式         |
| 现有 demo：`breadcrumb-basic`（items 数据驱动）｜`breadcrumb-custom`（六个零件拼装同结构） |
| 缺失：无 ｜ 冗余：无                                                                       |

#### Button

| 接口                                                                                                                                                                    | 说明               |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `variant`（primary 默认 / danger / outline / text）、`loadingConfig`（loading + icon）、icon-only 自动方 padding                                                        | 按钮四变体与加载态 |
| `Button.className` 静态串（给非按钮元素套外观）、`className` / 原生 props 透传                                                                                          | `<a>` CTA 复用     |
| 现有 demo：`button-basic`（四 variant 一排，兼作变体总览）｜`button-loading`（loadingConfig 受控换 spinner，三 variant）｜`button-icon`（图标+文字、纯图标+aria-label） |
| 缺失：无（`Button.className` 静态串在 mdx 有代码片段，不需要 demo） ｜ 冗余：无                                                                                         |

#### Calendar

| 接口                                                                                                                                                                               | 说明                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `visibleMonth`（必填）、`value` / `defaultValue` + `onChange`、`view`（days/months/years）+ `onViewChange`、`onVisibleMonthChange`                                                 | Temporal 受控三视图 |
| `isDateDisabled`（函数）、`firstDayOfWeek`、`className` 透传                                                                                                                       | 禁用规则与起始日    |
| 现有 demo：`calendar-basic`（受控 + firstDayOfWeek=1 回显）｜`calendar-disabled`（isDateDisabled 禁过去+周末，函数 prop，既定保留）｜`calendar-custom`（全零件拼装，三视图自管理） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                               |

#### Callout

| 接口                                                                    | 说明           |
| ----------------------------------------------------------------------- | -------------- |
| `variant`（info 默认 / success / warning / danger）、`className` 等透传 | 软色块静态反馈 |
| 现有 demo：`callout-basic`（四 variant 一排）                           |
| 缺失：无 ｜ 冗余：无                                                    |

#### Capsule

| 接口                                                                                            | 说明      |
| ----------------------------------------------------------------------------------------------- | --------- |
| `children`（任意子元素视觉拼接）、`className` 等透传、`Capsule.className` 静态串                | pill 容器 |
| 现有 demo：`capsule-badge`（包多个 Chip 拼徽标条）｜`capsule-link`（整体包进 `<a>` 成可点胶囊） |
| 缺失：无 ｜ 冗余：无                                                                            |

#### Card

| 接口                                                  | 说明                                           |
| ----------------------------------------------------- | ---------------------------------------------- |
| `className` / 原生 props 透传                         | 静态玻璃面：rounded-lg + shadow-base，无 hover |
| 现有 demo：`card-basic`（标题+文案+按钮组的静态卡面） |
| 缺失：无 ｜ 冗余：无                                  |

#### CardButton

| 接口                                                                                                                                             | 说明                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| `variant`（默认 outline）、`className` / 原生 button props 透传                                                                                  | 卡形按钮，rest shadow-base → hover shadow-elevated |
| 现有 demo：`card-button-basic`（两张指标卡按钮，默认外观）｜`card-button-variants`（primary/danger/text 非默认三变体，outline 行已删——既定修复） |
| 缺失：无 ｜ 冗余：无（variants 只展示非默认变体，符合原则②）                                                                                     |

#### Cascader

| 接口                                                                                  | 说明                           |
| ------------------------------------------------------------------------------------- | ------------------------------ |
| `tree`（必填，多级节点）、`placeholder`、`className` / `classNames` / `styles` 透传   | 面包屑触发器 + CSS anchor 面板 |
| 现有 demo：`cascader-basic`（州/市/区三级树选择）                                     |
| 缺失：无（CascaderTrigger 单独拼装未示，但 basic 已含触发器形态，不硬凑） ｜ 冗余：无 |

#### Chart

| 接口                                                                                                                                                          | 说明                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 经 `useChart` 配置（`data` / `series` / `time` / `onReady` 等），series 支持 `type: line / area / bar` 与 stroke/width/fill/value 定制                        | chart-kit 数学层 + chart-paint 画布 |
| 现有 demo：`chart-line`（时间轴 4 series 折线）｜`chart-area`（fill 面积+线）｜`chart-bars`（type bar ×2 + useChartPalette mono + value 格式化 + time=false） |
| 缺失：无 ｜ 冗余：无（line/area/bar 是图表类型，不适用组合/状态框架——既定例外）                                                                               |

#### ChartLegend

| 接口                                                                                                    | 说明                   |
| ------------------------------------------------------------------------------------------------------- | ---------------------- |
| `items`（必填）、`hidden`、`swatch`（line / square）、`onToggle`、`onHover`、`className` / `style` 透传 | 图表/环形/雷达共用图例 |
| 现有 demo：`chart-legend-basic`（两种 swatch + hidden/onToggle 联动回显）                               |
| 缺失：无 ｜ 冗余：无                                                                                    |

#### ChatInput

| 接口                                                                                                                            | 说明               |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `value` / `defaultValue` + `onValueChange`、`onSend`（{ text, images }）、`enterToSend`、`autoPaste`、`placeholder`、`disabled` | 聊天作曲器         |
| `attach`、`actions` 插槽、透传                                                                                                  | 左侧附件、右侧动作 |
| 现有 demo：`chat-input-basic`（attach + actions 两个 Toggle + onSend 回显 + 粘贴截图提示）                                      |
| 缺失：无 ｜ 冗余：无                                                                                                            |

#### Checkbox

| 接口                                                                                                                                                                        | 说明     |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `checked` / `defaultChecked` + `onCheckedChange`、`indicator` 自定义、`disabled`、透传                                                                                      | 单选框   |
| `CheckboxGroup`：`options`（平铺/分组）、`value` + `onChange`、`name`、`common`                                                                                             | 组收集值 |
| 现有 demo：`checkbox-basic`（单个 defaultChecked）｜`checkbox-group`（受控全选联动 + options + 自定义 indicator）｜`checkbox-custom`（零件拼装：全选 indeterminate + 子项） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                        |

#### Chip

| 接口                                                                                                                                        | 说明         |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `variant`（primary 默认 / outline / success / warning / danger / info）、`className` / span 透传                                            | 内联状态标签 |
| 现有 demo：`chip-basic`（六 variant 一排，兼作变体总览）｜`chip-variants`（内嵌 `<a>` / `<button>` 的交互 chip——Chip 管视觉、子元素管语义） |
| 缺失：无 ｜ 冗余：无（variants 实为交互用法，与 basic 知识点不同）                                                                          |

#### ChipGroup

| 接口                                                                                                                                          | 说明         |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `items`、`renderMore`（溢出"更多"的自定义宿主）、`onOverflowChange`、透传（max-width 控折叠）、`classNames.chip`                              | 自动折叠溢出 |
| 现有 demo：`chip-group-basic`（renderMore 用 Popover 展示隐藏项 + Slider 拖宽度演示折叠）｜`chip-group-tooltip`（renderMore 换 Tooltip 宿主） |
| 缺失：无 ｜ 冗余：无（两种 renderMore 宿主写法，差异点明确）                                                                                  |

#### Collapse

| 接口                                                                                                                                                                                      | 说明       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 单面板：`label`、`icon`（可传函数）、`open` / `defaultOpen` + `onOpenChange`、`itemKey`、透传                                                                                             | 折叠面板   |
| `Accordion`：`items`、`multiple`（默认 false）、`activeKeys` / `defaultActiveKeys` + `onKeyChange`、`common`                                                                              | 手风琴     |
| 零件：CollapseRoot / CollapseTrigger / CollapsePanel                                                                                                                                      | 自定义拼装 |
| 现有 demo：`collapse-basic`（单面板 Collapse）｜`collapse`（注意：该 registry key 是 Accordion 手风琴 demo——items + 受控 + common.icon 函数）｜`collapse-custom`（三零件 + context 拼装） |
| 缺失：无 ｜ 冗余：无（registry 中 `collapse` 与 `collapse-basic` 的命名错位建议留意，属命名问题非内容问题）                                                                               |

#### Combobox

| 接口                                                                                                                         | 说明           |
| ---------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `options`（string[] 本地过滤）或 `fetcher`（远程搜索）、`value` / `defaultValue` + `onValueChange`、`pageSize`、`debounceMs` | 输入+弹出列表  |
| `invalid`、`empty`、`classNames.panel` / `classNames.item`、透传                                                             | 状态与面板样式 |
| 现有 demo：`combobox-basic`（options 本地过滤）｜`combobox-async`（fetcher 模拟千条异步分页搜索）                            |
| 缺失：无 ｜ 冗余：无                                                                                                         |

#### Command

| 接口                                                                                                                                                       | 说明           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `items`（组/项：label、value、icon、shortcut、keywords、disabled）、`trigger`、`open` / `defaultOpen` + `onOpenChange`、`onSelect`、`filter`、`renderItem` | 命令面板对话框 |
| 零件：CommandRoot / CommandInput / CommandList                                                                                                             | 无 dialog 组合 |
| 现有 demo：`command-basic`（⌘K 全局快捷键接线 + 分组/图标/快捷键/keywords/disabled + onSelect）｜`command-parts`（三零件组合，无 dialog）                  |
| 缺失：无 ｜ 冗余：无                                                                                                                                       |

#### ContextMenu

| 接口                                                                                                                                         | 说明           |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `<ContextMenuHost />` 挂载一次；`ContextMenu.open({ x, y, items, onSelect, classNames, styles })`、`ContextMenu.dismiss()`                   | 命令式右键菜单 |
| 现有 demo：`context-menu-basic`（Host + 右键 open + onSelect 回显）｜`context-menu-custom`（open 传 classNames.content 定制样式 + 混合分组） |
| 缺失：无 ｜ 冗余：无                                                                                                                         |

#### DatePicker（datepicker.mdx）

| 接口                                                                                                                  | 说明                |
| --------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `value` / `defaultValue` + `onValueChange`（Temporal 日期）、`placeholder`、`disabled`、`invalid`                     | 可编辑输入 + 月面板 |
| `isDateDisabled`、`firstDayOfWeek`、`trailing`、透传                                                                  | 规则与插槽          |
| 现有 demo：`date-picker-basic`（受控 Temporal + firstDayOfWeek=1 回显）                                               |
| 缺失：`isDateDisabled` 未体现——与 `calendar-disabled` 同知识点，不建议新建；如需可在 basic 顺带加禁用周末 ｜ 冗余：无 |

#### Dialog

| 接口                                                                                                                                                                                               | 说明                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `open`（必填）、`title`（渲染头部行）、`onOpenChange`、`onBackdropClick`、透传；内置 ESC 关闭按钮                                                                                                  | 原生 `<dialog>` 模态 |
| 零件：DialogRoot / DialogClose / DialogContent；`dialog.success` / `warning` / `error` / `info` 命令式                                                                                             | 自定义拼装/命令式    |
| 现有 demo：`dialog-basic`（受控开关 + title 头部 + onBackdropClick）｜`dialog-custom`（三零件拼装 + showModal/close 自管理生命周期）｜`dialog-command`（dialog.success/warning/error/info 命令式） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                               |

#### Donut

| 接口                                                                                                              | 说明      |
| ----------------------------------------------------------------------------------------------------------------- | --------- |
| `data`（label/value）、`variant`（donut 默认 / pie）、`gap`、`valueFormatter`、`showLegend`、透传                 | 环形/饼图 |
| 现有 demo：`donut-basic`（环形图，含无障碍标注）｜`donut-pie`（variant="pie" + gap + valueFormatter，非默认变体） |
| 缺失：无 ｜ 冗余：无                                                                                              |

#### Drawer

| 接口                                                                                                                                                                                                                                     | 说明                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `open`（必填）、`placement`（top/right/bottom/left）、`onOpenChange`、`onBackdropClick`、`onCancel`、`drag`、`ref`、透传                                                                                                                 | 滑入面板 + 触摸拖拽 |
| 零件：DrawerRoot / DrawerWrapper / DrawerDrag / DrawerContent                                                                                                                                                                            | 自定义拼装          |
| 现有 demo：`drawer-basic`（placement="right" 受控 + onBackdropClick）｜`drawer-expandable`（drag 传 useDrag：底部抽屉上拉展开/下拉收起，低于 min-height 自动关）｜`drawer-custom`（四零件 + useDrag 自接线拖拽高度、transitionend 关闭） |
| 缺失：无（其余 placement 为同构枚举，不值得 demo） ｜ 冗余：无                                                                                                                                                                           |

#### DropdownMenu

| 接口                                                                                                                | 说明                      |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `trigger`、`items`（同 Menu：分组、二级子菜单）、`onSelect`、`alignX`、`classNames`（content / item / label / sub） | Trigger+Popover+Menu 组合 |
| 现有 demo：`dropdown-menu-basic`（分组 + 二级子菜单 + onSelect 回显）                                               |
| 缺失：无 ｜ 冗余：无                                                                                                |

#### DualPicker

| 接口                                                                                                                                                                          | 说明         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `options`（必填）、`mode`（single / multiple）、`value` / `defaultValue` + `onValueChange`、`disabled`                                                                        | 双面板穿梭   |
| `renderOption` / `renderSelected` / `getLabel`（render-props）、`searchPlaceholder`、`sourceTitle` / `targetTitle`、透传                                                      | 行渲染与文案 |
| 现有 demo：`dual-picker-basic`（multiple + renderOption/renderSelected 自定义行——emoji 商品+价格——+ getLabel）｜`dual-picker-single`（single 选 Owner + 标题/占位定制、受控） |
| 缺失：无（render-props 已在 basic 体现） ｜ 冗余：无                                                                                                                          |

#### FieldSearch

| 接口                                                                                                                                                           | 说明                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `fields`（文本字段带 placeholder；枚举字段带 options / allLabel）、`onSearch(field, value)`（裁剪后回调、清空/切换发空值、IME 保持）、`debounceMs`（默认 300） | 字段+值组合过滤输入 |
| 现有 demo：`field-search-basic`（文本字段 + 枚举字段，onSearch 回显 field=value）                                                                              |
| 缺失：无 ｜ 冗余：无                                                                                                                                           |

#### Form

| 接口                                                                                                                                                                                                                                                      | 说明                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `onSubmit`（校验全过才触发，返回 true 触发 autoReset）、`autoReset`、`onReset`、`ref`（setValues / reset / submit）、`Form.Submit`（pending 态）                                                                                                          | 表单容器与命令式控制 |
| `useFieldValidity` hook + `setFieldError`                                                                                                                                                                                                                 | 自定义接线           |
| 现有 demo：`form-basic`（FormItem+Group+Submit + required/validate 校验（onChange/onBlur 两种触发）+ ref setValues 一键填充/reset + 异步 submit，原 form-validation 已并入）｜`form-parts`（useFieldValidity + 裸 Input 手动接线、aria-invalid 驱动样式） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                                                                                      |

#### FormItem

| 接口                                                                                                                                                       | 说明                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `variant`（input / textarea / select / password / number-input）、`name`（必填）、`label`、`description`、`required`、`disabled`                           | 自管字段：label → 控件 → 提示行 |
| `validate`（字符串硬错 / { message, invalid: false } 仅提示 / false / 通过）、`validateTrigger`、`controlProps`（包装非替换）、透传                        | 校验与控件转发                  |
| 现有 demo：`form-item`（四种 variant + 硬错误/仅提示两种 validate 返回形态（nickname 字段）+ validateTrigger + ref reset，原 form-item-validation 已并入） |
| 缺失：无 ｜ 冗余：无                                                                                                                                       |

#### Image

| 接口                                                                                                                                                                    | 说明              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `src`（必填）、`alt`、`fallback`（失败节点）、`loadingNode`（自定义加载占位）、透传                                                                                     | 加载占位/失败兜底 |
| 零件：ImageRoot / ImageImage                                                                                                                                            | 拼装              |
| 现有 demo：`image-basic`（三格：默认空白占位 / loadingNode 模糊缩略图渐进加载 / fallback 失败兜底，原 image-loading 已并入）｜`image-custom`（Root+Image 拼装头像容器） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                    |

#### Input

| 接口                                                                                                                                                                                                                          | 说明     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `type`（限 text / email / url / tel / search）、`leading` / `trailing` 插槽、`invalid`、透传                                                                                                                                  | 文本输入 |
| 现有 demo：`input-basic`（type + leading 图标 + trailing 文案）｜`input-invalid`（受控邮箱正则校验 → invalid 边框 + 错误文案，既定保留）｜`input-custom`（InputGroup+InputRoot+Leading/Trailing 拼装，trailing 动态切换图标） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                                                          |

#### InputGroup

| 接口                                                                                 | 说明              |
| ------------------------------------------------------------------------------------ | ----------------- |
| `invalid`、透传；零件 InputRoot / InputLeading / InputTrailing（子元素自动去焦点环） | 焦点/invalid 外壳 |
| 现有 demo：`input-group-basic`（$ 前缀 + USD 后缀 + invalid + disabled 三例）        |
| 缺失：无 ｜ 冗余：无                                                                 |

#### InputOtp

| 接口                                                                                                                                                                                                                       | 说明                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `length`、`value` / `defaultValue` + `onValueChange`、`mask`、`disabled`、`invalid`、`name`、透传                                                                                                                          | 一次性验证码：自动前进、粘贴、掩码 |
| 零件：InputOtpSlot / InputOtpGroup                                                                                                                                                                                         | 拼装                               |
| 现有 demo：`input-otp-basic`（6 位普通 + mask 两例）｜`input-otp-invalid`（受控码校验 520520，错码标红 + role=alert，既定保留）｜`input-otp-custom`（Slot/Group 拼装 3+3 分组圆格 + 自接线 advance/backspace/paste，已补） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                                                       |

#### Kbd

| 接口                                                                                 | 说明               |
| ------------------------------------------------------------------------------------ | ------------------ |
| `children`（键名）、`className` / kbd 透传                                           | 键帽视觉（纯静态） |
| 现有 demo：`kbd-basic`（单键一览）｜`kbd-combination`（组合键排列：⌘⇧P、Ctrl+C、⌘K） |
| 缺失：无 ｜ 冗余：无                                                                 |

#### List

| 接口                                                                                                                                                                                                | 说明               |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `items`、`renderItem`、`getKey`、`empty`、`onSelect`、`onItemMouseMove`、`ref`、透传                                                                                                                | 可滚动列表         |
| `highlightIndex` / `onHighlightChange`（键盘导航）、`getGroup` + `renderGroupHeader`、`onScrollBottom`（触底 16px）                                                                                 | 高亮/分组/无限加载 |
| 现有 demo：`list-basic`（items+getKey+renderItem+empty）｜`list-grouped`（getGroup+renderGroupHeader 按部门分组 + onSelect）｜`list-order`（Order 有序变体：`<ol>` list-decimal + classNames.item） |
| 缺失：`onScrollBottom` 未体现——但 masonry/custom 已演示 useLoadMore 无限加载接线、回调语义直白，不建议新建；如需可在 basic 顺带加 ｜ 冗余：无                                                       |

#### Masonry

| 接口                                                                                                                                                | 说明           |
| --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `items`、`renderItem`、`getKey`、`columns`（数字或响应式配置）、透传（默认 gap-4）                                                                  | 测高均衡瀑布流 |
| 现有 demo：`masonry-basic`（columns { base: 2, md: 3 } 不等高卡片）｜`masonry-custom`（容器内滚动 + useLoadMore 分页加载 8 条/页 + Load more 按钮） |
| 缺失：无 ｜ 冗余：无                                                                                                                                |

#### Menu

| 接口                                                                                                                                                  | 说明       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `items`（必填：分组、二级子菜单）、`autoFocus`、`onSelect`、`onEscape`、透传（面板 className）、零件 MenuRoot / MenuItem / MenuLabel / MenuSubContent | 文档流菜单 |
| 现有 demo：`menu-basic`（分组 + 二级子菜单 + onSelect 回显 + className 面板定制）                                                                     |
| 缺失：无 ｜ 冗余：无                                                                                                                                  |

#### MultiSelect

| 接口                                                                                                                                     | 说明     |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `options`（复用 Checkbox 配置，平铺/分组）、`value` / `defaultValue` + `onChange`、`trigger` / `placeholder`、`classNames.content`、透传 | 弹出多选 |
| 现有 demo：`multi-select-basic`（平铺 options 受控回显）｜`multi-select-grouped`（CheckboxOptionGroup 分组）                             |
| 缺失：无 ｜ 冗余：无                                                                                                                     |

#### NumberField

| 接口                                                                                                                                                                                                            | 说明                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `value` / `defaultValue` + `onValueChange`（普通模式 string；positiveInteger 模式 number 或 null）、`min` / `max` / `step`、`positiveInteger`、`thousands`、`invalid`、`variant="embedded"`、`disabled`、透传   | 带 −/+ 步进按钮的数字字段 |
| 现有 demo：`number-field-basic`（min/max、step 0.1、embedded、disabled、thousands+invalid 五例）｜`number-field-controlled`（string 模式 vs positiveInteger 模式返回类型 number/null 的类型差异回显，既定保留） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                                            |

#### NumberInput

| 接口                                                                                                                                                                                    | 说明                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `value` / `defaultValue`、`min` / `max` / `step`、`positiveInteger`、`thousands`、`prefix` / `suffix`、`indicator`、`invalid`、透传                                                     | 有边框数字输入（步进仅键盘） |
| 现有 demo：`number-input-basic`（thousands+prefix/suffix、min/max/step、小数步进、positiveInteger+indicator=false）｜`number-input-custom`（InputGroup+NumberRoot 拼装 Qty/pcs 裸输入） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                    |

#### Pager

| 接口                                                                                                                                     | 说明     |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `index` + `onChange`（受控，单 DOM）、`loop`、`transition="view-transition"`、`gesture`（触摸拖拽）、`offset`、`className`（须自带宽高） | 翻页容器 |
| 现有 demo：`pager-basic`（受控 index/onChange + 前后按钮，4 页）｜`pager-gesture`（loop + 触摸拖拽换页）                                 |
| 缺失：`transition` / `offset` 未体现——一行 prop、内置 view transition 开箱即得，不建议补 ｜ 冗余：无                                     |

#### Pagination

| 接口                                                                                                                                           | 说明                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `page` / `totalPages`（必填）+ `onPageChange`、`siblingCount`（默认 1）、`disabled`、`summary`、透传                                           | 纯视图，状态在 usePagination |
| 零件：PaginationRoot / First / Prev / Pages / Ellipsis / Next / Last / Summary                                                                 | 自定义拼装                   |
| 现有 demo：`pagination-basic`（usePagination 接线 + summary 短文案）｜`pagination-long-summary`（长 summary 换行不挤压控件——左右布局边界行为） |
| 缺失：无 ｜ 冗余：无                                                                                                                           |

#### Paper

| 接口                                                                        | 说明                     |
| --------------------------------------------------------------------------- | ------------------------ |
| `variant`（缺省全宽滚动纸面 / a4 / a5 / a4-landscape / a5-landscape）、透传 | 打印就绪页面（打印分页） |
| 现有 demo：`paper-basic`（缺省纸面 + 打印分页说明）                         |
| 缺失：其余 variant 为纯尺寸枚举，API 表即说明，不补 ｜ 冗余：无             |

#### Password

| 接口                                                                                                                                    | 说明                  |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| `value`、`visible` / `defaultVisible` + `onVisibleChange`、`invalid`、`disabled`、透传                                                  | 密码输入 + 可见性切换 |
| 零件：PasswordRoot / PasswordToggle / PasswordGroup                                                                                     | 拼装                  |
| 现有 demo：`password-basic`（普通 + invalid 两例，切换内置）｜`password-custom`（Group/Root/Toggle 拼装 + 受控 visible + 主色切换按钮） |
| 缺失：无 ｜ 冗余：无                                                                                                                    |

#### Picker

| 接口                                                                                                                                                  | 说明              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `value` / `defaultValue` + `onValueChange`、`open` / `defaultOpen` + `onOpenChange`、`trailing`、`children`（任意面板内容）、`panelRef`、透传         | 通用输入+弹出容器 |
| 零件：PickerRoot（挂 anchorName）/ PickerInput / PickerContent（popover="manual" 手动 show/hide + positionAnchor）                                    | 拼装              |
| 现有 demo：`picker-basic`（值 + 自由面板内容 + trailing 图标）｜`picker-datepicker`（Picker+Calendar 拼出可输入日期字符串、Enter 提交——面板接线示范） |
| 缺失：无 ｜ 冗余：无                                                                                                                                  |

#### Popover

| 接口                                                                                                                                                                                                                                                       | 说明                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `trigger`、`children`、`open` / `defaultOpen` + `onOpenChange`、`alignX`（start / end / center）、`mode`（click 默认 / hover）、`classNames` / `styles`（styles.content.positionArea 可覆盖 alignX）                                                       | 原生 popover + CSS anchor |
| 零件：PopoverContent（open/showPopover/hidePopover、onOpenChange、ref）、`usePopoverTrigger`（mode / hoverDelayOpen / hoverDelayClose）                                                                                                                    | 拼装与接线                |
| 现有 demo：`popover-basic`（trigger + 面板动作回显）｜`popover-alignment`（positionArea span-right/span-all/span-left + alignX start/end 摆放对比）｜`popover-custom`（Button+PopoverContent 手动接线：anchorName、showPopover/hidePopover、点击外部关闭） |
| 缺失：`mode="hover"` 未体现——交互差异小（延迟开闭），不建议补 ｜ 冗余：无                                                                                                                                                                                  |

#### PreviewCard

| 接口                                                                                                                                                    | 说明                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `src`、`alt`、`title`、`description`、`trigger`（有则渲染 `<a>` 悬停锚点+tooltip）、`href`、`delay`、`classNames`（image / body / title / description） | Card+Image+Tooltip 组合 |
| 现有 demo：`preview-card-basic`（trigger 链接悬停出卡）｜`preview-card-image`（无 trigger 的内联卡片 + classNames.image 高度覆盖——既定改后的独立内容）  |
| 缺失：无 ｜ 冗余：无                                                                                                                                    |

#### Progress

| 接口                                                                                                                     | 说明         |
| ------------------------------------------------------------------------------------------------------------------------ | ------------ |
| `current`（0-100 自动钳制）、`duration`（过渡时长 ms）、`isAbort`（失败色冻结）、`isComplete`（成功色满格）、`className` | 纯 UI 进度条 |
| 现有 demo：`progress-basic`（模拟上传：current/duration 平滑推进 + isComplete/isAbort 配色 + Start/Abort/Reset）         |
| 缺失：无 ｜ 冗余：无                                                                                                     |

#### QueryBuilder

| 接口                                                                                                                                        | 说明           |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `fields`（必填：name / label / operators / valueKind / options）、`defaultValue`（Reset 恢复目标）、`onSubmit` / `onQueryChange`、`onReset` | 规则树查询构建 |
| `showPreview`、`maxDepth`（默认 2）、`disabled`、`operatorLabels` 静态、透传                                                                | 预览与本地化   |
| 现有 demo：`query-builder-basic`（五种 valueKind 字段 + 嵌套组 + 实时预览 + Submit/Reset）                                                  |
| 缺失：`operatorLabels` 本地化未体现——静态一行配置，API 表即说明，不补 ｜ 冗余：无                                                           |

#### Radar

| 接口                                                                                                                  | 说明                           |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `axes`、`series`（label / values / color）、`max`、`levels`、`showLegend`、`className` / `classNames` / `styles` 透传 | 雷达图（hover 聚焦、图例联动） |
| 现有 demo：`radar-basic`（axes + 双 series + 图例点击隐藏联动回显）                                                   |
| 缺失：无 ｜ 冗余：无                                                                                                  |

#### Radio

| 接口                                                                                                                                               | 说明   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `children`、`checked` / `defaultChecked` + `onCheckedChange`、`indicator`（自定义圆点内容）、`classNames` / `styles` / 透传                        | 单选框 |
| `Radio.Group`：`options`、`value` + `onValueChange`、`name`（启用方向键）、`common`、整组 `disabled`                                               | 选项组 |
| 现有 demo：`radio-basic`（Radio.Group 平铺 + 单项 disabled + 整组 disabled）｜`radio-custom`（Label/Indicator/Root 拼装 Check 图标替代圆点，已补） |
| 缺失：无 ｜ 冗余：无                                                                                                                               |

#### ScrollShadow

| 接口                                                                                                                                                       | 说明         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `children`、`edges`（top / bottom / left / right 或数组，默认 bottom）、`onScroll`、透传（`classNames.edge` 覆盖内置 h-16/w-16、边缘带 data-position）     | 滚动渐变阴影 |
| 零件：ScrollShadowRoot / Viewport / Edge                                                                                                                   | 拼装         |
| 现有 demo：`scroll-shadow-basic`（默认 bottom 渐变，20 条滚动）｜`scroll-shadow-position`（edges top/bottom + classNames.edge h-8/h-32 四格，size 已并入） |
| 缺失：无 ｜ 冗余：size 与 basic/position 差别仅是渐变高度参数（原则①）——建议并入 position 或删除（见行动建议 #2）                                          |

#### Segment

| 接口                                                                                                                                                                     | 说明                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| `SegmentGroup`：`options`、`value` / `defaultValue` + `onValueChange`、`variant`（fill 默认 / text）、`itemClassName`、`disabled`                                        | 分段单选（roving tabindex 键盘） |
| 零件：Segment（受控 checked，radio 语义）                                                                                                                                | 拼装                             |
| 现有 demo：`segment-basic`（受控 value/onValueChange 回显）｜`segment-variants`（仅 text 变体——既定修复后只留非默认）｜`segment-custom`（Segment 零件 + 滑动高亮块拼装） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                     |

#### Select

| 接口                                                                                                                                                                                            | 说明                                      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| `options`（SelectOption / SelectOptionGroup）、`value` / `defaultValue` + `onValueChange`、`placeholder`、`required`、`name`（隐藏 input 进表单）、`disabled`、透传                             | 主题化下拉（原生 popover + listbox 键盘） |
| 现有 demo：`select-basic`（options+placeholder 非受控）｜`select-grouped`（分组）｜`select-invalid`（未选时 danger Callout role=alert，既定保留）｜`select-custom`（DOM 面板随主题 + 受控说明） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                            |

#### SelectableTable

| 接口                                                                                                                                            | 说明                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| `data` / `columns` / `rowKey`（必填）、`selected` / `defaultSelected` + `onSelectionChange`、`loading`、`empty`、继承 Table 全部 props          | 内置全选/半选复选列，跨页保留选择 |
| 现有 demo：`selectable-table-basic`（受控选择计数回显）｜`selectable-table-pagination`（模拟分页 loading + Pagination 组合 + loading 空态文案） |
| 缺失：无 ｜ 冗余：无                                                                                                                            |

#### Separator

| 接口                                                                                     | 说明   |
| ---------------------------------------------------------------------------------------- | ------ |
| `children`（传则线-字-线）、`orientation`、`className` / `classNames.line` / `text` 透传 | 分隔线 |
| 零件：SeparatorLine（垂直自拉伸）/ SeparatorText                                         | 拼装   |
| 现有 demo：`separator-basic`（水平线 + 垂直线在 flex 导航中自拉伸）                      |
| 缺失：无（线-字-线形态在文档即说明，不补） ｜ 冗余：无                                   |

#### Sidebar

| 接口                                                                        | 说明                       |
| --------------------------------------------------------------------------- | -------------------------- |
| `ref`（SidebarHandle：toggle / open / close / isOpen）、`defaultOpen`、透传 | 折叠侧栏（ref 命令式控制） |
| 现有 demo：`sidebar-basic`（按钮驱动 ref 控制开合 + defaultOpen）           |
| 缺失：无 ｜ 冗余：无                                                        |

#### Skeleton

| 接口                                                                                           | 说明       |
| ---------------------------------------------------------------------------------------------- | ---------- |
| `className` 塑形（默认 size-full）、原生 props 透传                                            | 脉冲占位块 |
| 现有 demo：`skeleton-text`（多行不同宽度文本占位）｜`skeleton-avatar`（圆头像 + 两行组合占位） |
| 缺失：无（两 demo 即 basic + 组合用法） ｜ 冗余：无                                            |

#### Slider

| 接口                                                                                                                                    | 说明                      |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `value` / `defaultValue` + `onChange`、`min` / `max` / `step`、`orientation`（vertical 为 JS 全算，min 在底）、`disabled`、`name`、透传 | 模拟滑杆（WAI-ARIA 键盘） |
| 零件：SliderRoot / Track / Fill / Thumb（纯显示、无状态）                                                                               | 拼装                      |
| 现有 demo：`slider-basic`（defaultValue 50 + disabled）｜`slider-orientation`（水平 + 垂直对比）                                        |
| 缺失：无 ｜ 冗余：无                                                                                                                    |

#### Sparkline

| 接口                                                                                                     | 说明       |
| -------------------------------------------------------------------------------------------------------- | ---------- |
| `data`（number[]）、`variant`（line / area / bar）、`smooth`、`className`（currentColor 上色）、svg 透传 | 迷你走势图 |
| 现有 demo：`sparkline-basic`（三形态 × smooth × 多色六宫格）                                             |
| 缺失：无 ｜ 冗余：无                                                                                     |

#### Steps

| 接口                                                                                                                                        | 说明           |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `items`、`index` + `onChange`、`maxIndex`（超出禁用——前跳锁）、`orientation`、透传                                                          | 受控步骤指示器 |
| 零件：StepsRoot / StepsItem（marker 为真实 button，clickable + onSelect）                                                                   | 拼装           |
| 现有 demo：`steps-basic`（受控 index/maxIndex + clickable 锁定导航 + Back/Next）｜`steps-vertical`（orientation="vertical" + 联动内容面板） |
| 缺失：`clickable` / `maxIndex` 未体现——可选并入 basic（Wizard 已隐含展示锁定导航），见行动建议 #3 ｜ 冗余：无                               |

#### Switch

| 接口                                                                                                                            | 说明 |
| ------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `children`、`checked` / `defaultChecked` + `onCheckedChange`、`disabled`、input props 透传                                      | 开关 |
| 零件：SwitchRoot / SwitchTrack / SwitchThumb / SwitchLabel                                                                      | 拼装 |
| 现有 demo：`switch-basic`（defaultChecked、普通、disabled on/off 四例）｜`switch-custom`（Label/Track/Thumb/Root 拼装大号开关） |
| 缺失：无 ｜ 冗余：无                                                                                                            |

#### Table

| 接口                                                                                                                                                                                        | 说明                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `data` / `columns`（必填）、`getKey`、`sort` + `onSortChange`（传 sort 即远程模式）、`initialSortDirection`、`empty`                                                                        | 表格；列：key / header / render / sortable / compare / align / width / className |
| 透传：`classNames.body` 覆盖内置 h-96；零件 TableRoot / Head / Body / Base（colgroup 须一致）                                                                                               | 双表结构                                                                         |
| 现有 demo：`table-basic`（sortable / width / render 自定义单元格优先级着色）｜`table-remote`（useRemoteSort 接线委托后端排序）｜`table-scroll`（classNames.body h-48 覆盖内置 h-96 长列表） |
| 缺失：`align` 未体现——控制列居中属设计约定（AGENTS 已述），不补 ｜ 冗余：无                                                                                                                 |

#### Tabs

| 接口                                                                                                                                                                                                                          | 说明   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `options`（value / label / content / disabled）、`value` / `defaultValue` + `onValueChange`、`orientation`、`variant`（line 默认 / button）、透传                                                                             | 选项卡 |
| 零件：TabsList（autoScroll）/ TabsTrigger / TabsContent                                                                                                                                                                       | 拼装   |
| 现有 demo：`tabs-basic`（defaultValue 非受控三页，默认 line 变体）｜`tabs-variant`（button 变体——line 行已删，既定修复）｜`tabs-orientation`（horizontal / vertical 对比）｜`tabs-lazy`（React.lazy + Suspense 按需加载面板） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                                                          |

#### Textarea（text-area.mdx）

| 接口                                                                                   | 说明     |
| -------------------------------------------------------------------------------------- | -------- |
| `value`（收窄为 string）、`invalid`、`onChange`（可返回 { invalid } 进表单集成）、透传 | 多行输入 |
| 现有 demo：`text-area-basic`（普通 / invalid / disabled 三例）                         |
| 缺失：无 ｜ 冗余：无                                                                   |

#### Timeline

| 接口                                                                                                                      | 说明                 |
| ------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| `items`（marker / time / heading / description）、`classNames`（marker / connector / time / heading / description）、透传 | 垂直时间线（纯展示） |
| 零件：TimelineRoot / TimelineItem（connector 可关）                                                                       | 拼装                 |
| 现有 demo：`timeline-basic`（四节点：time/heading/description）                                                           |
| 缺失：自定义 `marker`（图标）与 `connector` 开关未体现——轻量渲染 prop，不建议补 ｜ 冗余：无                               |

#### Toast

| 接口                                                                                                                                                                                              | 说明           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `<Toaster />` 挂载一次（visibleToasts）+ 命令式 success / error / warning / info / loading / dismiss / promise；ToastItemProps：title / description / icon / duration / closable / onClose / 透传 | 全局通知 store |
| 零件：ToastRoot / Icon / Content / Title / Description / Close                                                                                                                                    | 自定义卡片     |
| 现有 demo：`toast-basic`（六种命令式按钮含 closable）｜`toast-promise`（Toaster.promise 模拟部署 loading→success 自动替换）                                                                       |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                              |

#### Toggle

| 接口                                                                                                                                                                                                                    | 说明     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `children`、`checked` / `defaultChecked` + `onCheckedChange`、`value`、`variant`（fill 默认 / text）、`disabled`、透传                                                                                                  | 切换按钮 |
| `Toggle.Group`：`options`（多选）、`value` / `defaultValue` + `onChange`、`itemClassName`                                                                                                                               | 多选组   |
| 现有 demo：`toggle-basic`（图标+文字、defaultChecked、disabled）｜`toggle-variants`（text 变体——既定修复后只留非默认）｜`toggle-group`（options 多选 + disabled 项）｜`toggle-custom`（受控多选自管理 + 胶囊/虚线样式） |
| 缺失：无 ｜ 冗余：无                                                                                                                                                                                                    |

#### Tooltip

| 接口                                                                                                                   | 说明                                         |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `children`（Trigger+Content 对）、`delay`（隐藏延迟，默认 100）                                                        | 组合接线容器（context 下发 id/anchor/delay） |
| 零件：TooltipTrigger / TooltipContent（standalone 需显式 popoverId / anchorName；ref 可 showPopover/hidePopover）      | 拼装                                         |
| 现有 demo：`tooltip-basic`（组合用法两例，不同 delay）｜`tooltip-imperative`（零件独立 + ref 命令式 show/hidePopover） |
| 缺失：无 ｜ 冗余：无                                                                                                   |

#### Transfer

| 接口                                                                                                                                                                  | 说明       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `dataSource`（必填：label / value / disabled）、`value` / `defaultValue` + `onChange`、`titles`、`renderItem`、`classNames`（panel / header / body / item / actions） | 双面板穿梭 |
| 现有 demo：`transfer-basic`（受控移动 + titles + disabled 项）                                                                                                        |
| 缺失：`renderItem` 自定义行未体现——DualPicker.basic 已示范同类 render-props 写法，不补 ｜ 冗余：无                                                                    |

#### Typography

| 接口                                                                                                         | 说明     |
| ------------------------------------------------------------------------------------------------------------ | -------- |
| `variant`（h1-h6 / headline / description / heading-code / description-code，决定渲染标签）、透传            | 排版层级 |
| 现有 demo：`typography-headings`（h1-h6 层级）｜`typography-text`（headline / description / 行内 code 混排） |
| 缺失：无 ｜ 冗余：无                                                                                         |

#### Upload

| 接口                                                                                                                                                                                               | 说明             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `accept`、`multiple`、`maxCount`、`maxSize`、`disabled`、`children`（自定义拖放区内容）                                                                                                            | 本地校验拖放上传 |
| `onFilesAccepted` / `onFilesRejected`（accept/maxSize/maxCount 原因）/ `onFileRemove`、`actionsRef`（remove 中止 controller / clear）、`onDragEnter` / `onDragLeave`、透传                         | 生命周期接线     |
| 零件：UploadRoot / UploadDropzone / UploadHiddenInput                                                                                                                                              | 拼装             |
| 现有 demo：`upload-basic`（multiple+accept+maxCount+maxSize+拒绝回显 + MockXHR + useUploadMonitor 进度 + actionsRef 移除，Restrictions 已并入）｜`upload-custom`（Root/HiddenInput/Dropzone 拼装） |
| 缺失：无 ｜ 冗余：multiple 与 basic 高度重叠（仅 accept 为差异点）——建议并入 basic 后删除（见行动建议 #1）                                                                                         |

#### Watermark

| 接口                                                                                                                      | 说明                                           |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `text`、`fontSize` / `color` / `fontFamily` / `rotate` / `gap` / `padding` / `opacity`、透传                              | Canvas 平铺水印（随主题/DPR/容器 resize 重绘） |
| 零件：WatermarkRoot / WatermarkCanvas                                                                                     | 拼装                                           |
| 现有 demo：`watermark-basic`（text 平铺覆盖 Card）｜`watermark-custom`（Root/Canvas 拼装 + 全 canvas 选项 + rotate 滑杆） |
| 缺失：无 ｜ 冗余：无                                                                                                      |

#### Wizard

| 接口                                                                                                                                                 | 说明                    |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| `Wizard`：`steps`、`children`（每步一页）、`onFinish`、`classNames`（root / steps / pager / footer）、透传                                           | Steps+Pager+footer 组合 |
| `InlineWizard`：`steps`（title / description / content）、`onFinish`、`nextLabel` / `backLabel` / `finishLabel`、`maxIndex`、`disabled`              | 垂直手风琴变体          |
| `useWizardNavigation({ count, index, maxIndex, ... })` 状态机                                                                                        | 自定义壳                |
| 现有 demo：`wizard-basic`（三步表单 + Steps/Pager/footer + onFinish）｜`wizard-inline`（InlineWizard 三步 + 跨步共享 username 状态 + finished 回显） |
| 缺失：无 ｜ 冗余：无                                                                                                                                 |

## 工具函数 hooks（app/demos 下）

5 个 hooks demo 均为最小接线示例，覆盖准确，无需增删：

| Demo                          | 内容                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| `use-drag-basic`              | useDrag 接线 pointer 拖拽：offset 驱动位移、isDragging 加描边           |
| `use-pagination-basic`        | usePagination({ base: 0 }) 客户端分页 + select 页容量 + 首/上/下/末按钮 |
| `use-remote-pagination-basic` | useRemotePagination fetcher 远程分页 + 搜索 + 滚动加载                  |
| `use-theme-basic`             | useTheme 的 setTheme / setSurface / setBrand 色板切换                   |
| `virtual-scroll-basic`        | useVirtualScroll 500 行虚拟滚动 + scrollToIndex / Top / Bottom          |
