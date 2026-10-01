# Litefy UI — app/ui 下 .ts 文件逐文件盘点

> 生成于 2026-10-01，基于逐文件阅读源码。范围：`app/ui` 下全部 20 个 `.ts` 文件（共 1785 行）——入口 barrel ×2、组件 barrel、纯工具 ×4、React hooks ×12。与 `audit/source-audit.md`（74 个 tsx 组件）互补，覆盖其未涉及的 utils 层。用途：人工审核，审完可删。
>
> 背景事实：与组件层相同，`utils/index.ts` 对全部 17 个工具文件 `export *` 全量导出，且每个文件在 `content/docs/utils/` 均有文档页——「库内部没用到」≠「可删」。

---

## app/ui/index.ts（2 行）
库总入口 barrel，无任何逻辑。
- `export * from "./components"` — 转出全部 74 个组件文件。
- `export * from "./utils"` — 转出全部 17 个工具文件。

## app/ui/components/index.ts（74 行）
组件层 barrel：74 个 `export *`，无逻辑、无重导出别名。注意导出顺序非字母序（avatar → banner → badge → breadcrumb → calendar → capsule → … → date-picker 后又接 collapse → button → callout），系按功能聚簇的历史顺序，纯风格问题。若两个组件文件导出同名符号会在此静默冲突（当前无）。

## app/ui/utils/index.ts（17 行）
utils barrel：17 个 `export *`，无逻辑。

## app/ui/utils/cn.ts（3 行）
类名合并工具，全库唯一样式入口。
- `export const cn = twMerge` — 直接别名 tailwind-merge 本体（非包装，无附加逻辑）。
- `export type { ClassNameValue }` — 转出 twMerge 的入参类型。

## app/ui/utils/chart-kit.ts（392 行）
图表数学层：纯函数 + 类型，零 React/DOM 依赖（SSR 安全），被 chart（canvas）、donut、radar、sparkline、chart-paint 消费。

**类型**
- `ChartPoint { x: number; y: number }` — 通用 2D 点。
- `DonutSegment { index, start, end, mid, ratio }` — 环图分段（角度制；start/end 已扣 gap 内缩，mid 未扣）。
- `TimeTicks { ticks: number[]; format: (value) => string }` — 时间刻度集 + 刻度格式化器。

**私有辅助**
- `round(v)` — `Number(v.toFixed(4))`，全文件坐标精度约定。
- `pad2 / formatClock / formatClockSec / formatDay / formatMonth` — 时间标签格式化（`H:mm`、`H:mm:ss`、`M/D`、`YYYY/M`）。
- `SUB_DAY_STEPS` — 秒级步长候选表 `[1,2,5,10,15,30,60,…,43200]`；`DAY = 86400`。
- `monotoneControlPoints(points)` — monotone cubic（Fritsch–Carlson 变体）切线：相邻斜率异号置 0，否则加权调和平均 → 保证平滑曲线不过冲、单调段保持单调。
- `lowerBound(xs, target)` — 二分：第一个 `>= target` 的下标。

**导出函数**
- `polar(cx, cy, r, deg)` — 极坐标（度）→ 直角坐标；屏幕坐标系（y 向下，角从 +x 轴顺时针）。
- `arcPath(cx, cy, r0, r1, a0, a1)` — 环形扇区 SVG path。`sweep<=0` 返回空串；`sweep>=360` 用两段半圆拼整环（`r0>0` 时追加内圈反向回程，规避 SVG 无法画完整圆弧的限制）；`r0<=0` 退化为实心扇形；`large-arc` 标志按 `sweep>180`。
- `donutLayout(values, startAngle=-90, gap=0)` — values → `DonutSegment[]`；负值按 0 计，total=0 时 ratio 全 0；每段 pad 取 `gap`，但 sweep 不足 `2×gap` 时取 `sweep/4` 防止负宽。
- `scaleLinear(domain, range)` — 线性映射闭包；domain 跨度为 0 时恒返回 range 中点。
- `polygonPoints(points)` — 点集 → `"x,y x,y"`（SVG polygon points 属性）。
- `radarRings(count, radius, levels)` — `levels` 层同心正多边形环顶点（自 -90° 起）。
- `radarSpokes(count, radius)` — 雷达轴外端点。
- `radarPolygon(values, max, radius)` — values 按 max 归一化（clamp 0..1，max<=0 时以 1 兜底）后的多边形顶点。
- `linePath(points, smooth=false)` — 折线 path；`smooth=true` 时用 monotone 切线生成三次贝塞尔（控制点取每段 x 的 1/3 处）；n=1 退化 `M` 命令。
- `areaPath(points, baseline, smooth=false)` — linePath + 底边往返闭合。
- `niceTicks(min, max, count=5)` — 1/2/5×10ᵏ "nice" 数值刻度；非有限输入或 `min>=max` 退化为 `[base-1, base, base+1]`；`-0` 归一为 0。
- `niceTimeTicks(min, max, count=6)` — 时间轴刻度自动分档：target<1 天 → 秒级表；<28 天 → 天档 `[1,2,7,14]`（兜底 28）；<12 月 → 月档 `[1,2,3,6]`；否则年档 `[1,2,5,…,500]`。四个私有生成器：`subDayTicks`（对齐 step 毫秒；零点刻度显示日期，step<60 显示秒级时钟）、`dayTicks`（本地零点 + epochDay 对齐；容忍早于 min 不超过 1 天的前置刻度）、`monthTicks`（按平均月长 30.4375 估算目标）、`yearTicks`。
- `lttb(points, targetCount)` — Largest-Triangle-Three-Buckets 降采样；`targetCount>=n` 或 `<3` 原样返回；恒保留首尾点。
- `LTTB_THRESHOLD = 2000` — 降采样触发阈值常量。
- `decimate(points, targetCount)` — 超过阈值才执行 lttb 的便捷封装。
- `nearestIndex(xs, target)` — 二分找最近值下标（并列取左）；空数组返回 -1。
- `dataWindow(xs, xMin, xMax)` — 可视窗口下标 `[i0, i1]`，两端各外扩 1 点（供线段跨界渲染）。
- `computeYDomain(series, i0, i1)` — 多序列窗口内 min/max，跳过 null 洞；全空返回 null；`min===max` 时扩为 `[min-1, max+1]`。
- `seriesPoints(values, xs, i0, i1, toX, toY)` — 窗口（±1 外扩）内非空值 → `ChartPoint[]`。
- `minPositiveDelta(xs, i0, i1)` — 窗口内最小正相邻差（供柱状 band 宽度估算）。

## app/ui/utils/chart-paint.ts（178 行）
Canvas 绘制层：仅被 chart.tsx 消费。依赖 chart-kit 的 scaleLinear/linePath/areaPath。纯函数（无 hooks），故不带 "use client" 合理。

**常量与类型**
- `AXIS_FONT = "11px ui-sans-serif, system-ui, sans-serif"` — 轴文字字体。
- `PlotFrame` — 一帧绘制的全部上下文：`left/top/plotWidth/plotHeight`（像素区）+ `xMin/xMax/yMin/yMax`（数据域）+ `i0/i1`（数据窗口下标）。
- `BarSeriesPaint { values, fill, alpha }` / `LineSeriesPaint { stroke, width, fill?, fillAlpha? }` — 序列绘制配置。

**导出函数**
- `readThemeColor(name, fallback)` — 建临时隐藏 span 写 `color: var(--name, fallback)` 后读 getComputedStyle，再移除；`none` 子串替换为 `0`（color-mix 变量缺失时浏览器返回 none 的兜底）；SSR 直接返回 fallback。
- `fillWith(ctx, color, alpha)` / `strokeWith(ctx, color, alpha)` — 设 globalAlpha + fill/stroke 样式。
- `resetAlpha(ctx)` — globalAlpha 归 1。
- `computePlotRect(ctx, yTicks, width, height)` — 以 AXIS_FONT 实测 y 刻度标签最宽者推算绘图区 inset：`left = max(34, labelWidth+14)`，right=12、top=10、bottom=26；绘图区最小 10×10。
- `drawYAxisGrid(ctx, frame, ticks, textColor, gridColor)` — 水平网格线 + 右对齐 y 轴标签；刻度 y 取 `Math.round(…)+0.5` 抗锯齿对齐。
- `drawXAxisLabels(ctx, frame, labels, textColor)` — 绘图区下缘居中排布 x 标签。
- `drawBars(ctx, frame, xs, series, bandDelta)` — 分组柱状图：组宽 = `bandDelta` 映射像素 ×0.7（最小 2px），多序列均分组宽并按槽位居中偏移；每值从 0 线向上/向下画（正负皆可）。
- `drawLineSeries(ctx, frame, points, series)` — 可选 areaPath 填充 + 折线描边（round join/cap）。注意固定 `linePath(points)` 不传 smooth——canvas 折线恒为直线段。
- `drawCrosshair(ctx, frame, x, dots, background, textColor)` — 垂直准线（textColor @0.4）+ 每序列数据点双圈（外 3.5px 背景色、内 2.5px 序列色）。
- `drawSelection(ctx, frame, startPx, endPx, accent)` — 框选高亮：accent @0.08 矩形 + 两边缘竖线 @0.5；宽度 ≤2px 不画（视为误触）。

## app/ui/utils/use-chart-palette.ts（236 行）
CSS 变量 → 图表色板 hook，内嵌完整 sRGB↔OKLCH 色彩数学（约 150 行，无 third-party 色彩库）。被 chart / donut / radar 消费。常量：读 `--color-primary` / `--color-background`、默认 8 色、最小对比度 3、无彩色主色时兜底色相 250、金色角 137.508°（色相均匀散布）。

**私有（色彩数学）**
- `srgbToOklch` / `oklchToSrgb` — 线性化 + OKLab 矩阵正逆变换。
- `inGamut`（±1e-4 容差）/ `relativeLuminance` / `contrast`（WCAG 对比度）。
- `clampChroma` — 16 轮二分把 chroma 压入 sRGB 色域。
- `parseOklch` / `parseRgb`（含 `%` 分量）/ `parseSrgbColor` / `parseColor` — 从 getComputedStyle 文本解析颜色（三格式级联，失败返 null）。
- `readVarColor(name, fallback)` — 临时 span 探测 CSS 变量（与 chart-paint.readThemeColor 同一套探针手法，各自独立实现）；SSR 或解析失败按 fallback 返回纯黑/白。
- `buildPalette(primary, background, mode, count)` — `mono`：7 个亮度候选先按对比度 ≥3 过滤，× `[1, 0.5]` 两档 chroma 出序色；`wheel`：金色角散布色相，按背景明暗切换亮度/饱和策略，逐色 clampChroma。
- `computePalette` / `sameColors` — 组装与浅比较（值未变时复用旧数组避免多余渲染）。
- `buildSameFamilyShades(count)` — 单色相 pale→strong 渐变（明暗背景各有 l/c 参数对）。

**导出**
- `ChartPaletteMode = "wheel" | "mono"`、`ChartPaletteOptions { mode?, count? }`。
- `useChartPalette(options?): string[]` — 初始即计算；MutationObserver 监听 `documentElement` 的 `class/style/data-brand/data-surface` 属性变化重算（与 use-theme.applyTheme 写入的属性一一对应）。
- `useSameFamilyShades(count): string[]` — 同款 observer 模式的单色族渐变版。

## app/ui/utils/use-theme.ts（153 行）
主题全局状态：模块级单例 store + `useSyncExternalStore`（brand / surface / theme 三通道独立订阅）。模块在浏览器环境首次 import 时即执行 `loadFromStorage()` + `applyTheme()` 并挂系统暗色监听（`theme==="system"` 时系统切换会实时生效并通知）。

**私有**
- 常量：`STORAGE_KEY = "theme-storage"`、默认 brand/surface 空串、默认 theme `"light"`；模块级可变单例 + 三个 listener Set。
- `loadFromStorage` / `saveToStorage` — localStorage JSON 存取；解析失败 console.error 兜底。
- `notifyBrand/Surface/Theme` — 通道通知。
- `getSystemColorScheme` — matchMedia `prefers-color-scheme: dark`。
- `applyTheme` — 写 `<html>` 的 `data-brand` / `data-surface` 属性 + `dark` class + `style.colorScheme`（use-chart-palette 的 observer 正是监听这些）。
- `subscribe×3` / `get×Snapshot` / `get×ServerSnapshot` — useSyncExternalStore 三件套 ×3 通道；SSR snapshot 恒为默认值。

**导出**
- `ThemeMode = "light" | "dark" | "system"`。
- `useTheme(): ThemeState` — 返回 `{ brand, surface, theme, setBrand, setSurface, setTheme, toggleTheme }`；setter 均为「改单例 → 存储落盘 → applyTheme → notify」；`toggleTheme` 从 system 出发时按系统实际明暗取反（而非盲目翻转）。

## app/ui/utils/use-upload-monitor.ts（98 行）
XMLHttpRequest 上传监控 hook（Upload 组件的网络进度配套，按 AGENTS.md 约定与组件解耦）。**缺 `"use client"`**（同类 hooks 仅此三者缺之一，见文末发现）。

**类型**
- `UploadMonitorStatus = "pending" | "uploading" | "success" | "error"`。
- `UploadMonitorItem { uid, file, status, progress }`。
- `UseUploadMonitorOptions { action, fieldName="file", headers?, withCredentials?, data? }`。

**`useUploadMonitor(options)` → `{ fileList, acceptFiles, removeItem, clearAll }`**
- 内部：`optionsRef` 持最新 options 避免闭包过期；`xhrsRef`（uid→xhr Map）；卸载时置 `mountedRef=false` 并 abort 全部。
- `acceptFiles(items)` — 入参 `{ uid, file, signal }[]`；uid 已存在跳过（防重复上传）；FormData 按 fieldName + data 附加字段组装；`upload.onprogress` → uploading + 百分比；`onload` 2xx → success/100 否则 error；`onerror`/`onabort` → error；外部 `signal` abort 联动 `xhr.abort()`（`{ once: true }`）；随即 send。
- `removeItem(uid)` — abort + 删 Map + 移出列表；`clearAll()` — 全部 abort + 清空；两者均经 mountedRef 防卸载后 setState。

## app/ui/utils/use-virtual-scroll.ts（94 行）
固定行高虚拟滚动计算 hook。
- 类型：`VirtualScrollAlign = "start" | "center" | "end"`；`UseVirtualScrollOptions { itemCount, itemHeight, visibleCount=5, overscan=5, onScroll? }`；`UseVirtualScrollResult`。
- `useVirtualScroll(options)`：
  - 容器高度 = `visibleCount × itemHeight`（纯计算值，非实测）；`totalHeight = itemCount × itemHeight`。
  - `startIndex/endIndex` — scrollTop 换算 ± overscan，clamp 到 `[0, itemCount]`；`visibleItems: { index, top }[]`（top 供绝对定位）。
  - `containerProps { ref, style: { height }, onScroll }` — 摊开到滚动容器。
  - `scrollToIndex(index, align)` — 三种对齐换算 scrollTop，clamp 到 `[0, totalHeight-containerHeight]`；`scrollToTop` / `scrollToBottom`。
- 局限：仅支持固定行高（无动态测量）；容器高度不响应 viewport 实际尺寸。

## app/ui/utils/use-remote-pagination.ts（86 行）
远程数据源「搜索 + 增量分页」hook（Combobox 远程搜索配套）。**缺 `"use client"`**。
- `RemotePaginationFn` — `(params: { page, size, keyword }) => Promise<{ list: string[]; total }>`；注意 list 固定 `string[]`，未泛型化。
- `useRemotePagination({ fetcher, debounceMs=300, pageSize=20 })` → `{ data, loading, isSearching, hasMore, search, loadMore, reset }`：
  - `fetch(keyword, nextPage, append)`（私有）— `fetchingRef` 单飞锁：请求进行中新调用被**静默丢弃**（不排队、不取消旧请求）；`append=true` 追加否则替换；`hasMore = 累计条数 < total`（在 setData updater 内调用 setHasMore）；finally 中仅 mounted 时复位 loading/fetchingRef。
  - `search(keyword)` — debounce 后 `fetch(keyword, 1, false)`（isSearching=true 标记搜索态）；`loadMore` — 按当前关键词取 `page+1` 追加；`reset` — 清空全部状态。
  - `fetcherRef` 每渲染同步最新 fetcher（回调免依赖）。

## app/ui/utils/use-remote-sort.ts（75 行）
远程排序状态 hook（Table 远程模式配套）。
- 类型：`RemoteSortDirection = "asc" | "desc"`；`RemoteSortState<K> = { key, direction } | null`；`UseRemoteSortOptions { sortableKeys, onSortChange?, debounceMs=0, cycle="asc-desc"|"asc-only", initialSort=null }`；`UseRemoteSortReturn`。
- `useRemoteSort<K>(options)` → `{ sort, toggleSort, setSort, clearSort, queryParams, queryString }`：
  - effect：sort 变化 → debounce 后回调 `onSortChange`（timer 防抖，卸载/重跑前清理）；注意 **`initialSort` 非 null 时挂载即回调一次**。
  - `toggleSort(key)` — 不在 `sortableKeys` 直接忽略；新列 → asc；同列循环 `asc→desc→null`（`asc-only`：`asc→null`）。
  - `queryParams { sortKey?, sortOrder? }` / `queryString`（key 经 encodeURIComponent）。
  - effect 依赖 `sort?.key / sort?.direction`（拆字段，避免对象引用抖动）。

## app/ui/utils/use-pagination.ts（73 行）
分页状态机（Pagination 组件配套；AGENTS.md「state belongs to usePagination (base: 1)」）。
- `UsePaginationOptions { base=0, total: number | (() => number), loop=false, onChange? }`。
- `usePagination(options)` → `{ index, total, setIndex, goTo, next, previous, isFirst, isEnd, toFirst, toEnd }`：
  - 内部 0 基存储，对外按 `base` 换算；`normalize` — total≤0 恒 0，loop 环绕取模，否则 clamp。
  - `setIndex` 支持数值或函数式更新（函数接收外部页码）；仅实际变化时 emit `onChange`。
  - effect：`total`（或 normalize 依赖）变化后对当前 index 重新归一，越界回落并 emit。
  - `isFirst`/`isEnd` 在 loop 模式恒 false。
  - **实现注意**：`emit(onChange)` 在 `setIndexRaw` 的 updater 函数内调用——updater 内含副作用，StrictMode 双调用下 onChange 可能触发两次（见文末发现）。

## app/ui/utils/use-drag.ts（72 行）
Pointer 拖拽生命周期 hook。**缺 `"use client"`**。
- `DragInfo { dx, dy, clientX, clientY }`；`UseDragOptions { disabled?, onDragStart?(e), onDragMove?(info), onDragEnd?(info) }`。
- `useDrag(opts)` → `{ isDragging, handlePointerDown }`：
  - pointerdown：disabled 判断 + preventDefault + 对 `e.target` setPointerCapture + 记录起点/pointerId；在 document 上挂 pointermove/pointerup（依赖 pointer capture 保证拖出元素仍跟踪）。
  - move：按 pointerId 过滤，回报 `{ dx, dy, clientX, clientY }`。
  - up：releasePointerCapture + 移除监听 + `onDragEnd`。
  - **无 `pointercancel` / `lostpointercapture` 处理**（见文末发现）；组件卸载时不主动摘除 document 监听（拖拽中卸载则监听器残留至 pointerup）。

## app/ui/utils/use-floating-panel.ts（53 行）
原生 `popover="manual"` 面板生命周期 hook（Select 的底座）。
- `UseFloatingPanelOptions { open?, panelRef, onOpenChange?, anchorRef?, restoreFocus=false, focusOnOpen=false }`。
- `useFloatingPanel(options)`：
  - effect(open)：开 → `panel.showPopover()` + 记录先前焦点元素；`focusOnOpen` 时聚焦面板内第一个可聚焦元素（选择器枚举 button/[href]/input/select/textarea/[tabindex]，兜底面板本身）。关 → `hidePopover()`；`restoreFocus` 时仅当焦点将丢失（active 为 null/body 或仍在面板内）才还原先前焦点；随后清记录。
  - effect(open)：开时挂 document mousedown —— 点击落在 panel 或 anchor 之外 → `onOpenChange(false)`（回调经 ref 取最新，无过期闭包）。
  - 注意：manual popover 无原生 light-dismiss/Esc 行为，关闭全靠该 hook 的外点监听 + 调用方自行处理 Esc。

## app/ui/utils/use-combobox.ts（53 行）
列表键盘导航 hook（Combobox / Command 共用）。
- `UseComboboxOptions<T> { open, items: T[], isItemDisabled?, onSelect?(item, index) }`。
- `useCombobox<T>(options)` → `{ highlightIndex, setHighlightIndex, handleKeyDown, reset }`：
  - 私有 `move(delta)` — 先过滤禁用项，在「可用项序列」中循环移动（到尾回首/到头回尾）；初始 null 落第一个可用项；当前高亮不在可用序列（如被禁用）时 `findIndex` 为 -1，向下落到头、向上落到尾——行为合理。
  - `handleKeyDown` — open=false 或空列表直接忽略；ArrowDown/Up preventDefault + move；Enter 且高亮存在 → 禁用项不触发、否则 `onSelect(item, index)`。
  - `reset` — 高亮清 null（输入变化后由调用方调用）。

## app/ui/utils/use-load-more.ts（49 行）
IntersectionObserver 增量加载 hook。
- `UseLoadMoreOptions { total, pageSize=12, initialCount?, onLoadMore?(visibleCount), rootMargin="400px", enabled=true, root? }`。
- `useLoadMore(options)` → `{ visibleCount, hasMore, loadMore, sentinelRef }`：
  - `visibleCount` 初始 `min(initialCount ?? pageSize, total)`；`hasMore = visibleCount < total`。
  - `loadMore` — +pageSize clamp total，实际增加时回调 `onLoadMore(next)`（经 ref 取最新）。
  - `sentinelRef` — ref callback 存哨兵元素；effect 建立 observer（root 取 `rootRef.current`，传入 rootRef 但其 current 尚空则不建立）。
  - 注意：effect 依赖含 `visibleCount/hasMore/sentinel/enabled` 等，root 后到时通常能借 visibleCount 变化重跑补救，但若 root 迟迟挂载且上述值不变，observer 不会建立（轻微时序缺口，见文末）。

## app/ui/utils/use-image-status.ts（32 行）
图片预加载三态 hook（Avatar / Image 底座）。
- `ImageStatus = "loading" | "success" | "failure"`。
- `useImageStatus(src?)` — src 为空直接 failure；否则 `new Image()` 预加载，onload/onerror 经 `React.startTransition` 降优先级更新（避免加载态切换挤占交互）；换 src/卸载时 `isActive=false` + 清空 handler 防过期回调。

## app/ui/utils/trap-tab-key.ts（24 行）
焦点圈定纯函数（Dialog / Drawer 消费；无 hooks，无需 "use client"）。
- `trapTabKey(e, container)` — 非 Tab 或无 container 直接返回；收集 container 内「可聚焦且可见」元素（选择器枚举 + `offsetParent !== null` 过滤）；零元素时 preventDefault（焦点不出逃也不动）；Shift+Tab 在第一个（或焦点本就在容器外）→ 移到最后；Tab 在最后（或容器外）→ 移到第一个。
- 注意：`offsetParent` 对 `position: fixed` 元素恒为 null——容器内若有 fixed 定位的可聚焦元素会被误判不可聚焦（见文末发现）。

## app/ui/utils/use-panel-focus.ts（21 行）
输入框 → 面板的焦点迁移 hook（DatePicker 消费）。
- `UsePanelFocusOptions { open, panelRef }`。
- `usePanelFocus(options)` — 返回 onKeyDown 回调：open 且 ArrowDown/Up 时 preventDefault，聚焦面板内第一个（Down）/最后一个（Up）可聚焦元素，兜底面板本身。与 use-floating-panel 的 focusOnOpen 选择器口径一致。

---

## 审核发现（按严重度排序）

1. **三个 hooks 文件缺 `"use client"`**：`use-drag.ts`、`use-remote-pagination.ts`、`use-upload-monitor.ts`——同目录其余 11 个 hooks 文件全部有该指令。本项目按文件为单位经 CLI 注册表分发，使用者单文件安装后若直接在 Server Component 中调用会触发构建错误。属一致性缺口，建议补齐。（注：tsx 组件层同样存在有无混杂——avatar 有、button/checkbox 无——source-audit.md 已记录为既有状态，疑与 CLI 分发管线约定有关，建议一并对齐。）
2. **use-pagination：updater 内副作用**。`setIndex` 在 `setIndexRaw` 的 state updater 里调用 `emit(onChange)`（#L27-L41）。React 要求 updater 为纯函数；StrictMode 开发态 updater 双调用会导致 onChange 触发两次。建议把比较与 emit 移到 updater 外（或改用 effect 比对）。
3. **use-remote-pagination：单飞锁静默丢请求**。`fetchingRef` 进行中新调用被直接丢弃（#L35-L38）。debounce 300ms 后仍可能撞上在途请求——最后一次搜索可能不生效且无任何补偿（不排队、不取消、不重试）。另外 `setHasMore` 在 `setData` updater 内调用（#L45-L49），同发现 2 的反模式（此处幂等，危害小）。
4. **use-drag：无 pointercancel 处理**。触摸场景被系统手势打断、或 capture 意外丢失时，pointerup 可能不触发——document 监听器残留、`isDragging` 卡 true、`onDragEnd` 缺席。建议补 `pointercancel`（及可选 `lostpointercapture`）走同一收尾路径。
5. **trap-tab-key：`offsetParent` 过滤误伤 fixed 元素**。`position: fixed` 元素 offsetParent 恒为 null，会被判为不可聚焦而从 Tab 环中剔除（#L5）。Dialog 内若出现 fixed 悬浮件（如吸底操作栏）将无法 Tab 到。可用 `getComputedStyle` 检查 visibility/display 或 `checkVisibility()` 替代。
6. **CSS 变量探针与颜色解析双份实现**。`chart-paint.readThemeColor` 与 `use-chart-palette.readVarColor` 各自实现了「临时 span 探测 + none→0 兜底」，后者还多一套 oklch/rgb/srgb 解析器（~120 行）。可下沉为共享模块；不阻塞分发（两者均被消费）。
7. **use-remote-sort：挂载即回调**。`initialSort` 非 null 时，onSortChange 的 effect 在挂载首轮即触发一次（#L35-L52）。对「仅用户操作才应请求后端」的场景是隐式多一次请求，文档未提示。
8. **use-load-more：root 后到不建 observer**。传入 `rootRef` 但其 current 首轮为 null 时 effect 直接返回（#L38-L39），root 晚挂载且 visibleCount 等依赖不变则不会重试。低概率（root 通常是已渲染容器），记录备查。
9. **use-theme：setter 引用不稳定**。`setBrand/setSurface/setTheme/toggleTheme` 每次渲染重建（无 useCallback），返回对象恒为新引用；消费方做 memo/依赖数组时需注意。功能无碍。
10. **use-upload-monitor：abort 与 error 不分**。onabort 同样置 `status: "error"`（#L78），上层无法区分「用户取消」与「真失败」；另不读响应体，2xx 即成功。符合轻量定位，记录为已知取舍。
11. **use-virtual-scroll：容器高度为计算值**。`visibleCount × itemHeight` 而非实测，viewport 实际高度与之不符时会出现空底/裁切；仅支持固定行高。文档如未声明应补。
12. **chart-kit 时间刻度两处边界**：target 介于 12h~24h 时步长从 43200s 直接跳到 86400s（SUB_DAY_STEPS 上限 12h，刻意取舍）；`dayTicks` 会保留早于 min 不超过 1 天的前置刻度（窗口左缘覆盖，刻意）。均为设计选择，无需改动，供审核知悉。
13. **纯风格**：`components/index.ts` 导出顺序非字母序；`use-remote-pagination` 的 `data` 类型固定 `string[]` 未泛型化（与 fetcher 签名一致，如未来支持对象列表需改签名）。

## 内部引用关系（哪些 ts 文件被库内消费）

| 文件 | 库内消费者（tsx） | 外部配套文档 |
|---|---|---|
| cn | 全库 | — |
| chart-kit | chart、chart-paint、donut、radar、sparkline | content/docs/utils/ |
| chart-paint | 仅 chart | 同上 |
| use-chart-palette | chart、donut、radar | 同上 |
| trap-tab-key | dialog、drawer | 同上 |
| use-combobox | combobox、command | 同上 |
| use-floating-panel | select（及 picker 系） | 同上 |
| use-panel-focus | date-picker | 同上 |
| use-image-status | avatar、image | 同上 |
| use-remote-pagination | combobox（远程模式） | 同上 |
| use-drag / use-load-more / use-pagination / use-remote-sort / use-theme / use-upload-monitor / use-virtual-scroll | 库内零引用（文档/demo 配套，分发场景保留） | content/docs/utils/ 各有页面 |
