# Pagination 皮肤（app/ui/skins/pagination.tsx）

1. 条根：`@container` 查询容器 + 单行 `flex`（永不换行、永不超出容器宽度），簇间距 `gap-2`，带概要行放宽到 `gap-3`。双形态互斥（容器查询裁决，hidden 分支不进焦点序与朗读树）：容器 `≥ 28rem` 显完整形态、`< 28rem` 显紧凑形态。
2. 完整形态（controls）：前后翻页钮（nav）+ 页码行 + 前后翻页钮；nav 为 text 角色按钮 + `px-0`（纯图标形态）+ `text-sm`，箭头 `size-4`（icon 默认 16px）；hover 随 text 角色加下划线。
3. 页码钮：text 角色按钮 + `px-0` + 等宽数字（`tabular-nums`）+ `text-sm`，hover 加下划线；当前页由 `aria-[current=page]` 直答：文字转 `primary` + 最重字重（`font-strong`）+ 下划线，不改背景色；动效束随按钮档。
4. 省略号：控件方格（`size-control min-w-control`）无按钮框，`surface-fg` 文字色 + `size-4` 图形——与两侧页码同盒同高。
5. 概要行：完整形态专属（窄形态隐藏）——`grow min-w-0 truncate`，空间不足时省略号收尾、绝不允许溢出容器；骨架在 summary 为字符串时自动挂 `title` 全文，悬停可读完整内容。
6. 紧凑形态（compact，窄形态，纵向两行）：第一行 = 概要（`compactSummary`：`truncate` + `title` 全文，与完整形态同源同款）；第二行 = 首 / 前 / **页码输入框** / 总页数 / 后 / 末——输入框 `w-11`（11 单位）居中 + `tabular-nums` + 数字键盘（`inputMode="numeric"`），Enter / 失焦提交并钳制 1..N、非法回退当前页，`focus-visible:focus-ring`；总页数文本 `surface-fg`。跳页本质是输入问题（页码是连续 1..N，无浏览需求），不用 Select / Combobox。
7. 专属令牌：无。

（neo 阴影）页码数字盒挂 shadow-frame（bg 同步改 surface 承影），minimal 无此工具类不渲染。
