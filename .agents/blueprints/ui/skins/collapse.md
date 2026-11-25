# Collapse 皮肤（app/ui/skins/collapse.tsx）

1. 根框：纵向栈，`rounded-md` 圆角 + `border-frame` 描边 + `bg-surface-raised` 凸起档背景色配 `text-surface-raised-fg` 前景（可点控件面归凸起，见 `ui/schemes/elevation.md`）+ `shadow-surface` 阴影；带 `group` 标记，chevron 与面板经 `group-data-[duration=*]` 读业务时长档。
2. 触发行：`min-h-control` 命中，两端对齐，`px-3 py-3` 内边距，`text-sm` + `control-label`；仅收起态接 hover（`aria-[expanded=false]:hover` 吃 `accent` 背景档（并写它的配对前景 `accent-fg`）——可点行法则，与菜单/列表行同源）——展开的行头不吃悬停染色；`focus-visible:focus-ring` 焦点环。
3. chevron：`size-4`，展开转 -180°（`data-[open=true]`），时长随业务档（`duration-md` 兜底、`group-data-[duration=*]` 覆写）。
4. 面板：`grid-template-rows` 过渡展开（`ease-frame`，时长同随业务档）。
5. 内容体：`border-t-hair` 上分隔 + 底色方案自答 + `p-4` 内边距，`text-sm` + `leading-body` + `font-medium`。
6. 共享类串：皮肤导出 `collapseFrameClasses`（根框骨架串，不含阴影）、`collapseRootClasses`（根框串，骨架叠加 `shadow-surface` 面层阴影）、`collapseItemClasses`（条目并入外根：`rounded-none border-0` + `not-last:border-b-hair` 下分隔、末项无线）、`collapsePartClasses`（触发行/chevron/面板/内容体四槽）供派生皮肤（手风琴）复用；面层阴影只归外根，条目不各自带阴影。
7. 禁用态：根使用禁用背景色与禁用文字色，阴影保持根框原有的 `shadow-surface`，不新增禁用阴影；trigger 使用禁止光标且不保留 hover / focus-visible 染色；body 使用禁用文字色；面板与 chevron 保留开合几何。
8. 专属令牌：无。
