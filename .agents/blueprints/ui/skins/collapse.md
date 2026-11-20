# Collapse 皮肤（app/ui/skins/collapse.tsx）

1. 根框：纵向栈，`rounded-md` 圆角 + `border-frame` 描边 + `background` 背景色 + `shadow-surface` 阴影；带 `group` 标记，chevron 与面板经 `group-data-[duration=*]` 读业务时长档。
2. 触发行：`min-h-control` 命中，两端对齐，`px-3 py-3` 内边距，`text-sm` + `font-label` 档 + label 两项；仅收起态接 hover（`aria-[expanded=false]:hover` 换 `accent` 对——可点行法则，与菜单/列表行同源）——展开的行头不吃悬停染色；`focus-visible:focus-ring` 焦点环。
3. chevron：`size-4`，展开转 -180°（`data-[open=true]`），时长随业务档（`duration-md` 兜底、`group-data-[duration=*]` 覆写）。
4. 面板：`grid-template-rows` 过渡展开（`ease-frame`，时长同随业务档）。
5. 内容体：`border-t-hair` 上分隔 + 底色方案自答 + `p-4` 内边距，`text-sm` + `leading-body` + `font-medium`。
6. 共享类串：皮肤导出 `collapseRootClasses`（根框）、`collapseItemClasses`（条目并入外根：`rounded-none border-0` + `not-last:border-b-hair` 下分隔、末项无线）、`collapsePartClasses`（触发行/chevron/面板/内容体四槽）供派生皮肤（手风琴）复用。
7. 专属令牌：无。
