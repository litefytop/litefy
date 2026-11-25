# Pagination 皮肤（app/ui/skins/pagination.tsx）

1. 条根：`@container` 查询容器 + 结构车道 `w-full min-w-0`（`container-type: inline-size` 让容器宽度与内容无关，根禁 `w-fit`——`w-fit` 时根宽实测归 0，容器查询永不命中、页码档永不出现在任何浏览器）；`flex flex-wrap items-center justify-between gap-y-2`，簇间距 `gap-x-2`、带概要行 `gap-x-3`。controls 盒 `min-w-0 flex flex-wrap items-center gap-x-2 gap-y-2`：概要 `shrink-0` 独占文本优先权，簇可收缩；容器比簇还窄时钮在簇内换行（实测 280px 容器下簇长高成两行），既保住 44px 命中区也不横向溢出。堆叠由 flex 换行的真实容纳判定裁决，不由容器档裁决——概要自然宽 + 当前档簇宽 + `gap-x-3` 不大于容器时单行（概要领左、簇靠右），大于容器时概要独占首行、簇独占次行，两条线都不裁剪文字。同一 590px 舞台在 minimal 下单行（232 + 12 + 283 = 527px）、在 neo 下两行（308 + 15 + 312 = 635px，概要走等宽粗体、钮间距更宽），换行不是缺陷、裁剪才是。元素查询不到自己，根上的容器类读的是外层舞台，形态类一律写在子件上。
2. 两档形态，由 Tailwind 容器档 `@3xl`（48rem = 768px）裁决，同一时刻只有一档可见（`hidden` 分支不进焦点序与朗读树）。以下全部是实测值（控件方格 44px、`gap-x-2` = 8px、`gap-x-3` = 12px 在 `--spacing: 0.25rem` 下，`siblingCount = 1`、总页数 12）：
   - 跳页档 `< @3xl`：翻页簇 `⏮ ‹ [输入] / 总 › ⏭`，实测 283px
   - 页码档 `≥ @3xl`：页码簇 `‹ 1 … n … 总 ›`，边缘页（3 枚页位 + 1 省略号）实测 304px、中间页（5 枚页位 + 2 省略号）实测 460px；首末钮与跳页件让位，首页、末页与总页数由页码列首末项承担（首末项恒渲染且可点）
   - 下界取「最宽页码簇 460px + 簇间距 12px + 概要预算 296px = 768px」正好落在标准档 `@3xl`：低于此宽时概要换行而不裁剪，故文档 demo 舞台（实测 590px）恒在跳页档，页码档只在更宽的宿主（全宽表格等）出现
3. 形态类名集中在皮肤常量、按形态分离：首末钮 `@3xl:hidden`、页码列 `hidden @3xl:flex`、跳页输入与总页数 `@3xl:hidden`；概要不带形态类（不定基、不截断）。消费方覆盖同名槽即改写形态，这是唯一的强制手段——组件不设形态 prop。
4. 页码档页码列：text 角色按钮 + `w-control px-0`（44px 方格命中区）+ `tabular-nums` + `text-sm`，hover 随 text 角色加下划线；当前页由 `[aria-current=page]` 直答：文字转 `primary` + 最重字重（`font-strong`）+ 下划线，不改背景色；动效束随按钮档。
5. 跳页档翻页钮（nav 与首末钮）：text 角色按钮 + `w-control`（44px 方格，图标居中由 `pure-icon` utility 作答，骨架钩子只发射属性）+ `text-sm`；禁用极由骨架 `disabled` 驱动，皮肤整串替换为 `text-disabled-fg` + `cursor-not-allowed` 并去掉 hover。
6. 省略号：控件方格（`size-control min-w-control`）无按钮框，`foreground` 文字色 + `size-4` 图形——与两侧页码同盒同高；非交互件，无 hover。
7. 概要行：`shrink-0 max-w-full text-sm leading-5 font-field text-foreground`——自然宽占位，与翻页簇挤不进同一行时整段挪到首行；概要自身比容器还长时 `max-w-full` 让它折行读完。不设省略号、不挂 `title`：`title` 在触屏与键盘通道都不显示（可操作律第 26 条），不能作为被裁文本的兜底。
8. 跳页输入：`w-11 shrink-0 rounded-sm border-hair border-border bg-surface-raised px-1 py-1 text-center text-sm leading-5 tabular-nums text-surface-raised-fg shadow-frame focus-visible:focus-ring`——输入框铺 `bg-surface-raised` 凸起档并配 `text-surface-raised-fg`（控件静置面归凸起，见 `ui/schemes/elevation.md`）；总页数读 `foreground`、`whitespace-nowrap tabular-nums`。跳页本质是输入问题，不用 Select / Combobox。
9. 页码列按 `siblingCount` 线性变宽（实测每 +1 增加 2 枚页位 + 间距 = 104px）：`siblingCount = 1` 中间页簇实测 460px、`= 2` 实测 564px；`@3xl` 档只保证前者与概要同行，后者按第 1 条把概要换到首行，要同行需 ≥ 564 + 12 + 300 = 876px 容器。不自动缩窗、不加滚动——`overflow` 裁剪焦点环，违反可操作律第 5 条。
10. 专属令牌：无。

（neo 阴影）页码数字盒挂 shadow-frame（背景色同步改 `surface` 承影），minimal 无此工具类不渲染。
