# SegmentGroup 皮肤（app/ui/skins/segment-group.tsx）

1. 组合（primary 变体，壳与选项共一框，外观与动效面板 ChoiceGroup 同款）：壳为等宽网格（`grid w-fit grid-flow-col auto-cols-fr`，列宽取最宽条目，子项 `min-w-0`，与 Group / ToggleGroup 同式）+ 组距 `gap-1`（选中块各自成块，不拼接）+ `rounded-md` 收角 + `border-hair border-border` 描边 + `p-1` 框距；壳透明不铺底色。
2. 变体（`variant`，可选 `"primary" | "text"`，缺省 `"primary"`）：
   - primary：无滑动指示块——条目复用按钮文字变体形态（`buttonVariants.text` + `min-h-control min-w-0 rounded-sm`，形态复用引用既有变体再叠加差异），选中项经 `aria-checked` 变体转 primary 对（`border-control` + `border-border` + `bg-primary` + `text-primary-fg` + `shadow-frame`，hover 转 `primary-accent`）。
   - text：无壳无指示块——条目走等宽网格（`grid w-fit min-w-control grid-flow-col auto-cols-fr`，列宽取最宽条目），条目组装 Segment 原子脸（`segmentVariants`，见 `ui/skins/segment.md`）；选中 = primary 背景色 + primary-fg 前景色（无加粗、无下划线，选中标记即色块）；无 hover（2026-11-20 用户裁定）。
3. 动效：无指示块即无位移动画；选中态切换为颜色 / 阴影瞬时对调，过渡走 `motion-frame`（按钮 frame 自带）。
4. hover：primary 变体按按钮变体自带 hover（未选中 hover 下划线、选中 hover 转 `primary-accent`）；text 变体无 hover（2026-11-20 用户裁定去除）。
5. 条目禁用压暗走 `disabled:dim` 自答（`dim` 契约见 `ui/schemes.md` 第 8 条⑥）；primary 经按钮变体自带禁用形态（描边转虚线 + 阴影复位）。
6. 专属令牌：无。
