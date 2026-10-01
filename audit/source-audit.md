# Litefy UI 组件源码盘点清单

> 生成日期：2026-09-30。数据源：`app/ui/components/*.tsx` 源码（74 个）、`content/docs/component/*.mdx` 英文 API 表、`app/demos/*` demo 文件名。
> 方法：每个组件给出「逻辑 / 文档偏差 / 缺口 / 冗余可疑」与一条 `[ ] 盘点` 结论，供人工逐项核对。清单由 AI 基于源码生成，可能有误判——盘点时以源码为准，勾选后可在行尾补记录。

## Avatar（avatar.tsx，36 行）

- 逻辑：导出 AvatarRoot（div，size-12 rounded-md 居中裁切）/ AvatarImage（img，loading="lazy" decoding="async"）两 parts + Avatar 组合与类型，无静态属性。
- Avatar 组合经 useImageStatus(src) 得三态：loading→skeleton、failure→fallback、success→渲染 AvatarImage 并 spread 其余 img props（#L29-L35）；className/style 落 root，classNames.image/styles.image 落 img。
- 无内部 state（状态收敛在 hook）、无副作用、无键盘/焦点逻辑；a11y 无附加 aria，语义依赖 alt 透传。
- 文档偏差：无（src/skeleton/fallback/classNames.image 与两 parts 均文档化，demo basic/custom 齐全）。
- 缺口：src 为空/undefined 时的状态表现未文档化（三态兜底不明确）；无圆角形状 prop，改圆形需 className 手写。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议文档补空 src 行为说明。

## Badge（badge.tsx，21 行）

- 逻辑：单导出 Badge + BadgeProps；relative size-12 容器 + 绝对定位 label span 钉右上（translate 出边 50%），有 label 时自动 px-1（#L15-L19），无 parts、无静态属性。
- label 未传时仍渲染空 span（min-h-2/min-w-2 形成空圆点），并非"不传即无 marker"。
- 无状态、无副作用、无键盘；a11y 无 aria（marker 纯视觉，无 aria-label/role）。
- 文档偏差：文档以"pass label to attach"暗示不传则无 marker，实现未传仍渲染空点（#L16-L18），未文档化。
- 缺口：无 max/99+ 数字截断惯例；marker 对读屏不可达，需调用方手动补 aria-label。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议文档补"未传 label 渲染空点"与 a11y 用法。

## Banner（banner.tsx，114 行）

- 逻辑：导出 BannerViewport/BannerTrack/BannerItem 三 parts + Banner 复合 + 静态属性 Banner.Viewport/.Track/.Item。
- BannerTrack 用 Web Animations API 无限循环 translateX 0↔-50%（#L31-L35），playing=false 或 prefers-reduced-motion 时 pause（#L36-L37）；playing 变化经 getAnimations()[0] play/pause（#L40-L48），卸载 cancel。
- Banner 复制 repeat = max(2, 2·ceil(视口宽/单组宽)) 份实现无缝循环，ResizeObserver 监听视口、items 变化重测（#L77-L92）；首份带测量 ref，其余 aria-hidden（#L93）。
- pauseOnHover 走 onMouseEnter/Leave 置 hovering → playing=false，用户回调被包裹不覆盖（#L98-L106）；viewport aria-roledescription="marquee"（#L12）。
- 文档偏差：无（speed/direction/pauseOnHover/statics 均文档化；aria-roledescription 未提，轻微）。
- 缺口：reduced-motion 仅在动画创建时读取一次，运行中切换系统设置不响应（#L28）；marquee 无键盘可达的暂停控件（WCAG 2.2.2 惯例）。
- 冗余/可疑：hover 暂停经 React state 绕一圈而非直接 anim.pause()，多一次渲染链路。
- [ ] 盘点：建议增强 reduced-motion 动态响应与可访问暂停控件。

## Breadcrumb（breadcrumb.tsx，82 行）

- 逻辑：导出 Root/List/Item/Link/Page/Separator 六 parts + Breadcrumb 数据驱动复合 + 类型；复合按 items 渲染，末项渲染为 Page（忽略其 href），其余为 Link（#L67-L79）。
- a11y：Root 为 nav aria-label="breadcrumb"；Page 为 span 且 aria-current="page" + aria-disabled="true" + role="link"（#L33）；Separator li aria-hidden role="presentation"，默认 ChevronRight 可换 children。
- 键盘：Link 为真实 `<a>` 原生可达，focus-visible:underline。
- 文档偏差：无（六 parts、classNames 四 slot、BreadcrumbDataItem 均文档化）。
- 缺口：Page 的 role="link"+aria-disabled 会让读屏报"已禁用链接"，主流做法（Radix 等）仅 span+aria-current，不加 role。
- 冗余/可疑：复合以数组 index 作 key（#L69），items 动态增删时可能错位复用。
- [ ] 盘点：保留现状，建议去掉 Page 的 role="link" 并改用稳定 key。

## Button（button.tsx，41 行）

- 逻辑：导出 Button + ButtonLoadingConfig/ButtonProps + 静态属性 Button.className（四变体预拼全量类串，可直接给 `<a>` 用）。
- loading 时 aria-busy、disabled、渲染 spinner（loadingConfig.icon 可换，#L26-L33）；children 为单个元素时置 data-pure-icon → aspect-square 方形 padding（#L22-L25）。
- 焦点：focus-visible outline+ring；active inset 内压阴影（#L5）。
- 文档偏差：无（variant/loadingConfig/Button.className 均文档化，demo basic/loading/icon 齐全）。
- 缺口：base 类无任何 disabled 视觉反馈（无 disabled:opacity/cursor 类），原生 disabled 仅事件失效（#L5）；源码缺 "use client"（多数兄弟组件均有，barrel 亦未兜底，与"全部组件已设置"的库约定不符）。
- 冗余/可疑：active:shadow-[inset_0_2px_4px_0_var(--accent)] 为任意值 shadow，违反自家"禁止 shadow-[...]"规范。
- [ ] 盘点：建议增强 disabled 视觉态、补 "use client"，inset 阴影移至语义层定义。

## Calendar（calendar.tsx，340 行）

- 逻辑：导出 Root/Header/NavButton/TitleButton/Grid/GridRow/GridCell/MonthGrid/YearGrid 九 parts + Calendar 复合 + CalendarView 类型 + calendarMonthLabels 常量及同名静态属性。
- Temporal.PlainDate 全程不可变运算；value/view 支持受控/非受控，visibleMonth 为纯受控必填（月份状态完全归调用方，#L216-L242）。
- 键盘：三视图均 role="grid" + roving tabindex 单 tab stop；Arrow 四向按列数偏移查 button[data-*]，越界时 onNavigate→onVisibleMonthChange 换页，pendingFocusRef 渲染后 effect 恢复焦点（#L60-L79、#L286-L294）；header ArrowDown 跳入网格（#L312-L321）。
- a11y：grid/row/gridcell/columnheader + aria-selected；nav 按钮 aria-label 随视图变（Previous month/year…）。
- 文档偏差：复合层已实现 onMonthSelect/onYearSelect（#L225-L226）但文档 Calendar API 表未列；其余一致（parts 的 isMonthDisabled/isYearDisabled 已文档化）。
- 缺口：复合层未透传 isMonthDisabled/isYearDisabled（parts 支持、复合不支持，与 AGENTS.md 指南宣称不符）；Cell 的 {...props} 在 tabIndex 之后展开，用户传 tabIndex 会破坏 roving tabindex（#L144）。
- 冗余/可疑：焦点恢复 effect 无依赖数组，每次渲染执行靠 ref 短路（#L286）。
- [ ] 盘点：建议复合层补月/年禁用透传，文档补 onMonthSelect/onYearSelect。

## Callout（callout.tsx，17 行）

- 逻辑：单导出 Callout + CalloutVariant；role="note" + data-variant，四 variant 软色底（bg-*/15 + 对应 text-*，#L9-L14），className 后置合并可覆盖配色。
- 无状态、无副作用、无键盘；内容由 children 自由组装，props spread 在 role 之后故 role="alert" 可覆盖（Form/FormItem 用法可行）。
- 文档偏差：无（variant 枚举与默认 info、覆盖方式均与实现一致）。
- 缺口：无明显缺口（无图标/标题结构化 slot 属极简设计，文档已定位为纯容器）。
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## Capsule（capsule.tsx，13 行）

- 逻辑：单导出 Capsule + 静态属性 Capsule.className（inline-flex overflow-hidden rounded-md + *:rounded-none *:px-2 *:py-1 归一子项）；组合体仅是套用该类串的壳。
- 无状态、无副作用、无 a11y 附加（纯布局容器）。
- 文档偏差：文档标题与描述均称 "pill-shaped"，实现圆角是 rounded-md（中等圆角，非胶囊形 rounded-full），措辞与实现不符。
- 缺口：无明显缺口。
- 冗余/可疑：无（静态类串即主实现，单一来源）。
- [ ] 盘点：建议统一——要么改 rounded-full 成真胶囊，要么文档改述为"圆角拼接容器"。

## Card（card.tsx，11 行）

- 逻辑：单导出 Card；relative overflow-hidden rounded-lg + border + shadow-base + backdrop-blur-md 的玻璃拟态静态表面，无 parts、无静态属性。
- 无状态、无副作用、无键盘；刻意无 hover/lift，交互版是 CardButton。
- 文档偏差：无（"static surface, no hover effects" 与实现一致）。
- 缺口：无明显缺口。
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## CardButton（card-button.tsx，22 行）

- 逻辑：单导出 CardButton + CardButtonVariant；type="button" 默认，variant 默认 outline（与 Button 默认 primary 不同，文档已如实标注）。
- 交互：hover:-translate-y-0.5 + hover:shadow-elevated 上浮，active 回落 + inset 内压阴影，focus-visible outline+ring（#L5）。
- 无状态、无副作用；a11y 依赖原生 button 语义。
- 文档偏差：无（四变体与默认值一致）。
- 缺口：与 Button 同样无 disabled 视觉态（base 类无 disabled:*）。
- 冗余/可疑：active:shadow-[inset_0_2px_4px_0_var(--accent)] 任意值 shadow，违反"禁止 shadow-[...]"规范（与 Button 同源写法）。
- [ ] 盘点：建议增强 disabled 视觉态，inset 阴影移至语义层。

## Cascader（cascader.tsx，92 行）

- 逻辑：导出 Cascader + CascaderTrigger part + CascaderNode 类型；openLevel/path/selected 三态全内部，levels = tree + path 子级 useMemo（#L32-L36）。
- 面板复用 PopoverContent + List，CSS 锚点定位（anchorName/positionAnchor，需 Chrome 125+），每层独立面板；点击分支下钻、点击叶子 setSelected 收起（#L42-L51）。
- 键盘：trigger 为 button（Enter 可开），面板内依赖 List 自身键盘导航，无跨层级方向键联动。
- a11y：trigger aria-expanded；无 aria-haspopup，面板无标签；根容器 hover/focus-within 样式。
- 文档偏差：文档与实现一致——但两者共同缺失：无 value/onValueChange/onChange 受控或回调 API，选择结果仅存内部 state，调用方无法获知。
- 缺口：无 disabled；缺选择回调/受控契约是相对主流库（ant design 等）的最大缺口。
- 冗余/可疑：handleSelect 闭包引用 path.length（#L44-L45）非函数式更新，快速连点有 stale 风险；placeholder 默认英文硬编码。
- [ ] 盘点：疑似缺失 value/onChange 契约，建议补齐后再盘点其余细节。

## Chart（chart.tsx，398 行）

- 逻辑：单导出 Chart + ChartData/ChartSeriesConfig/ChartProps；canvas 2D 全量重绘管线（DPR 适配、plot rect、decimate 抽样），数学层 chart-kit + 绘制层 chart-paint + useChartPalette 配色，内嵌 ChartLegend。
- 状态仅 hidden Set（legend 联动）与 themeTick，交互态全走 ref（hover/drag/view/metrics/主题色缓存），data/configs 经 ref 读最新。
- 副作用：MutationObserver 监听 documentElement class/style/data-brand/data-surface → 重绘（#L356-L363）；ResizeObserver 容器重绘（#L364-L371）；无依赖 effect 每渲染 draw + 首帧一次性 onReady（#L372-L378）。
- 交互：hover crosshair + tooltip（tooltip 为命令式 DOM replaceChildren 构建、边界钳制）、拖拽 box-zoom（>8px 生效，pointer capture）、双击重置视图、legend 点击隐藏系列。
- a11y：canvas 无 role/aria-label/降级数据表，交互纯鼠标，读屏完全不可达。
- 文档偏差：box-zoom 与双击重置、legend 隐藏联动均已实现未文档化（文档仅提 tooltip/legend）。
- 缺口：无键盘/a11y 替代呈现；formatTimestamp 硬编码 M/D 且假定秒级时间戳，不可定制（#L29-L32）。
- 冗余/可疑：draw effect 无依赖数组每渲染执行（ref 模式一致，可接受但可改依赖）。
- [ ] 盘点：建议增强 a11y（aria-label/降级数据），文档补 box-zoom 交互。

## ChartLegend（chart-legend.tsx，27 行）

- 逻辑：单导出 ChartLegend + ChartLegendProps；items 渲染 swatch+label 的 button 行，swatch "line"|"square" 两形（#L16-L19），hidden.has(i) 时 opacity-40。
- 纯受控无内部状态：hidden/onToggle/onHover 均由调用方持有（Chart 组合时传入）；hover 经 mouseenter/leave 回调。
- 无副作用、无键盘附加逻辑；焦点样式未自定义（保留 UA 默认 outline）。
- 文档偏差：无（七个 props 全文档化，"purely presentational" 定位与实现一致）。
- 缺口：toggle 按钮无 aria-pressed，隐藏/显示状态对读屏不可达（惯例是 aria-pressed 或 checkbox 语义）。
- 冗余/可疑：-
- [ ] 盘点：建议增强 aria-pressed 状态语义。

## ChatInput（chat-input.tsx，139 行）

- 逻辑：单导出 ChatInput；value 受控/非受控，onSend({text, images}) 后自清空并 revoke 全部 blob URL（#L81-L88）；canSend = 有文本或图片。
- 图片：autoPaste 拦截 paste 的 image/* 文件成缩略图（#L96-L107）；attach 显示按钮 + 隐藏 file input（accept="image/*" multiple）；removeImage 即时 revoke。
- enterToSend="auto" 经 useIsCoarsePointer 判定：细指针 Enter 发送、粗指针仅换行；Shift+Enter 恒换行；isComposing 挂起 IME（#L89-L95）。
- a11y：Send/Attach/Remove aria-label 均英文硬编码；disabled 贯穿 textarea/attach/send。
- 文档偏差：无（全部 props、移动端 16px/Enter 行为均文档化）。
- 缺口：组件卸载时不 revoke 残留 blob URL（仅删除/发送时清理，#L54-L87 无 unmount cleanup）；无字数统计/maxLength 惯例（可选）。
- 冗余/可疑：Textarea onChange 包装中 `return undefined` 多余（#L117-L120）。
- [ ] 盘点：保留现状，建议补卸载时清理 blob URL。

## Checkbox（checkbox.tsx，156 行）

- 逻辑：导出 CheckboxRoot/CheckboxIndicator/CheckboxLabel 三 parts + Checkbox 组合 + CheckboxGroup + 类型；静态属性 Checkbox.Group。
- 实现：sr-only 原生 input 承载语义/表单，视觉 span 经 has-checked:/has-focus-visible: 联动；Root 对 Enter preventDefault+click()（弹层内键盘可用，#L12-L18）。
- Checkbox 受控/非受控 checked，onChange（原生）+ onCheckedChange 双回调；Group 受控/非受控 value、平铺/分组 options、name 经 FormContext 注册收集（#L104-L115）。
- 键盘：Group 容器拦截四向 Arrow 在非 disabled input 间 roving focus（#L125-L144）；a11y 语义由原生 input 保证，role="group"+aria-label。
- 文档偏差：文档称 className/style "applied to the checkbox box"，实际两者落在 CheckboxLabel（label 元素，#L62），indicator 有独立 slot——描述与实现不符；另 AGENTS.md 示例的 label prop 不存在（实现用 children）。
- 缺口：Indicator 未标 aria-hidden（装饰性 svg 可能被读屏重复朗读）；Group options 的 value 重复无告警。
- 冗余/可疑：源码缺 "use client"（同 Button）；CheckboxProps 先 Omit style 又重新声明，绕了一圈。
- [ ] 盘点：建议修正文档 className/style 落点描述、补 "use client" 与 Indicator aria-hidden。

## Chip（chip.tsx，21 行）

- 逻辑：单导出 Chip + ChipVariant/ChipProps 类型；纯展示 span，无 parts、无静态属性。
- variant 六值（outline/primary/success/warning/danger/info）默认 primary：primary 实色底，其余软色 `bg-*/15` + 对应 text-*（#L9-L16）；`data-variant` 标记；className 经 cn 合并、props 全量透传。
- 无内部状态、无副作用、无键盘/焦点逻辑；a11y 无附加语义（纯文本标签，设计如此）。
- 文档偏差：无（variant 枚举与默认值一致；"子元素嵌 a/button 实现交互"的用法说明与零交互实现相符）。
- 缺口：无明显缺口（零交互设计，disabled/aria 不适用）。
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## ChipGroup（chip-group.tsx，87 行）

- 逻辑：单导出 ChipGroup + ChipItem/ChipGroupProps；隐藏测量层（aria-hidden、absolute -9999px）逐 chip 测宽，fit 贪心计算可见数（#L27-L53），溢出时为 "+more" 触发器预留宽度（#L49-L51）。
- 内部状态仅 visibleCount；ResizeObserver 监听容器 + items 变化重测，卸载 disconnect（#L54-L62）。
- onOverflowChange 以 hiddenKey ref 去重后触发（#L63-L70）；renderMore 节点内联渲染，由消费方自行组装 Popover/Tooltip。
- 无键盘/焦点；可见 chip 为 span，无 role/aria。
- 文档偏差：styles.chip 已实现但文档 API 表未列出（只列 classNames.chip）。
- 缺口：item.value 重复时可见/测量两层都会 React key 冲突（#L74、#L82），未做去重或告警。
- 冗余/可疑：onOverflowChange 的 effect 无依赖数组（#L65），每次渲染都跑、靠 hiddenKey 比较短路，可改为依赖 [hiddenKey]。
- [ ] 盘点：保留现状，建议文档补 styles.chip。

## Collapse（collapse.tsx，157 行）

- 逻辑：导出 CollapseRoot/CollapseTrigger/CollapsePanel 三 parts、Collapse 复合、Accordion（items 驱动）+ 配套类型。
- Collapse 受控/非受控 open；label/icon 支持 `(open) => node` render-prop；trigger/panel id 用 itemKey 或 useId 关联（#L51-L63）。
- a11y：aria-expanded / aria-controls / aria-labelledby（#L67、#L71）；Panel 为 section + data-open，grid-rows 0fr/1fr 过渡动画。
- Accordion 内部以 string[] 统一管理 single/multiple，受控 activeKeys 做类型转换（#L112-L125）；single 模式闭合时回传 `nextKeys[0] || ""`（#L144）。
- 键盘：Trigger 为原生 button，Enter/Space 天然可用；无方向键导航。
- 文档偏差：onKeyChange single 模式类型为 `(value: string | undefined) => void`，实现闭合时回传 `""`（#L144），与签名不符。
- 缺口：无 ArrowUp/Down/Home/End 手风琴惯例键盘导航。
- 冗余/可疑：cn(className) 单参包装（#L66）；Accordion 多处类型断言（#L115-L120、#L141-L144）绕过判别联合。
- [ ] 盘点：建议增强方向键导航，并对齐 onKeyChange 空值语义。

## Combobox（combobox.tsx，121 行）

- 逻辑：单导出 Combobox + ComboboxFetcher 类型；Picker + List + useCombobox + useRemotePagination 组合。
- value 受控/非受控；options 本地过滤 / fetcher 远程（page/size/keyword，pageSize=20、debounceMs=300）；挂载时若 fetcher 存在即 search("")（#L55-L58）。
- IME：composingRef 挂起 onValueChange 与远程搜索，compositionEnd 用 latestRef 终值补发（#L53、#L92-L112）。
- commit：setValue/onValueChange/onCommit → 关面板 → reset 高亮（#L73-L81）；fetcher 模式 List 滚动到底 loadMore（#L114-L119）。
- 键盘：useCombobox 上下/回车；a11y：input 的 role="combobox"/aria-expanded 由 Picker 提供，本文件补 aria-invalid；List 无 listbox/option 语义、无 aria-activedescendant。
- 文档偏差：onCommit、trailing、classNames.input、styles(panel/item) 已实现未文档化。
- 缺口：列表项无 listbox/option aria 语义，高亮项与输入框无 aria-activedescendant 关联。
- 冗余/可疑：fetcher 缺省时仍以 noopFetcher 走完整远程分页管线，无害略绕。
- [ ] 盘点：保留现状，建议补文档字段并增强列表 aria 语义。

## Command（command.tsx，225 行）

- 逻辑：导出 Command 复合、CommandRoot/CommandInput/CommandList 三 parts + CommandContext（parts 脱离容器即抛错，#L71-L77）+ 配置类型。
- Command：trigger 渲染为 `Button.className.primary` 样式按钮（aria-haspopup/aria-expanded），Dialog 承载并隐藏内置关闭钮（#L209-L215）；open 受控/非受控，onSelect 后关面板。
- CommandRoot：keyword 状态 + flattenItems 扁平化；默认过滤 value/字符串 label/keywords，过滤时排除 disabled（#L88-L95）；rows 变化自动高亮首个非 disabled 项（#L107-L110）；open 变 true 清空关键词并聚焦输入框（#L111-L116）。
- CommandInput：role="combobox" + aria-autocomplete="list"；键盘经 useCombobox（↑↓/Enter），鼠标移动同步高亮（#L164-L166）；hasGroups 决定组头渲染。
- 文档偏差：无（filter/empty/shortcut/分组语义与实现一致）。
- 缺口：高亮行无 aria-selected/aria-activedescendant 关联；无内置全局 ⌘K（文档已说明由应用接 open，不算缺失）。
- 冗余/可疑：defaultRenderItem 中 disabled 仅 opacity，无 aria-disabled。
- [ ] 盘点：保留现状，建议增强高亮 aria 关联。

## ContextMenu（context-menu.tsx，75 行）

- 逻辑：导出 ContextMenu 静态对象（open/dismiss）+ ContextMenuHost 组件；模块级 store + useSyncExternalStore，SSR snapshot 返回 null（#L22-L35、#L49）。
- Host 渲染 fixed size-0 锚点（left/top = x/y）+ anchorName；PopoverContent 以 positionArea + "flip-block, flip-inline" 回退定位（#L56-L68）。
- Menu autoFocus、onEscape → dismiss；onSelect 后 dismiss；面板上右键 preventDefault 防叠层（#L60、#L69-L72）；PopoverContent 关闭回调统一走 dismiss。
- 无定时器/监听清理需求（模块级单例生命周期随宿主）。
- 文档偏差：ContextMenuHost 的 `className` prop 已文档化未实现——Host 不接收任何 props（#L48）。
- 缺口：无 Shift+F10 等键盘唤起路径（由消费方 onContextMenu 决定，可接受）。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议移除或实现文档中的 Host className。

## DatePicker（date-picker.tsx，190 行）

- 逻辑：单导出 DatePicker + DatePickerProps；Calendar + Picker + usePanelFocus 组合，基于 Temporal API。
- 宽松解析 parseInput：空格/逗号/斜杠/中文逗号归一为 -；4 位年→月份视图、年月→日视图、完整日期 commit（#L24-L67）；invalid 清空并标错（#L133-L136）。
- 内部状态 open/text/selected/visibleMonth/view/hasError + committedRef 去重；受控 value 变化全量同步（#L99-L109）。
- Enter 提交解析、面板关闭时补一次 applyParsed（#L159-L166）；方向键经 usePanelFocus 与面板联动；外部 onKeyDown 可 preventDefault 覆盖（#L167-L178）；commit 后关面板并重置 view。
- 文档偏差：无文档——content/docs/component/ 下无 date-picker.mdx（仅 calendar.mdx）；demo 有 basic/disabled。
- 缺口：错误态仅 aria-invalid 边框，无错误文本及其 aria 关联。
- 冗余/可疑：-
- [ ] 盘点：疑似缺失文档，建议补 date-picker.mdx。

## Dialog（dialog.tsx，132 行）

- 逻辑：导出 Dialog 复合 + DialogRoot/DialogClose/DialogContent 三 parts + dialog.success/error/warning/info 静态命令。
- Dialog 受控 open：showModal/close 同步 effect（#L48-L60）；trapTabKey 焦点陷阱；cancel preventDefault → onOpenChange(false)，原生 close 事件同回调（#L61-L67）；backdrop 以 `e.target === e.currentTarget` 判定。
- 标题行：title 左 + 关闭钮右的流式布局，长标题换行不压按钮；复合内将 DialogClose 覆盖为 static 并带 aria-label="Close (ESC)"（#L68-L80）。
- 命令式 dialog.*：createRoot 动态挂 body，关闭后 100ms 延迟销毁（#L98-L126）。
- 文档偏差：Dialog 的 classNames/styles 文档列了 `root` 槽位，实现仅有 content/close（className 直接作用于 dialog 元素）。
- 缺口：无明显缺口（原生 dialog 隐式 modal 语义 + Tab 陷阱 + ESC 均备）。
- 冗余/可疑：#L76 多余空白节点；四个命令方法行为相同仅图标不同（文档已注明）。
- [ ] 盘点：保留现状，建议修正文档 classNames/styles 槽位描述。

## Donut（donut.tsx，74 行）

- 逻辑：单导出 Donut + DonutDatum/DonutProps；弧形由 chart-kit 的 donutLayout/arcPath 计算，配色走 useChartPalette（#L36、#L40）。
- 内部状态 hover(index) 与 hidden(Set)：ChartLegend hover 聚焦扇区、点击 toggle 隐藏；隐藏项按 0 计入布局与 total（#L38-L44）。
- 中心读数：donut 模式绝对居中覆盖，pie 模式移到下方占位（#L66-L71）；valueFormatter 默认 toLocaleString。
- a11y：svg role 由 ariaLabel 决定（"img"/"presentation"）；扇区 path 仅鼠标事件，无键盘路径；无副作用。
- 文档偏差：`ariaLabel` prop 已实现未文档化（API 表未列）。
- 缺口：扇区 hover 高亮无键盘等价路径（键盘用户仅能经图例 toggle）。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议补 ariaLabel 文档。

## Drawer（drawer.tsx，139 行）

- 逻辑：导出 Drawer 复合 + DrawerRoot/DrawerWrapper/DrawerDrag/DrawerContent 四 parts + DrawerDragApi 类型；placement 四方向。
- 打开 showModal + rAF 置 translate(0) 进场；关闭先置位移动画，transitionend(transform) 后才 dialog.close()（#L75-L107），实现完整滑出动画。
- trapTabKey 焦点陷阱；cancel preventDefault → onOpenChange(false) + onCancel；backdrop 点击判定（#L111-L130）。
- drag：外部 DrawerDragApi.handlePointerDown 接到把手；ref 以 React 19 普通 prop 转发至 DrawerWrapper，setRefs 兼容函数/对象 ref（#L119-L127）。
- 文档偏差：无（ref/placement/drag/onCancel 语义均一致）。
- 缺口：无明显缺口（原生 dialog 语义 + Tab 陷阱 + ESC 均备）。
- 冗余/可疑：DrawerContent 垂直放置（top/bottom）时强制 items-center 水平居中（#L45），内容不贴左，是否符合预期存疑。
- [ ] 盘点：保留现状。

## DropdownMenu（dropdown-menu.tsx，31 行）

- 逻辑：单导出 DropdownMenu + DropdownMenuProps；Popover + Menu 组合，仅 31 行。
- open 仅内部 state（非受控）；onSelect 与 Escape 均关面板；Menu autoFocus={open} 打开即聚焦首个可用项（#L26-L29）。
- trigger 样式硬拼 `Button.className.primary`（#L23），即触发器固定为主按钮外观；alignX 默认 center；classNames content/item/label/sub 转发。
- 文档偏差：无（"选中/Escape 关闭并回焦 trigger"的描述与实现一致）。
- 缺口：不支持受控 open（无 open/defaultOpen/onOpenChange props），无法编程式开关或同步外部状态。
- 冗余/可疑：trigger 外观硬编码 primary，无 variant 选项（次要）。
- [ ] 盘点：建议增强受控 open，其余保留。

## DualPicker（dual-picker.tsx，127 行）

- 逻辑：单导出泛型 DualPicker + 类型；mode single/multiple（single 点击已选项即取消，#L58-L60）。
- value 受控/非受控；selectedSet useMemo；搜索过滤 value+getLabel（#L71-L77）；已选列表映射回 options 并过滤孤儿 value（#L78-L80）。
- renderOption/renderSelected render-prop，默认 getLabel 文本 / label+X 行；disabled 锁双面板（select/deselect 直接 return + pointer-events-none opacity-50）。
- a11y：源面板 role="listbox" + role="option" + aria-selected，aria-label 取字符串 sourceTitle（#L97-L101）；目标面板无 listbox/option 语义；无副作用。
- 文档偏差：styles 实现有 panel/header/body/item/selected 五槽，文档只列 panel/body。
- 缺口：选项与已选行均为 div onClick，无 tabindex/键盘可达；目标面板缺 aria 语义；无全选/清空等批量操作（主流穿梭框惯例）。
- 冗余/可疑：-
- [ ] 盘点：建议增强键盘可达性，并补 styles 文档。

## FieldSearch（field-search.tsx，77 行）

- 逻辑：单导出 FieldSearch + 类型；InputGroup + Select 组合：前导字段 Select，enum 字段渲染第二个 Select（含空值"全部"项），否则 InputRoot 文本输入。
- 文本模式 debounce（默认 300ms）emit；IME composition 挂起、compositionEnd 立即 emit（#L42-L56）；timer 卸载清理（#L30）。
- onSearch 恒收 trim 值；lastEmitted 以 field+value 去重（#L33-L41）；字段切换清空并立即 emit(field, "")（#L57-L63）。
- 文档偏差：allLabel 文档默认 `"All"`，实现默认 `"全部"`（#L71），与工作区规范描述同样不符。
- 缺口：无 disabled；fields 变更后 fieldValue 不重算（有 fallback fields[0] 兜底，风险低）。
- 冗余/可疑：text state 与 textRef 双轨（IME 时序需要，合理）。
- [ ] 盘点：建议对齐 allLabel 默认值（文档或实现二选一），其余保留。

## Form（form.tsx，227 行）

- 逻辑：导出 Form、Form.Submit 静态、useFieldValidity hook、FormContext（显式导出）+ FormRef/FormValues 类型。
- 基于 useActionState 的 action：formData 中 setter 注册字段以 formValues 覆盖，processFormData 聚合多值为数组（#L180-L208）；onSubmit 返回 true 且 autoReset 时 reset。
- 注册表 register(name, element | setter) 入 Map，setter 优先于原生元素；setValues 批量设值并对原生 checkbox/radio/文本 dispatch change 事件（#L105-L157）；reset = 原生 reset + setter(null) + 清空 formValues + onReset；submit = requestSubmit。
- Form.Submit：Button outline type=submit，isPending 时 disabled + loading（#L220-L225）；副作用仅 formValuesRef 同步（#L176-L179）。
- 文档偏差：FormContext 的导出未在文档提及（useFieldValidity 已提及）；其余一致。
- 缺口：无明显缺口（字段级校验集中于 FormItem/useFieldValidity，设计如此）。
- 冗余/可疑：文件缺 `"use client"` 指令——15 个兄弟组件均有，含 context/hooks 的此文件被服务端组件直接导入会报错。
- [ ] 盘点：疑似缺失 `"use client"`，建议补上并核对 RSC 使用场景。

## FormItem（form-item.tsx，204 行）

- 逻辑：导出 FormItem + FormItemVariant/FormItemProps（五 variant 判别联合）；按 variant 渲染成品控件。
- 公共 name/id/disabled/required/aria-describedby；setFieldRef 从包装元素向下查 input/select/textarea 并注册进 Form（#L75-L84）。
- validate 返回 string（硬错误）| {message, invalid}（invalid !== false 决定标红）| false（纯 invalid）| true/null/undefined（通过），支持 Promise（#L86-L109）；默认 onBlur，已 invalid 后 change 重校验或 onChange 模式（#L111-L120）。
- select variant 以 hidden input 承载 name/value 供原生提交（#L157）；controlProps 的 onChange/onBlur 包装不替换。
- a11y：错误渲染 Callout role="alert" variant="danger" id=hintId，否则 description small aria-live="polite"（#L198-L202）；label htmlFor 关联、required 星号 aria-hidden。
- 文档偏差：无（validate 语义/validateTrigger/hidden input 均一致）。
- 缺口：Form.reset() 后本地 error 状态不清除（FormItem 无 reset 通知机制），错误提示残留到下次校验。
- 冗余/可疑：errorRef.current = error 于渲染期写 ref（#L72），非纯但行为可控。
- [ ] 盘点：建议增强与 Form.reset 的错误清理联动。

## Image（image.tsx，37 行）

- 逻辑：导出 Image / ImageRoot / ImageImage（普通函数组件，ref 原生透传）；Image 依 `useImageStatus(src)` 三态渲染：loading→`loadingNode`、failure→`fallback`、success→`ImageImage`；根容器自带 `relative overflow-hidden`，无默认宽高；ImageImage 硬编码 `loading="lazy"`、`decoding="async"`（位于 `{...props}` 之后，不可覆盖）；无副作用监听。
- 文档偏差：无
- 缺口：失败/加载切换无 aria-live，读屏不可感知；根容器无尺寸兜底且文档未提示需自行给宽高。
- 冗余/可疑：真实 `<img>` 仅在 success 后挂载，此时预加载已完成，内置 `loading="lazy"` 基本失效。
- [ ] 盘点：保留现状；建议补失败态 a11y 与尺寸用法说明。

## Input（input.tsx，51 行）

- 逻辑：单一导出（parts 复用 input-group）；基于 InputGroup 组装 leading/trailing 槽与 InputRoot；`type` 收窄为 text|email|url|tel|search；`aria-invalid={invalid}` 设在内部 input；`style`/`className` 落在组壳；无内部状态与副作用。
- 文档偏差：无
- 缺口：无明显缺口
- 冗余/可疑：`cn(className)` 单参调用等价于直接透传。
- [ ] 盘点：保留现状。

## InputGroup（input-group.tsx，62 行）

- 逻辑：导出 InputGroup / InputLeading / InputRoot / InputTrailing 四个 parts；InputGroup 用 `focus-within` 承载焦点环，并以 `**:outline-none` 与 `[&_*:focus]:…` 子选择器剥离子元素焦点样式（杜绝双焦点环）；`invalid`→`data-invalid` 驱动 danger 边框/环，且 `data-invalid={invalid || props["data-invalid"]}` 支持手动透传；InputRoot 用 useId 自动补 id；无副作用。
- 文档偏差：文档称 InputRoot "Carries `aria-invalid`"——源码 InputRoot 不设置该属性（由 Input/NumberInput 组合层添加）；文档称 NumberField 建于此 shell——实际 NumberField 用自有 div 壳，NumberInput 才基于 InputGroup。
- 缺口：无明显缺口
- 冗余/可疑：去焦点样式对 focus / focus-visible 写了两套选择器，略重复。
- [ ] 盘点：保留现状；建议修正文档两处表述。

## InputOtp（input-otp.tsx，106 行）

- 逻辑：导出 InputOtp / InputOtpGroup / InputOtpSlot；受控/非受控双模；每槽 onChange 取末字符并自动前进（focus+select）；ArrowLeft/Right 移动、Backspace 在空槽删除前位、粘贴按序填充后聚焦 `index+text.length`（内部 clamp）；组 pointerDown 聚焦首个空槽；`name` 渲染 hidden input；`mask`→type=password；首槽 `autoComplete="one-time-code"`；`aria-label` 按槽序号后缀。
- 文档偏差：无
- 缺口：容器无 role="group" 语义；无填满回调（onComplete）；Delete 清当前槽、Home/End 未支持；粘贴超长静默截断。
- 冗余/可疑：-
- [ ] 盘点：建议增强 onComplete 与 Delete/Home/End 键。

## Kbd（kbd.tsx，11 行）

- 逻辑：单一静态 `<kbd>`：h-8 min-w-8 等宽字体、border + shadow-subtle；无状态、无副作用，props/ref 原生透传。
- 文档偏差：无
- 缺口：无明显缺口
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## List（list.tsx，144 行）

- 逻辑：导出 List / Order（共享内部 ListView + useListController）；viewport 为 `div[tabIndex=0]`：↑↓ 循环移动高亮、Enter/Space 选中，useLayoutEffect 将 `[data-highlighted]` 滚入视野；`onScrollBottom` 距底 16px 触发；分组仅在 getGroup+renderGroupHeader 同时提供时启用，header 为普通 div 不参与键盘导航；highlight 受控/非受控；空态渲染为单个 li。
- 文档偏差：文档为 List 与 Order 均列出 `ref` prop（"移动焦点进列表"）——源码 ListProps 无 ref 字段也未转发，已文档化未实现。
- 缺口：行无 role="option"/aria-selected，容器无 listbox/aria-activedescendant，读屏不可感知高亮；触底后每次 scroll 事件都重复触发 onScrollBottom（无去重）。
- 冗余/可疑：空态也包一层 ul/ol+li 结构略绕。
- [ ] 盘点：疑似缺失文档已承诺的 ref 转发；建议补 aria 语义。

## Masonry（masonry.tsx，205 行）

- 逻辑：导出 Masonry（静态属性 `.Column`/`.Item`）与 MasonryColumn / MasonryItem；嵌套经 MasonryDepthContext 降级为静态 CSS columns（@container 断点类；模块级 warnedNested 仅警告一次）；MeasuredMasonry：useLayoutEffect 每次渲染测量 + ResizeObserver 监容器宽，按 offsetHeight 最短列贪心分配，sameAssignment 抑制无谓 setState；columns 以 JSON.stringify+useMemo 稳定引用。
- 文档偏差：无（异步增高不重测已在文档注明）
- 缺口：仅监容器宽度，单项内容/图片加载后高度变化不重测（无 MutationObserver，机制性限制）。
- 冗余/可疑：JSON.parse 稳定化属 workaround；warnedNested 全局仅一次可能掩盖多实例问题。
- [ ] 盘点：保留现状。

## Menu（menu.tsx，306 行）

- 逻辑：导出 Menu / MenuRoot / MenuItem / MenuLabel / MenuSubContent 及 MenuConfig 类型；MenuRoot `role="menu"`，项为 `role="menuitem"` button，分组标签 `role="group"`；↑↓ 在启用项间循环（真实 DOM focus），→ 开子菜单、← 回父项，Escape→onEscape；子菜单 `popover="manual"` + CSS 锚定位（anchor-name `--menu-sub-{entryId}`、positionArea、flip fallbacks）；hover 150ms 定时开/关，外部 mousedown 关闭；autoFocus 时 rAF 聚焦首个启用项；副作用均正确清理（showPopover 切换、document mousedown、定时器）。
- 文档偏差：无（键盘表与源码一致）
- 缺口：子菜单触发按钮无 aria-expanded/aria-controls；无 Home/End 与类型前置搜索。
- 冗余/可疑：itemClassName 与 classNames.item 两条同类样式通道并存。
- [ ] 盘点：建议增强子菜单 aria-expanded。

## MultiSelect（multi-select.tsx，34 行）

- 逻辑：单一导出；Popover(hasPopup="dialog") + CheckboxGroup 薄组合；受控/非受控（defaultValue=[]）；默认 trigger 为 `placeholder (count)`；CheckboxGroup 带 `aria-label={placeholder}`；无内部副作用。
- 文档偏差：无
- 缺口：无 disabled/invalid/name（不能参与原生表单提交）；trigger 只回显数量不回显已选项；无清空操作。
- 冗余/可疑：-
- [ ] 盘点：建议增强 disabled 与已选项回显。

## NumberField（number-field.tsx，220 行）

- 逻辑：导出 NumberField / NumberStepper / NumberRoot / groupThousands / useNumberCore；useNumberCore 为与 NumberInput 共享的核心：非受控 string + valueRef 同步，blur 时 normalize（clamp min/max、正整取整）；输入按正则过滤；ArrowUp/Down 步进并按 step 小数位防浮点误差；`role="spinbutton"` + aria-valuemin/max/now；`thousands` 失焦时分组显示；canDecrement/canIncrement 控制步进按钮禁用（同步 aria-label Increase/Decrease）。
- 文档偏差：无
- 缺口：stepper 按钮 tabIndex={-1} 不可聚焦（键盘步进走输入框方向键，可用但未在文档明示）；DOM value 为 string（type=text）。
- 冗余/可疑：useNumberCore 作为半内部导出未在文档暴露。
- [ ] 盘点：保留现状。

## NumberInput（number-input.tsx，61 行）

- 逻辑：复用 useNumberCore + InputGroup 组合；prefix/suffix 槽，suffix 存在时替换尾部上下箭头 cue（indicator 默认开、aria-hidden 不可交互）；leading 仅在 prefix 或 classNames/styles.leading 存在时渲染；步进仅键盘。
- 文档偏差：无
- 缺口：无明显缺口
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## Pagination（pagination.tsx，136 行）

- 逻辑：导出 Pagination + 8 个 parts（Root/First/Prev/Pages/Next/Last/Ellipsis/Summary）；buildPageItems 在 `siblingCount*2+5` 槽内全展示、否则省略号折叠；当前页 outline 变体 + `aria-current="page"`，其余 text 按钮；First/Prev/Next/Last 各有 aria-label，边界禁用；`disabled` 冻结全部；summary 存在时左文右控（summary `min-w-0 flex-1` 可换行）；纯视图无内部状态。
- 文档偏差：文档 `styles` 表仅列 `{ summary? }`——源码还有 `styles.pages`，已实现未文档化。
- 缺口：aria-label 固定英文不可本地化；无页码直跳输入。
- 冗余/可疑：-
- [ ] 盘点：建议补文档 styles.pages。

## Pager（pager.tsx，148 行）

- 逻辑：单一导出；受控 index/onChange，仅挂载当前页（拖拽期临时挂邻页 aria-hidden）；程序化翻页走 View Transitions（flushSync + startViewTransition，vtLock 防重入），`transition="none"` 关闭；触摸拖拽：0.25 宽度阈值提交、边界 0.3 阻尼、SETTLE_MS=200 回弹，gesture/vt 双锁 ref 防竞态；loop 取模归一；settle 用 window.setTimeout 收尾。
- 文档偏差：无
- 缺口：无键盘翻页（←/→）；无 aria-roledescription="carousel" 或页码变化 aria-live 播报；拖拽仅绑 Touch 事件，不支持鼠标/指针拖拽。
- 冗余/可疑：-
- [ ] 盘点：建议增强键盘翻页与 aria 语义。

## Paper（paper.tsx，19 行）

- 逻辑：单一导出（无 "use client"，纯静态可服务端渲染）；base 为全宽可滚动纸面并内置 print: 重置（白底/去阴影边框）；variant 提供四种固定 A4/A5 横竖版式（mm 尺寸 + break-after-page）；无状态无副作用。
- 文档偏差：无
- 缺口：无明显缺口
- 冗余/可疑：`export { Paper }` 与库内 `export function` 风格不一致；a4 变体 p-[10mm] 与 base 重复声明（值相同）。
- [ ] 盘点：保留现状。

## Password（password.tsx，60 行）

- 逻辑：导出 Password / PasswordGroup / PasswordRoot / PasswordToggle；可见性受控/非受控（defaultVisible=false），toggle 切换 PasswordRoot 的 type；PasswordToggle 自带 `aria-pressed` 与 Show/Hide aria-label；PasswordRoot 用 useId 自动补 id；disabled 同时作用于输入与按钮；`aria-invalid={invalid || undefined}` 设在 input 上；无副作用。
- 文档偏差：文档称 PasswordGroup "Applies data-invalid and aria-invalid"——PasswordGroup 仅经 InputGroup 产 data-invalid，aria-invalid 由 Password 设在 input 上。
- 缺口：未默认 `autoComplete="current-password"`（需调用方手动传）。
- 冗余/可疑：-
- [ ] 盘点：保留现状；建议默认 autoComplete。

## Picker（picker.tsx，121 行）

- 逻辑：导出 Picker 复合组件 + PickerRoot / PickerInput / PickerContent 三个 parts（PickerContent 为 popover="manual" 面板）；value 与 open 均支持受控/非受控双模式（#L59-L64）。
- 定位走 CSS anchor positioning：root 挂 anchorName，面板 positionArea "bottom span-all" + minWidth 锚宽 + positionTryFallbacks "flip-block"（#L109-L116）；开关由 useFloatingPanel 统一处理（外部 mousedown、restoreFocus）。
- 键盘：输入框 Escape 关闭、ArrowDown 打开；面板内 Escape 关闭；消费方的 onClick/onKeyDown 可经 preventDefault 覆盖内置行为（#L83-L99）。
- a11y：PickerInput 带 role="combobox"、aria-expanded、aria-invalid 危险色样式；面板无 role（内容由消费方组装）。
- 文档偏差：无（文档与 props/行为一致；data-open 属性未提及，属微小遗漏）。
- 缺口：combobox 缺 aria-controls / aria-autocomplete，面板与输入框无 id 关联。
- 冗余/可疑：cn(className) 单参数写法（#L82），无实质问题。
- [ ] 盘点：保留现状，可选增强 combobox aria 关联。

## Popover（popover.tsx，210 行）

- 逻辑：导出 Popover 复合、PopoverContent 面板 part、usePopoverTrigger hook（含 PopoverHasPopup 等类型）。
- PopoverContent：popover="manual" + tabIndex -1，useFloatingPanel 处理开关/外部关闭/焦点还原；Escape 关闭且消费方可 preventDefault 跳过；alignX 三档映射 positionArea，flip-block, flip-inline 回退（#L5-L30, #L66-L70）。
- usePopoverTrigger：click 模式点击切换 + ArrowDown/Space 打开；hover 模式 pointerenter 开（可延迟）/leave 延迟关，timer 统一清理（#L162-L166）；返回 triggerProps/contentProps/clearTimer/scheduleOpen/scheduleClose/anchorName。
- a11y：trigger 带 aria-haspopup / aria-expanded；面板无 role，语义交给消费方。
- 文档偏差：PopoverContent 的 `autofocus` prop、Popover 的 `hasPopup` prop 已实现但文档表格未列出。
- 缺口：hover 模式键盘完全无法打开（onKeyDown 在 hover 下直接 return）；trigger 与面板无 aria-describedby/id 关联。
- 冗余/可疑：PopoverContent 内 handleOpenChange 只是 onOpenChange 的透传包装（#L41-L43），可省。
- [ ] 盘点：保留现状，建议补 hasPopup / autofocus 文档并补 hover 模式键盘路径。

## PreviewCard（preview-card.tsx，55 行）

- 逻辑：单导出 PreviewCard；组合 Card + Image + Tooltip（useTooltipWiring + TooltipContent）。
- 无 trigger 时渲染内联卡片；有 trigger 时渲染 `<a href>` 锚点，pointerenter/leave + focus/blur 双通道显隐，卡片放入 TooltipContent（#L45-L54）。
- 卡片固定 h-40 图区 + 标题/描述，classNames/styles 四槽位（image/body/title/description）。
- 文档偏差：`styles` prop 已实现但文档 API 表未列出（只列了 classNames）。
- 缺口：锚点与 tooltip 弹层无 aria-describedby 关联（依赖 TooltipContent 内部 id，未回连）。
- 冗余/可疑：href 默认 "#"，纯预览场景会生成空锚链接，语义略含糊。
- [ ] 盘点：保留现状，建议补 styles 文档、可选增强 aria 关联。

## Progress（progress.tsx，23 行）

- 逻辑：单导出 Progress；props 仅 current / duration / isAbort / isComplete / className。
- 纯 UI：width 过渡动画由 duration(ms) 驱动；isComplete 强制 100% + success 色，isAbort 冻结当前宽度（frozenWidthRef）+ danger 色 + 0ms 瞬切（#L12-L21）。
- isAbort 冻结值在渲染期写 ref（#L16），非纯渲染但行为可控。
- 文档偏差：无（文档准确描述了 abort/complete 语义）。
- 缺口：无 role="progressbar"、无 aria-valuenow/min/max，读屏完全不可感知——对照主流库是明确缺口。
- 冗余/可疑：-
- [ ] 盘点：建议增强 progressbar aria 语义（低成本高收益）。

## Radar（radar.tsx，100 行）

- 逻辑：导出 Radar + RadarSeries/ClassNames/Styles 类型；SVG 多边形雷达图，网格/辐条由 chart-kit 生成，配色走 useChartPalette。
- 交互：ChartLegend 点击切换系列显隐（hidden Set），legend hover 高亮对应多边形（其余 opacity-35）；多边形自身 mouseenter/leave 也触发 hover（#L89-L96）。
- max 缺省取可见系列最大值（hidden 排除，#L46-L47）；axes 不足 3 个时按 3 根辐条渲染并截断 values。
- a11y：ariaLabel 时 role="img"，否则 role="presentation"；图例按钮的可达性由 ChartLegend 承担。
- 文档偏差：`ariaLabel` prop 已实现但文档表格未列出。
- 缺口：多边形带 cursor-pointer 但点击无任何行为（只有图例可切换），视觉误导；hover 高亮无键盘等价路径。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议移除 polygon 的 cursor-pointer 或补点击行为，并补 ariaLabel 文档。

## Radio（radio.tsx，182 行）

- 逻辑：导出 RadioRoot（sr-only peer input）/ RadioIndicator / RadioLabel parts、Radio 复合、RadioGroup（静态属性 Radio.Group）。
- Radio：checked 受控/非受控，onChange + onCheckedChange（仅勾选时触发 true，符合 radio 不可取消语义）；圆点经 peer-checked 缩放显示。
- RadioGroup：options 驱动，role="radiogroup" + aria-label；接入 FormContext——带 name 时注册字段并同步表单值（#L142-L155）；共享 name 使原生 radio 自带方向键导航。
- 选项级 disabled / indicator / classNames / styles，可用 common 统一下发。
- 文档偏差：与 Form 的集成（FormContext 注册）未写进文档；其余一致。
- 缺口：无 name 的 RadioGroup 依赖原生箭头键、无 roving tabindex 兜底（文档已披露依赖 name）。
- 冗余/可疑：Group 内每个 Radio 都走受控 checked，Radio 自身非受控态在 Group 场景为死路径（无害）。
- [ ] 盘点：保留现状，建议补 Form 集成说明。

## ScrollShadow（scroll-shadow.tsx，98 行）

- 逻辑：导出 ScrollShadowRoot / Viewport / Edge parts + ScrollShadow 复合；edges 默认 ["bottom"]。
- 可见性状态机：scroll（passive）+ ResizeObserver 双监听，按 scrollTop/Left 与尺寸算四边可见性， setState 前做相等短路防抖（#L59-L91）；卸载时移除监听并 disconnect，清理完整。
- Viewport 自带 overscroll-contain、tabIndex=0（可键盘滚动）；Edge 带 data-position 便于 data-[position=] 定向样式。
- 文档偏差：无实质（data-position 属性未在 mdx 提及，属微小遗漏）。
- 缺口：无明显缺口。
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## Segment（segment.tsx，88 行）

- 逻辑：导出 Segment（role="radio" + aria-checked）与 SegmentGroup（role="radiogroup"，静态属性 Segment.Group）；variant fill / text 双形态。
- 键盘：完整 roving tabindex——选中项 tabIndex 0（无选中则首个可用项），方向键/Home/End 跳转并即时选中，全程绕开 disabled 项（#L43-L83）。
- 受控/非受控 value；同值重选不触发 onValueChange（#L37-L38）。
- 文档偏差：无（fill/text 语义、键盘行为均与文档一致）。
- 缺口：SegmentGroup 无 aria-label prop，radiogroup 缺可访问名称。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议给 SegmentGroup 补 aria-label。

## Select（select.tsx，160 行）

- 逻辑：导出 Select + SelectOption / SelectOptionGroup 类型；触发按钮 + popover="manual" listbox 面板，CSS anchor 定位（bottom span-all + flip-block）。open 仅内部状态，不暴露受控。
- 键盘：ArrowUp/Down 开面板并循环移动高亮，Home/End 跳首尾，Enter/Space 提交或开面板，Escape 关闭不选，Tab 关闭；高亮项自动 scrollIntoView（#L125-L131）。
- a11y：role="listbox"、role="option" + aria-selected + data-highlighted，trigger 带 aria-haspopup/aria-expanded/aria-required；name 时渲染 hidden input 参与原生表单。
- 空选项渲染 "No options available" 占位。
- 文档偏差：无（props/键盘行为与文档一致；无 open 受控也如实未列）。
- 缺口：键盘可高亮并 Enter 提交 disabled 选项（moveHighlight/commit 均不跳过 disabled，鼠标路径反而被拦，#L64-L72, #L132）；高亮仅靠 data-highlighted 视觉呈现，无 aria-activedescendant；面板 aria-label 固定取 placeholder（未传则为空）。
- 冗余/可疑：分组渲染时每个 option 用 flat.findIndex 定位索引，O(n²)（量小无害）。
- [ ] 盘点：建议增强——键盘跳过/拦截 disabled 选项与 aria-activedescendant。

## SelectableTable（selectable-table.tsx，50 行）

- 逻辑：导出 SelectableTable<T>；包装 Table，前置 key 为 `__selection` 的复选列，全选/行选。
- 选择为 key（rowKey）数组：受控/非受控双模式；全选只影响当前页键、跨页选择保留（toggleAll 用 pageKeys 过滤，#L30-L37）。
- 表头 Checkbox 用 checked + `<Minus />` indicator 表达半选；aria-label "Select all on this page"。
- loading 时默认空文案切为 "Loading..."；sort/getKey 等继承 Table，getKey 由 rowKey 派生。
- 文档偏差：无（__selection 命名冲突警示也写了）。
- 缺口：半选态对读屏表现为 checked=true 而非 aria-checked="mixed"。
- 冗余/可疑：-
- [ ] 盘点：保留现状，可选增强 mixed 语义。

## Separator（separator.tsx，42 行）

- 逻辑：导出 SeparatorLine / SeparatorText parts + Separator 复合；无 children 渲染单线，有 children 渲染线-文字-线。
- 水平默认 my-3（可覆盖），垂直线 self-stretch 依赖 flex gap；orientation 经 data-orientation 驱动样式。
- role="separator" 挂在单线或复合 wrapper 上。
- 文档偏差：无。
- 缺口：role="separator" 未输出 aria-orientation（仅 data-orientation），语义不完整。
- 冗余/可疑：-
- [ ] 盘点：保留现状，可选补 aria-orientation。

## Sidebar（sidebar.tsx，27 行）

- 逻辑：导出 Sidebar + SidebarHandle 类型；唯一控制面是 ref 命令式 API（toggle/open/close/isOpen），useImperativeHandle 每渲染重建句柄保证 isOpen 新鲜。
- 收起实现：data-close 属性 + w-0/px-0/mx-0 过渡，宽度动画 300ms。
- 文档偏差：无（命令式契约与文档一致）。
- 缺口：收起仅视觉归零，内容仍留在 DOM——内部可聚焦元素关闭后仍可 Tab 到（无 inert/aria-hidden）；无 open 受控或 onOpenChange 回调。
- 冗余/可疑：-
- [ ] 盘点：建议增强——关闭态加 inert/aria-hidden 防焦点逃逸。

## Skeleton（skeleton.tsx，9 行）

- 逻辑：单导出 Skeleton；div + animate-pulse + bg-neutral + rounded-md，默认 size-full。
- 文档偏差：无。
- 缺口：无明显缺口（size/形状全靠 className，符合极简定位）。
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## Slider（slider.tsx，162 行）

- 逻辑：导出 SliderRoot/Track/Fill/Thumb parts + Slider 复合；受控/非受控 value，alignStep 按 step 小数位对齐并 clamp。
- 指针交互：thumb setPointerCapture + document pointermove/up 监听（onUp 中成对移除，清理完整）；track 点击直接设值并聚焦 thumb；disabled 时 root 加 inert。
- 键盘按 WAI-ARIA slider：方向键步进、PageUp/PageDown 大步（约 1/10 量程）、Home/End 到极值（#L115-L146）。
- a11y：thumb 为 button + role="slider"，aria-valuemin/max/now、aria-orientation、aria-label、disabled 时 tabIndex -1；name 时渲染 hidden input。
- 文档偏差：inert={disabled} 行为未写进文档（微小遗漏）；其余一致。
- 缺口：不支持 RTL 方向反转；无 aria-valuetext（自定义格式场景）；仅 thumb 可拖、track 拖拽不支持（点击式）。
- 冗余/可疑：dragRef.pointerId 校验与 pointer capture 语义重复（无害的防御代码）。
- [ ] 盘点：保留现状，可选增强 RTL / valuetext。

## Sparkline（sparkline.tsx，37 行）

- 逻辑：单导出 Sparkline；variant line / area / bar，smooth 走 chart-kit 的 monotone-cubic linePath/areaPath；固定 viewBox 0 0 100 32，currentColor 着色。
- 空数据兜底为 [0,0]；bar 模式按槽位均分并留 1.2 间隙，line/area 端点用 vectorEffect non-scaling-stroke 保持描边不随拉伸变形。
- 文档偏差：无。
- 缺口：无内置 role="img"/aria-label（但 extends svg props，消费方可自行补，属可接受取舍）。
- 冗余/可疑：-
- [ ] 盘点：保留现状。

## Steps（steps.tsx，96 行）

- 逻辑：导出 Steps（items 驱动复合）+ StepsRoot（`<ol>`）/StepsItem（`<li>`，内含 marker `<button>`）；StepsItemState/StepsItemConfig 类型。Steps 为纯受控：必填 `index`，`maxIndex` 默认 `items.length - 1`，clickable 条件 `i <= maxIndex && i !== index`（#L92，当前步不可点）；仅当前步渲染 `item.content`。StepsItem 无状态，竖排分支复用同一 marker。a11y：current 步 `aria-current="step"`，connector `aria-hidden`；clickable 时 marker 与 title 是两个独立按钮。
- 文档偏差：已实现未文档化——StepsItemConfig.content（#L74）、StepsItem 的 `orientation` / `connector` / `children` props；文档 StepsItemConfig 表缺 content 字段。
- 缺口：completed 步 marker 只渲染 Check 图标（lucide 自带 aria-hidden），按钮无可访问文本（建议 aria-label）；无步骤间方向键导航（对比 Tabs）；可点击时 marker+title 双焦点目标偏多。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议补 content/orientation 文档与 completed marker 的 aria-label。

## Switch（switch.tsx，59 行）

- 逻辑：导出 Switch 复合 + SwitchRoot（sr-only 原生 checkbox，承载键盘/表单语义）/SwitchTrack/SwitchThumb/SwitchLabel。受控/非受控双模式（checked !== undefined 判定）；状态样式走 `data-checked`，焦点环由 Track 的 `has-focus-visible:` 承接。无副作用、无内部状态（单一 useState）。label 包裹使文本点击可切换。
- 文档偏差：无（props 表与源码一致）。
- 缺口：disabled 无视觉降级（Track/Thumb 无 `disabled:` 样式类，仅原生 input 失去交互）；Thumb 硬编码 `bg-white` 非语义 token。
- 冗余/可疑：bg-white 与 AGENTS"只用语义 token"规则冲突（白 thumb 在 bg-primary 上尚可接受，建议改 `bg-background` 类 token）。
- [ ] 盘点：保留现状，建议补 disabled 视觉态并审视 bg-white。

## Table（table.tsx，150 行）

- 逻辑：导出 Table + TableRoot/TableHead/TableBody/TableBase 四 parts；SortState/SortDirection/TableColumn 类型。排序三态循环 asc→desc→null，`initialSortDirection` 控制首击方向；`sort !== undefined` 即受控（远程模式），否则内部 useState；useMemo 本地排序（自定义 compare 或 `>`/`<`）。头/体是两个 `<table>` 共享同一 `<colgroup>`；`<th scope="col">` + 排序列 `aria-sort`；空态 colSpan 行。TableBody 内置滚动 `min-h-50 max-h-100 overflow-y-auto`（#L61）。
- 文档偏差：①文档/AGENTS 称 body 内置 `h-96`，实际是 `min-h-50 max-h-100`；②`classNames.wrapper` 已在类型（#L30）与文档中列出，但渲染从未消费（styles.wrapper 有用）——已文档化未实现。
- 缺口：sortable 表头是带 onClick 的 `<th>`，无 tabIndex/keydown，键盘完全不可排序；未排序列无 `aria-sort`（惯例可为 sortable 列标 `none`）。
- 冗余/可疑：classNames.wrapper 死参数。
- [ ] 盘点：建议增强排序键盘可达性；修正 body 高度文档；移除或实现 classNames.wrapper。

## Tabs（tabs.tsx，177 行）

- 逻辑：导出 Tabs（options 驱动）+ TabsList/TabsTrigger/TabsContent parts 及静态属性 Tabs.List/Trigger/Content。受控/非受控 value；useId 派生 `tabs-<uid>trigger/panel-<value>` 关联 id。TabsList autoScroll 模式：ResizeObserver + scroll 监听计算 canScrollLeft/Right、useLayoutEffect 将 active trigger scrollIntoView、±260px scrollBy 按钮（均有清理）。键盘：Trigger 处理 ←/→ 循环移焦 + Enter/Space 激活。a11y：tablist/tab/tabpanel、aria-selected/aria-controls/aria-labelledby/hidden、aria-orientation。
- 文档偏差：已实现未文档化——Tabs 的 `unmountOnHide` / `panelClassName`（#L150-151）、TabsContent 的 `unmountOnHide` / `uid`（#L126）。
- 缺口：`orientation="vertical"` 时仍只有 ←/→ 方向键（WAI-ARIA 惯例纵向用 ↑/↓）；手动激活（移焦不换页）符合惯例但文档未说明。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议补 unmountOnHide/panelClassName 文档与纵向 ↑/↓ 键。

## TextArea（text-area.tsx，13 行）

- 逻辑：单一 Textarea 组件（无 parts、无静态属性），props 直传原生 textarea；`value` 窄化为 string；`invalid` → `aria-invalid` + `data-invalid` + danger 边框/环（aria-invalid: 变体）；内置 focus ring、`min-h-20 resize-y`。onChange 类型允许返回 `{ invalid?: string }`（#L7-9）。
- 文档偏差：无（表格与源码一致）。
- 缺口：无明显缺口。
- 冗余/可疑：onChange 的 `{ invalid?: string }` 返回值在全库无消费者——FormItem 调用处直接丢弃返回值（form-item.tsx #L145-147），该类型契约是死签名。
- [ ] 盘点：保留现状，建议澄清/移除 onChange 返回值契约。

## Timeline（timeline.tsx，81 行）

- 逻辑：导出 Timeline（items 驱动）+ TimelineRoot（`<ol>`）/TimelineItem（`<li>`）parts；纯展示零状态。connector 自动在最后一项关闭（`i < items.length - 1`，#L79）；marker 经 `has-[svg]` 变体在含图标时放大描边。classNames/styles 双通道覆盖五个 slot。a11y：原生列表语义，connector `aria-hidden`。
- 文档偏差：已实现未文档化——Timeline 与 TimelineItem 的 `styles` props（#L24-30、#L69-75），文档表只列了 classNames。
- 缺口：无明显缺口（display-only）。
- 冗余/可疑：-
- [ ] 盘点：保留现状，补 styles 文档即可。

## Toast（toast.tsx，330 行）

- 逻辑：仅导出 Toaster（Object.assign 容器 + success/error/warning/info/loading/dismiss/promise 七个静态方法）及六个 parts 与类型；ToastItem/ToastContainer 不导出。store 为模块级 ToastObserver 单例 + useSyncExternalStore；ToastItem 内部：setTimeout 自动关闭（remaining 剩余时间在 hover 展开 isExpanded 时暂停、cleanup 时扣减）、Web Animations 高度折叠退出动画（EXIT_MS=500，respect prefers-reduced-motion）、dismissHandlers Map 注册手动关闭入口。容器 popover="manual" 的 `<section>`、aria-label="Notifications"、tabIndex=0、hover 展开堆叠；多实例经 hostOwnerId symbol 争抢唯一渲染权（#L200-229）。promise 方法 loading→success/error 自动替换。
- 文档偏差：①文档 ToastItemProps 的 classNames/styles 列有 `root` 槽，源码无（仅 icon/content/title/description/close，#L58-71）——已文档化未实现；②文档容器 props 写 `ComponentProps<"div">`，实际渲染 `section`。
- 缺口：容器无 `aria-live`（新 toast 不会被屏幕阅读器播报，仅靠 tabIndex 可达）；键盘聚焦容器不触发展开（仅 mouseenter）。
- 冗余/可疑：toastsCounter 清空后归 1 复用 id（极端下与残留 dismissHandlers 键冲突，边缘）。
- [ ] 盘点：建议增强 aria-live="polite" 与聚焦展开；删除文档中不存在的 root 槽。

## Toggle（toggle.tsx，67 行）

- 逻辑：导出 Toggle + ToggleGroup（静态属性 Toggle.Group）。受控/非受控 checked；自定义 onClick 先执行、`e.defaultPrevented` 可阻止切换（#L20-22）；状态用 `aria-pressed` 且样式直接挂 aria-pressed: 变体。ToggleGroup 多选 `string[]`（selectedSet useMemo），受控/非受控 value/defaultValue + onChange。零副作用。
- 文档偏差：①文档 Toggle 行称 props "except type, className, aria-checked"——源码仅 Omit `type`/`className`（#L6），aria-checked 并未被排除，描述不准；②AGENTS.md 写 ToggleGroup 用 `onValueChange`，源码与文档均为 `onChange`。
- 缺口：ToggleGroup 容器无 `role="group"`，选项组语义不明。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议补 role="group" 并修正两处文档措辞。

## Tooltip（tooltip.tsx，134 行）

- 逻辑：导出 Tooltip（wiring 容器：context 下发 popoverId/anchorName/delay，不渲染不 clone）+ TooltipTrigger/TooltipContent parts、静态属性与 useTooltipWiring。基于原生 `popover="manual"` + CSS anchor positioning（positionAnchor/positionArea/positionTryFallbacks 内联）。模块级 hideTimers WeakMap 管理延迟隐藏（clearTimeout 正确清理）。触发：pointerenter show / pointerleave 延迟 hide、focus show / blur hide；气泡上 pointerenter cancelHide 可停留。
- 文档偏差：无（delay 即隐藏延迟，与源码一致）。
- 缺口：Trigger 无 `aria-describedby` 指向气泡 id，屏幕阅读器不自动朗读 tooltip 内容（popoverTarget 仅定位用途）；TooltipTrigger 强制渲染 `<button>`，非按钮触发需手工组装（文档已注明，可接受）。
- 冗余/可疑：-
- [ ] 盘点：建议增强 aria-describedby 关联。

## Transfer（transfer.tsx，106 行）

- 逻辑：仅导出 Transfer 复合（无 parts）与 TransferItemConfig 类型。受控/非受控 `value`（= 目标面板值集）+ onChange；两侧勾选各持一个 Set 状态。moveRight 按 dataSource 顺序重排、moveLeft 过滤被勾选项，移动后清空对应勾选集（#L56-71）；面板 header 显示 `checked.size/items.length` 计数；body 固定 `h-64` 滚动；空态 "No data"。移动按钮 aria-label="Move right/left"、勾选为空自动 disabled；行基于 Checkbox（disabled 项不可选不可移）。
- 文档偏差：已实现未文档化——`styles` props（#L29-35，文档表只列 classNames）。
- 缺口：无面板级全选（checkbox 组只能逐个勾选）；面板标题与列表无 aria 关联（header 未 aria-labelledby 到 body）。
- 冗余/可疑：-
- [ ] 盘点：保留现状，建议增强全选与 styles 文档。

## Typography（typography.tsx，38 行）

- 逻辑：单一 Typography 组件，`variant`（10 种：h1-h6/headline/description/heading-code/description-code）同时决定样式与渲染标签（headline→h1、description→p、code 两变体→code）；默认 description。纯静态渲染，零状态零副作用；语义标签天然可及。
- 文档偏差：无（variant 表与源码映射一致）。
- 缺口：无 `as`/element 覆盖 prop（主流惯例允许改标签，如 headline 强制 h1 时多 h1 的语义风险）。
- 冗余/可疑：-
- [ ] 盘点：保留现状，可选增强 as 覆盖。

## Upload（upload.tsx，214 行）

- 逻辑：导出 Upload 复合 + UploadRoot/UploadDropzone/UploadHiddenInput 三个 parts（UploadItem/UploadActions/UploadReject 只是 TS 接口非组件）。本地验证三连：accept（扩展名/MIME/`image/*` 通配）、maxSize、maxCount（按 controllersRef 已占槽位扣减，#L108-110）；拒绝经 onFilesRejected 按 reason 分类上报。副作用：AbortController Map（remove/clear/卸载时 abort 并清理）、dragDepthRef 解决子元素 dragenter/leave 抖动、callbacksRef 每渲染同步避免过期闭包；useImperativeHandle(actionsRef) 暴露 remove/clear。键盘：dropzone `role="button"` + tabIndex（disabled 时 -1）+ Enter/Space 开文件框；hidden input `aria-hidden` `tabIndex={-1}`。不做网络请求，进度交给 use-upload-monitor。
- 文档偏差：①文档与源码一致；但 AGENTS.md 列 "Parts: UploadDropzone / UploadItem / UploadActions / UploadHiddenInput"——UploadItem/UploadActions 并非导出组件（是接口），且源码还有文档未提的 UploadRoot。
- 缺口：dropzone 无 aria-label/提示文案关联（默认 children 含文字，自定义 children 时需自理）；无粘贴上传（可选惯例）。
- 冗余/可疑：matchesAccept 定义在组件体内每渲染重建（微小）。
- [ ] 盘点：保留现状，修正 AGENTS 的 parts 列表。

## Watermark（watermark.tsx，153 行）

- 逻辑：导出 Watermark 复合 + WatermarkRoot/WatermarkCanvas parts 与静态属性 Watermark.Root/Canvas。canvas 绘制：devicePixelRatio 缩放、语义色经 getComputedStyle 读 CSS 变量（--muted-foreground 等）并按 colorScheme 回退、旋转平铺循环。副作用三层且均正确清理：prefers-color-scheme matchMedia 监听、documentElement 的 MutationObserver（class/style/data-brand/data-surface → themeTick 触发重绘）、ResizeObserver + rAF 节流观察父容器尺寸。canvas 绝对定位 pointer-events-none select-none。
- 文档偏差：无（默认值表与源码一致）。
- 缺口：canvas 无 `aria-hidden`（纯装饰却可能被辅助技术暴露）；无防篡改保护（对比 antd 水印会抵抗 DOM 删除/改样式，本项目 MutationObserver 只用于主题重绘）。
- 冗余/可疑：colorScheme 与 themeTick 双通道并非冗余（系统偏好 vs class 换肤两条路径）。
- [ ] 盘点：建议增强 aria-hidden；防篡改视产品定位决定。

## Wizard（wizard.tsx，153 行）

- 逻辑：导出 Wizard、InlineWizard（静态 Wizard.Inline）、useWizardNavigation 状态机 hook 及相关类型。hook：受控/非受控 index、maxVisited 追踪最大已访问、go 钳制 0..count-1 且拒绝超过 maxReachable（#L41-49）、isFirst/isLast/isReachable。Wizard = Steps（maxIndex=maxVisited 实现回访锁）+ Pager（view-transition，固定 `h-48`）+ Back/Next/Submit footer；InlineWizard 用竖排 Steps 只展开当前步，Back/Continue/Finish 内嵌步内容，`disabled` 冻结全部导航。零副作用。
- 文档偏差：①文档 Wizard classNames 写 `{ root? / steps? / pager? / footer? }`——源码无 `root` 槽（#L13-17）；②InlineWizard 文档步骤类型 `title?` 可选，实际必填（#L80）。
- 缺口：Wizard 复合本身不支持受控 index/自定义 footer（需退到 useWizardNavigation 自建）；Pager 固定 h-48，超高内容被裁（仅能靠 classNames.pager 覆盖）。
- 冗余/可疑：WizardStatics 接口导出后无消费（类型冗余）。
- [ ] 盘点：保留现状，修正 root 槽与 title 必填的文档偏差。

## 附：demo 文件清单（app/demos/<name>/）

- image：basic、custom、loading；input：basic、custom、invalid；input-group：basic；input-otp：basic、custom、disabled、invalid、mask；kbd：basic、combination；list：basic、grouped、order；masonry：basic、custom；menu：basic；multi-select：basic、grouped；number-field：basic、controlled、invalid；number-input：basic、custom、disabled；pagination：basic、disabled、long-summary；pager：basic、gesture；paper：basic；password：basic、custom、disabled、invalid。

