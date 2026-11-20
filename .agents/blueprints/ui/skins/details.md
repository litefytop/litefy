# Details 皮肤（app/ui/skins/details.tsx）

1. 根框（`<details>`）：与 collapse 根框同形——纵向栈、`group` 标记、`rounded-md` 圆角 + `border-frame` 描边 + `background` 背景色 + `shadow-surface` 阴影。
2. 触发行（`<summary>`）：`min-h-control` 命中，两端对齐，`px-3 py-3`，`text-sm` + `font-label` 档 + label 两项；去除原生 marker（`list-none` + `[&::-webkit-details-marker]:hidden`）；仅收起态接 hover（`group-not-open:hover` 换 `accent` 对，同可点行法则）——展开的行头不吃悬停染色；`focus-visible:focus-ring` 焦点环。
3. icon 盒：`size-4`，`group-open:-rotate-180` 随原生 open 态翻转，`duration-md` 时长——纯 CSS，零 JS。
4. 内容体：`border-t-hair` 上分隔 + `p-4` 内边距，`text-sm` + `leading-body` + `font-medium`。
5. 开合为瞬时（原生无过渡）；`::details-content` 渐进增强动画记入待定项，v1 不实现。
6. 专属令牌：无。

## 待定项

- `::details-content` 过渡动画（新 Chromium）：待基线放宽后接入，届时只加皮肤类串，骨架无需改动。
