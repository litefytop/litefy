# UI 库源文件清单（app/ui/components + app/ui/utils）

> 生成于 2026-09-30，基于逐文件阅读源码。用途：逐文件了解内部构成，辅助审查冗余/可删减项，审查完可删除本文件。
>
> 背景事实：本项目按 shadcn 式注册表分发（`packages/cli`），`components/index.ts` 对全部 74 个组件文件、`utils/index.ts` 对全部 17 个工具文件执行 `export *` 全量导出，且每个文件在 `content/docs/` 都有对应文档页。因此「组件库内部没用到」≠「可删」——分发场景下每个文件都是独立的潜在安装单元。

---

## components/（74 个组件文件 + index.ts）

### avatar.tsx
- 导出：`Avatar`（成品）、`AvatarRoot`（根容器 div）、`AvatarImage`（图片容器 img）
- 结构：AvatarRoot 内按状态渲染 AvatarImage 或 fallback 文本，外层含骨架占位
- 行为：三态切换——加载中显示 skeleton 骨架 → 图片成功 → 失败/无 src 显示 fallback
- 依赖：`utils/cn`、`utils/use-image-status`

### badge.tsx
- 导出：`Badge`
- 结构：外层 div 内嵌绝对定位的 label span（角标）
- 行为：无内部状态；children 放图标，`label` 传文本时渲染右上角独立覆盖层
- 依赖：`utils/cn`

### banner.tsx
- 导出：`Banner`、`BannerViewport`、`BannerTrack`、`BannerItem`
- 结构：viewport 包裹 track，track 内重复渲染两份 item 集合（跑马灯）
- 行为：CSS 动画滚动、pauseOnHover 暂停、ResizeObserver 测量；speed/duration/direction 可配
- 依赖：`utils/cn`

### breadcrumb.tsx
- 导出：`Breadcrumb` 及 Root/List/Item/Link/Page/Separator parts
- 结构：nav > ol > li，渲染链接或当前页文本 + 分隔符
- 行为：无状态纯展示；`items` 数据驱动
- 依赖：`utils/cn`

### button.tsx
- 导出：`Button`；静态属性 `Button.className.primary/danger/outline/text`（预拼接完整类名）
- 结构：button 元素，loading 时渲染 spinner icon + children
- 行为：disabled / loading（aria-busy）；icon-only 子元素自动方形 padding
- 依赖：`utils/cn`

### calendar.tsx
- 导出：`Calendar` 及 Root/Header/Grid/MonthGrid/YearGrid 等 parts
- 结构：root > header（导航）> grid/row/cell（日期/月份/年份三种网格）
- 行为：date/defaultValue 受控非受控、defaultView 视图切换、单 roving tab stop + 方向键移动光标（焦点不跟值）、isDateDisabled/isMonthDisabled/isYearDisabled、onNavigate
- 依赖：`utils/cn`、`utils/date-math`（基于原生 Date 的日历日期运算）

### callout.tsx
- 导出：`Callout`
- 结构：div role="note"，按 variant 设置语义色调背景 + 文字色
- 行为：无状态静态反馈容器；info/success/warning/danger
- 依赖：`utils/cn`

### capsule.tsx
- 导出：`Capsule`；静态 `Capsule.className`
- 结构：overflow-hidden 的 pill 形 div 包裹 children
- 行为：纯样式组合，无状态
- 依赖：`utils/cn`

### card.tsx
- 导出：`Card`
- 结构：div，玻璃拟态样式（背景/边框/固定 shadow-base/模糊）
- 行为：静态表面，无 hover 效果、无状态
- 依赖：`utils/cn`

### card-button.tsx
- 导出：`CardButton`
- 结构：button，复用 Card 风格 base 类 + Button 同款 variant
- 行为：静态 shadow-base、hover 提升至 shadow-elevated；无状态
- 依赖：`utils/cn`

### cascader.tsx
- 导出：`Cascader`、`CascaderTrigger`
- 结构：trigger（面包屑式路径）+ PopoverContent + List 面板
- 行为：tree 数据驱动、级联展开、路径/选择状态、openLevel 受控非受控、CSS anchor positioning 面板
- 依赖：`PopoverContent`、`List`、`utils/cn`

### chart-legend.tsx
- 导出：`ChartLegend`
- 结构：div 内渲染 legend button（色块 swatch + label）
- 行为：hover、toggle、hidden 集合控制；被 chart/donut/radar 共用
- 依赖：`utils/cn`

### chart.tsx
- 导出：`Chart`
- 结构：wrap > container > canvas + tooltip 层
- 行为：canvas 时间序列图；数据窗口、LTTB 降采样、系列隐藏、hover 十字准线 tooltip、框选缩放 + 双击重置、响应式宽度、自动主题配色
- 依赖：`utils/cn`、`utils/chart-kit`、`utils/chart-paint`、`utils/use-chart-palette`

### chat-input.tsx
- 导出：`ChatInput`
- 结构：div > 粘贴图片缩略图区 + Textarea + actions/send 按钮 + 隐藏 file input
- 行为：value/defaultValue 受控非受控、autoPaste 截图粘贴、enterToSend、onSend
- 依赖：`Textarea`、`utils/cn`

### checkbox.tsx
- 导出：`Checkbox`、`CheckboxRoot`、`CheckboxIndicator`、`CheckboxLabel`、`CheckboxGroup`
- 结构：label > indicator > input（隐藏原生控件）
- 行为：checked/defaultChecked + onCheckedChange、CheckboxGroup 按 options 收集值、FormContext 注册
- 依赖：`utils/cn`、Form context

### chip.tsx
- 导出：`Chip`
- 结构：inline 状态标签 span
- 行为：零交互；variant（primary/outline/success/warning/danger/info）承载全部状态色语义
- 依赖：`utils/cn`

### chip-group.tsx
- 导出：`ChipGroup`
- 结构：chips 容器 + 自动折叠溢出项
- 行为：测量溢出、renderMore（如 "+3"）、onOverflowChange
- 依赖：`Chip`、`utils/cn`

### collapse.tsx
- 导出：`Collapse`、`CollapseRoot`、`CollapseTrigger`、`CollapsePanel`、`Accordion`
- 结构：trigger + panel，data-open + grid-template-rows 展开动画
- 行为：open/defaultOpen 受控非受控、Accordion 支持 multiple/single 与 activeKeys/onKeyChange、ARIA 关联
- 依赖：`utils/cn`

### combobox.tsx
- 导出：`Combobox`
- 结构：Picker（input + popover）+ List 列表面板
- 行为：options 本地过滤 / fetcher 远程搜索（debounce + 无限滚动）、键盘高亮、value/defaultValue + onValueChange、invalid、empty
- 依赖：`Picker`、`List`、`utils/cn`、`utils/use-combobox`、`utils/use-remote-pagination`

### command.tsx
- 导出：`Command`、`CommandRoot`、`CommandInput`、`CommandList`
- 结构：Dialog 内 root > 顶部搜索 input + 下方过滤列表
- 行为：filter（value/label/keywords/自定义）、↑↓ + Enter 键盘导航、首项预高亮、选中关闭、open/onOpenChange、renderItem
- 依赖：`Dialog`、`utils/cn`、`utils/use-combobox`

### context-menu.tsx
- 导出：`ContextMenu`（静态 open/dismiss）、`ContextMenuHost`
- 结构：Host 挂载一次；open({x,y}) 渲染固定定位 anchor + PopoverContent + Menu
- 行为：外部 store 管开关、右键坐标定位、外部 mousedown / Escape 关闭
- 依赖：`PopoverContent`、`Menu`、`utils/cn`

### date-picker.tsx
- 导出：`DatePicker`
- 结构：Picker 包裹 Calendar（可编辑 input + 月份面板 popover）
- 行为：value/defaultValue（原生 Date）、输入解析、isDateDisabled、firstDayOfWeek、invalid、面板键盘焦点
- 依赖：`Picker`、`Calendar`、`utils/cn`、`utils/date-math`、`utils/use-panel-focus`

### dialog.tsx
- 导出：`Dialog`、`DialogRoot`、`DialogContent`、`DialogClose`；命令式 `dialog.success/error/warning/info`
- 结构：原生 `<dialog>` + 遮罩 + 标题行（title 左、内置 ESC 关闭按钮右）+ children
- 行为：showModal + trapTabKey 焦点圈定、open/onOpenChange、onBackdropClick；命令式 API 每次调用独立渲染
- 依赖：`utils/cn`、`utils/trap-tab-key`

### donut.tsx
- 导出：`Donut`
- 结构：SVG 扇区 path + ChartLegend
- 行为：hover、扇区隐藏（与 legend 联动）、useChartPalette 配色、arcPath/donutLayout 几何
- 依赖：`utils/cn`、`utils/use-chart-palette`、`utils/chart-kit`、`ChartLegend`

### drawer.tsx
- 导出：`Drawer`、`DrawerRoot`、`DrawerWrapper`、`DrawerDrag`、`DrawerContent`
- 结构：`<dialog>` + wrapper 滑入面板，placement 决定方向（必填）
- 行为：transform 滑入动画、触摸拖拽（DrawerDrag part）、trapTabKey 焦点圈定、onBackdropClick、ESC 关闭
- 依赖：`utils/cn`、`utils/trap-tab-key`

### dropdown-menu.tsx
- 导出：`DropdownMenu`
- 结构：Popover（trigger 默认 `Button.className.primary`）+ Menu 面板
- 行为：items 同 Menu 结构、onSelect 选中后关闭、alignX、classNames（content/item/label/sub）
- 依赖：`Popover`、`Menu`、`Button`、`utils/cn`

### dual-picker.tsx
- 导出：`DualPicker`
- 结构：source 面板 ↔ target 面板（穿梭框）
- 行为：source/target 选择状态、搜索过滤、mode 单/多选、renderOption/renderSelected/getLabel 渲染 props、sourceTitle/targetTitle
- 依赖：`InputGroup`（InputRoot/InputLeading）、`utils/cn`

### field-search.tsx
- 导出：`FieldSearch`
- 结构：InputGroup 壳：字段 Select + 值输入（文本 Input 或枚举 Select）
- 行为：fields 驱动、文本字段 debounce（默认 300ms）、枚举字段选中即发、onSearch(field, value) 去空格、清空/切换字段发空值、IME composition 期间保持
- 依赖：`Select`、`InputGroup`、`Input`、`utils/cn`

### form.tsx
- 导出：`Form`、`useFieldValidity`
- 结构：form 元素 + 字段注册上下文
- 行为：字段注册、提交 action、校验收集、提交后自动重置、ref 命令式控制
- 依赖：`utils/cn`、Form context

### form-item.tsx
- 导出：`FormItem`
- 结构：label + 按 variant 渲染的控件 + 单行 hint（description 或错误 Callout）
- 行为：variant 映射 input/textarea/select/password/number-input、validate（默认 onBlur，invalid 后转 onChange）、invalid 时 description 替换为 danger Callout、hidden input 支持原生提交、controlProps 转发（onChange/onBlur 被包装）
- 依赖：`Input`、`Textarea`、`Select`、`Password`、`NumberInput`、`Callout`、Form context、`utils/cn`

### image.tsx
- 导出：`Image`、`ImageRoot`、`ImageImage`
- 结构：root 容器内按状态渲染 img / loading 占位 / error fallback
- 行为：加载占位 loadingNode、失败 fallback、useImageStatus 三态
- 依赖：`utils/cn`、`utils/use-image-status`

### index.ts（barrel）
- 全部 74 个组件文件 `export * from` 全量导出，无遗漏

### input.tsx
- 导出：`Input`
- 结构：基于 InputGroup 壳（leading/trailing 插槽 + input）
- 行为：value/defaultValue、invalid、type 限定 text/email/url/tel/search
- 依赖：`InputGroup`、`utils/cn`

### input-group.tsx
- 导出：`InputGroup`、`InputRoot`、`InputLeading`、`InputTrailing`
- 结构：聚焦壳容器：leading 插槽 + 控件位 + trailing 插槽
- 行为：统一 focus ring / invalid 边框；子选择器剥离直接子控件自身 focus 样式（防双 ring）
- 依赖：`utils/cn`

### input-otp.tsx
- 导出：`InputOtp`、`InputOtpSlot`、`InputOtpGroup`
- 结构：多个 slot input + hidden name input
- 行为：自动前进、粘贴分发、退格回退、mask 模式、length 配置
- 依赖：`utils/cn`

### kbd.tsx
- 导出：`Kbd`
- 结构：原生 `<kbd>` 元素样式封装
- 行为：无状态静态视觉
- 依赖：`utils/cn`

### list.tsx
- 导出：`List`、`Order`、`useListController`
- 结构：ordered 决定 `<ol>`/`<ul>`；滚动视口（隐藏滚动条）+ 分组头 + 空状态
- 行为：键盘导航（ArrowUp/Down 高亮 wrap-around、Enter/Space onSelect）、highlightIndex 受控/非受控双模式、onScrollBottom 无限滚动、getGroup/renderGroupHeader 分组
- 依赖：`utils/cn`

### masonry.tsx
- 导出：`Masonry`、`Masonry.Column`、`Masonry.Item`
- 结构：测量分支（响应式列数 + 按实测高度分列）与静态 CSS columns 分支（嵌套时自动降级）
- 行为：items/renderItem/getKey、columns 数字或响应式配置、ResizeObserver 高度均衡
- 依赖：`utils/cn`

### menu.tsx
- 导出：`Menu`、`MenuRoot`、`MenuItem`、`MenuLabel`、`MenuSubContent`
- 结构：ul > li（root/item）+ 分组头 label + 二级子菜单 sub content
- 行为：roving focus（ArrowUp/Down）、子菜单 hover 150ms 延迟展开、autoFocus 脉冲聚焦、onSelect/onEscape、键盘导航
- 依赖：`utils/cn`

### multi-select.tsx
- 导出：`MultiSelect`
- 结构：Popover（trigger 合并 `Button.className.primary`）+ CheckboxGroup 面板
- 行为：options 驱动多选、value/defaultValue + onChange、trigger/placeholder、classNames.content 面板样式
- 依赖：`Popover`、`CheckboxGroup`、`Button`、`utils/cn`

### number-field.tsx
- 导出：`NumberField`、`NumberStepper`、`NumberRoot`；内部核心 `useNumberCore`
- 结构：div > stepper（leading − / trailing + 按钮）+ NumberRoot
- 行为：受控/非受控、千分位、min/max 步进按钮边界自动禁用、键盘上下步进、blur 归一化、variant="embedded" 去边框
- 依赖：`utils/cn`

### number-input.tsx
- 导出：`NumberInput`、`NumberRoot`
- 结构：InputGroup 壳（stepping 仅键盘，trailing 为非交互提示）
- 行为：与 NumberField 共用 useNumberCore；min/max/step、invalid
- 依赖：`InputGroup`、`number-field`（useNumberCore）、`utils/cn`

### pager.tsx
- 导出：`Pager`
- 结构：单 DOM 翻页容器，一次只挂载当前页（相邻页仅拖拽期间挂载，200ms settle 后卸载）
- 行为：index/onChange 全受控、触摸拖拽（25% 阈值 + rubber-band）、loop 循环取模、startViewTransition 程序化跳转、gesture 可关
- 依赖：`utils/cn`

### pagination.tsx
- 导出：`Pagination` 及 Root/First/Prev/Pages/Next/Last/Ellipsis/Summary parts
- 结构：首/上/页码（省略号折叠）/下/末按钮行 + 可选左侧 summary
- 行为：纯视图——page/totalPages/onPageChange 必填，状态归 usePagination；siblingCount、disabled 冻结、summary 换行规则
- 依赖：`utils/cn`

### paper.tsx
- 导出：`Paper`
- 结构：div 按 variant（a4/a5/a4-landscape/a5-landscape）应用打印页面尺寸
- 行为：无状态
- 依赖：`utils/cn`

### password.tsx
- 导出：`Password`、`PasswordRoot`、`PasswordToggle`、`PasswordGroup`
- 结构：InputGroup 壳内 input + 可见性切换按钮
- 行为：visible/defaultVisible 受控非受控、onVisibleChange、invalid
- 依赖：`InputGroup`、`utils/cn`

### picker.tsx
- 导出：`Picker`、`PickerRoot`、`PickerInput`、`PickerContent`
- 结构：input + popover 面板（原生 popover API + CSS anchor positioning）
- 行为：value/open 受控非受控、ArrowDown 开面板 / Escape 关、消费方 onKeyDown/onClick 组合（preventDefault 时跳过内部行为）、面板焦点管理
- 依赖：`utils/cn`

### popover.tsx
- 导出：`Popover`、`PopoverContent`、`usePopoverTrigger`
- 结构：trigger（默认 primary Button 样式）+ popover 面板
- 行为：open/defaultOpen/onOpenChange、alignX、mode、hover/click 交互、Escape 关闭、焦点恢复、原生 popover API + CSS anchor positioning
- 依赖：`Button`、`utils/cn`

### preview-card.tsx
- 导出：`PreviewCard`
- 结构：Card + Image + Tooltip 组合；有 trigger 时渲染 `<a>` hover 锚点、卡片进 tooltip，无 trigger 则内联卡片
- 行为：useId 生成 popoverId/anchorName、useTooltipWiring hover/focus 触发、delay
- 依赖：`Card`、`Image`、`Tooltip`（useTooltipWiring）、`utils/cn`

### progress.tsx
- 导出：`Progress`
- 结构：进度条 div（填充宽度 = current%）
- 行为：current clamp [0,100]、abort/complete 切换颜色与过渡时长、useRef 记录中断宽度；纯 UI 不做调度
- 依赖：`utils/cn`

### radar.tsx
- 导出：`Radar`
- 结构：SVG 网格（环/辐条/轴标签）+ 系列 polygon + ChartLegend
- 行为：hover、系列隐藏、useChartPalette 配色；polar/radarPolygon/radarRings/radarSpokes 几何
- 依赖：`utils/cn`、`utils/use-chart-palette`、`utils/chart-kit`、`ChartLegend`

### radio.tsx
- 导出：`Radio`、`RadioRoot`、`RadioIndicator`、`RadioLabel`、`RadioGroup`
- 结构：RadioLabel > RadioIndicator > RadioRoot（镜像 Checkbox）；RadioGroup 渲染 role="radiogroup" + options
- 行为：checked 受控非受控、组级 value/defaultValue + onValueChange、name 启用原生方向键、FormContext 注册、无 context 依赖
- 依赖：`utils/cn`、Form context

### scroll-shadow.tsx
- 导出：`ScrollShadow`、`ScrollShadowRoot`、`ScrollShadowViewport`、`ScrollShadowEdge`
- 结构：滚动视口 + 四边渐变遮罩 edge（内置 Chevron 箭头、data-position 标记）
- 行为：scroll + ResizeObserver 按需显隐边、edges 配置、overscroll-behavior contain、onScroll 透传、arrow 开关、classNames.edge 尺寸覆盖
- 依赖：`utils/cn`

### segment.tsx
- 导出：`Segment`、`SegmentGroup`
- 结构：role="radiogroup"/radio 分段容器
- 行为：value/defaultValue 受控非受控、onValueChange、键盘导航、aria-checked 纯色过渡（默认无滑动指示器）
- 依赖：`utils/cn`

### select.tsx
- 导出：`Select`
- 结构：触发按钮 + listbox 面板（原生 popover API）
- 行为：options（含分组）、value/defaultValue + onValueChange、选项高亮键盘交互、required、面板生命周期
- 依赖：`utils/cn`、`utils/use-floating-panel`

### selectable-table.tsx
- 导出：`SelectableTable`
- 结构：Table + 内置 `__selection` 勾选列（表头全选含半态）
- 行为：rowKey 即选择单元、selected/onSelectionChange（跨页保留）、全选仅作用于当前页
- 依赖：`Table`、`Checkbox`、`utils/cn`

### separator.tsx
- 导出：`Separator`、`SeparatorLine`、`SeparatorText`
- 结构：单线；有 children 时线-文本-线
- 行为：无状态；水平默认 my-3、垂直在 flex 行内自拉伸
- 依赖：`utils/cn`

### sidebar.tsx
- 导出：`Sidebar`（ref 类型 SidebarHandle）
- 结构：aside > div 包裹 children
- 行为：useState 展开收起、useImperativeHandle 暴露 toggle/open/close/isOpen
- 依赖：`utils/cn`

### skeleton.tsx
- 导出：`Skeleton`
- 结构：单个 div
- 行为：animate-pulse 脉冲占位，无逻辑
- 依赖：`utils/cn`

### slider.tsx
- 导出：`Slider`、`SliderRoot`、`SliderTrack`、`SliderFill`、`SliderThumb`
- 结构：根容器 > 轨道 > 填充 > 滑块（模拟滑块，无原生 range）
- 行为：指针拖拽 + 键盘、min/max/step、水平/垂直 orientation、role="slider" 无障碍、name 支持表单
- 依赖：`utils/cn`

### sparkline.tsx
- 导出：`Sparkline`
- 结构：轻量 SVG 图（line/area/bar 三变体）
- 行为：无状态静态迷你图
- 依赖：`utils/cn`、`utils/chart-kit`

### steps.tsx
- 导出：`Steps`、`StepsItem`
- 结构：步骤指示器（水平/垂直）
- 行为：completed/current/upcoming 三态、index/maxIndex 前跳锁（visited 可点、future 禁用）、clickable、onChange
- 依赖：`utils/cn`

### switch.tsx
- 导出：`Switch`、`SwitchRoot`、`SwitchTrack`、`SwitchThumb`、`SwitchLabel`
- 结构：隐藏 checkbox + track + thumb
- 行为：checked/defaultChecked、onCheckedChange、disabled
- 依赖：`utils/cn`

### table.tsx
- 导出：`Table`、`TableRoot`、`TableHead`、`TableBody`、`TableBase`
- 结构：双表结构（header 固定条 + body 滚动容器内置 h-96）+ colgroup 列宽
- 行为：columns 配置（render/sortable/compare/align/width）、本地排序或远程 onSortChange、getKey、empty、classNames.body、table-fixed 宽度内容无关
- 依赖：`utils/cn`

### tabs.tsx
- 导出：`Tabs`、`TabsList`、`TabsTrigger`、`TabsContent`
- 结构：tablist > trigger + panel
- 行为：options 驱动、value/defaultValue + onValueChange、水平/垂直 orientation、自动滚动到激活项、键盘切换、unmountOnHide
- 依赖：`utils/cn`

### text-area.tsx
- 导出：`Textarea`
- 结构：单个 textarea
- 行为：invalid + aria-invalid，无额外逻辑
- 依赖：`utils/cn`

### timeline.tsx
- 导出：`Timeline`、`TimelineRoot`、`TimelineItem`
- 结构：ol > li（marker + connector + time + heading + description）
- 行为：纯展示
- 依赖：`utils/cn`

### toast.tsx
- 导出：`Toaster`、`Toast` 及 parts（ToastRoot/ToastIcon/ToastContent/ToastTitle/ToastDescription/ToastClose）；Toaster 静态方法 success/error/warning/info/loading/promise/dismiss
- 结构：全局 store + 视口 + 单条 toast（icon/content/关闭按钮）
- 行为：store 驱动命令式 API、自动/手动关闭、promise 自动替换 loading toast、展开折叠
- 依赖：`utils/cn`

### toggle.tsx
- 导出：`Toggle`、`ToggleGroup`
- 结构：button；ToggleGroup 多选容器
- 行为：pressed 态、options + value/onValueChange（多选 string[]）
- 依赖：`utils/cn`

### tooltip.tsx
- 导出：`Tooltip`、`TooltipTrigger`、`TooltipContent`、`useTooltipWiring`
- 结构：克隆 trigger 注入 popover id / anchor name；TooltipContent 经 popover API + anchor positioning
- 行为：hover/focus 触发、delay、context 传 wiring；parts 可独立使用（显式 popoverId/anchorName）
- 依赖：`PopoverContent`、`utils/cn`

### transfer.tsx
- 导出：`Transfer`
- 结构：source 面板 + 中间移动按钮 + target 面板
- 行为：value/defaultValue 受控非受控、左右移动、多选状态
- 依赖：`Checkbox`、`utils/cn`

### typography.tsx
- 导出：`Typography`
- 结构：variant 映射语义标签（h1/p/code 等）
- 行为：纯排版层级样式
- 依赖：`utils/cn`

### upload.tsx
- 导出：`Upload`、`UploadRoot`、`UploadDropzone`、`UploadItem`、`UploadActions`、`UploadHiddenInput`
- 结构：根容器 + 隐藏 input + dropzone + 文件列表
- 行为：accept/multiple/maxSize/maxCount 本地校验、拖拽、onFilesAccepted/onFilesRejected/onFileRemove、键盘打开、actionsRef；网络进度解耦到 use-upload-monitor
- 依赖：`utils/cn`

### watermark.tsx
- 导出：`Watermark`、`WatermarkRoot`、`WatermarkCanvas`
- 结构：div 容器 + canvas 覆盖层
- 行为：canvas 平铺绘制、主题色读取、ResizeObserver、动画帧刷新
- 依赖：`utils/cn`

### wizard.tsx
- 导出：`Wizard`、`InlineWizard`（Wizard.Inline）、`useWizardNavigation`
- 结构：Steps + Pager + Button 组合；InlineWizard 为垂直手风琴变体（仅当前步展开）
- 行为：index 状态机（maxVisited/maxReachable、visited 可回、future 锁定）、onFinish、nextLabel/backLabel/finishLabel、maxIndex/disabled
- 依赖：`Steps`、`Pager`、`Button`、`utils/cn`

---

## utils/（17 个文件 + index.ts）

| 文件 | 类型 | 一句话职责 | 被组件引用 |
|---|---|---|---|
| cn.ts | 工具 | twMerge 类名合并 + ClassNameValue 类型 | 全库通用 |
| chart-kit.ts | 纯函数/类型 | 图表数学层：polar、arcPath、donutLayout、scaleLinear、linePath、areaPath、niceTicks、雷达几何等 | chart-paint、chart、donut、radar、sparkline |
| chart-paint.ts | 纯函数 | Canvas 绘制层：computePlotRect、坐标轴/网格/柱/折线/十字准星/框选 | chart |
| trap-tab-key.ts | 纯函数 | Tab/Shift+Tab 焦点圈定 | dialog、drawer |
| use-chart-palette.ts | hook | CSS 变量→图表色板（wheel/mono），MutationObserver 响应主题 | chart、donut、radar |
| use-combobox.ts | hook | 键盘导航、高亮索引、选择回调、重置 | combobox、command |
| use-floating-panel.ts | hook | popover="manual" 面板生命周期：开关、外点关闭、焦点记录恢复 | select |
| use-image-status.ts | hook | 图片预加载 loading/success/failure 三态 | avatar、image |
| use-panel-focus.ts | hook | 面板 ArrowDown/Up 焦点迁移 | date-picker |
| use-remote-pagination.ts | hook | 远程分页：搜索、分页、去重、hasMore | combobox |
| use-drag.ts | hook | Pointer 拖拽生命周期（isDragging + handlePointerDown） | 无（仅文档/示例） |
| use-load-more.ts | hook | IntersectionObserver 滚动加载（visibleCount/hasMore/loadMore/sentinelRef） | 无（仅文档/示例） |
| use-pagination.ts | hook | 分页状态：setIndex/goTo/next/previous/toFirst/toEnd + 边界 | 无（Pagination 的配套状态钩子） |
| use-remote-sort.ts | hook | 远程排序：toggleSort/setSort/clearSort + 查询参数 | 无（Table 远程模式配套） |
| use-theme.ts | hook | brand/surface/theme 主题管理：localStorage、系统主题监听、DOM 应用 | 无（仅文档/示例） |
| use-upload-monitor.ts | hook | XMLHttpRequest 上传监控：文件列表、进度、移除清空 | 无（Upload 明确解耦的配套钩子） |
| use-virtual-scroll.ts | hook | 虚拟滚动计算：scrollTop/itemHeight/overscan → 可见窗口 | 无（仅文档/示例） |

index.ts（barrel）：全部 18 个文件 `export *` 全量导出，无遗漏（含 use-theme / use-upload-monitor / use-virtual-scroll）。

**引用审计结论**：
- 组件库内部实际引用的 utils 共 10 个：cn、chart-kit、chart-paint、trap-tab-key、use-chart-palette、use-combobox、use-floating-panel、use-image-status、use-panel-focus、use-remote-pagination。
- 内部零引用的 7 个（use-drag、use-load-more、use-pagination、use-remote-sort、use-theme、use-upload-monitor、use-virtual-scroll）均为面向使用者的公共 API：在 `content/docs/utils/` 各有独立文档页，部分在 demo 中使用。删与否取决于是否保留为分发能力。

---

## 横向观察（疑似重叠 / 值得审查的点）

1. **图表四件套各自独立**：chart（canvas，依赖最重，独占 chart-paint）/ donut（SVG）/ radar（SVG）/ sparkline（chart-kit 轻量 SVG）。四者只共享 chart-kit + use-chart-palette，绘制层互不复用；chart-paint 仅服务 chart 一个组件。
2. **数字输入双胞胎**：number-field 与 number-input 共用 useNumberCore，仅外壳不同（stepper 按钮 vs InputGroup 壳）。属有意设计，但需维护两份外壳。
3. **分页双胞胎**：pager（内容翻页：手势、view-transition、单 DOM）vs pagination（页码导航：纯视图）——职责不同，仅名字相近。
4. **弹层基座一对**：popover（按钮触发）vs picker（input 触发），API 相似（open/defaultOpen/alignX）；tooltip、preview-card、select、combobox、date-picker、multi-select、dropdown-menu、cascader、context-menu、command 全部叠在其上。
5. **组合型源文件（直接 import 其他组件）**：wizard←steps+pager+button、selectable-table←table+checkbox、transfer←checkbox、multi-select←popover+checkbox-group、dropdown-menu←popover+menu、combobox←picker+list、command←dialog、date-picker←picker+calendar、preview-card←card+image+tooltip、dual-picker/field-search/form-item←input-group、donut/radar←chart-legend。注意：此前曾约定 Transfer/MultiSelect/Combobox/DropdownMenu 走 doc-only 无源码分发，但当前源码均存在且直接依赖组件——与分发约定冲突，值得确认是否为最新决策。
6. **单文件多成品**：collapse.tsx（Collapse+Accordion）、toast.tsx（parts+Toaster+命令式方法）、dialog.tsx（parts+命令式 dialog.*）、wizard.tsx（Wizard+InlineWizard+useWizardNavigation）、list.tsx（List+Order+useListController）。
7. **卡片家族**：card（静态）/ card-button（可交互）/ paper（打印页面）——类名同源，职责不同。
8. **badge / chip / capsule / kbd / callout / separator / skeleton / paper / typography** 均为无状态纯样式小组件，体量小，属常规基础件。
