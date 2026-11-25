# SegmentGroup 皮肤（app/ui/skins/segment-group.tsx）

1. 变体 prop `variant?: "borderless" | "bordered" | "well"`，缺省 `bordered`；变体属皮肤层，骨架不变。
2. bordered（描边壳 + 选中主题色块，外观与动效面板 ChoiceGroup 同款）：壳为等宽网格（`grid w-fit grid-flow-col auto-cols-fr`，列宽取最宽条目，子项 `min-w-0`，与 Group 同式）+ 组距 `gap-1`（选中块各自成块，不拼接）+ `rounded-md` 收角 + `border-hair border-border` 描边 + `p-1` 框距；壳透明不铺底色；条目复用按钮文字变体形态（`buttonVariants.text` + `min-w-0 rounded-sm`，形态复用引用既有变体再叠加差异；高度恒 `h-control` 由按钮帧自带，单行网格 + 不换行无压缩路径，不叠 `min-h-control`，用户定 2026-11-24），选中项经 `aria-checked` 变体转 primary 对（`border-control` + `border-border` + `bg-primary` + `text-primary-fg` + `shadow-frame`，hover 转 `primary-accent`）；无滑动指示块。
3. borderless（无边框）：无壳无边框——条目走等宽网格（`grid w-fit min-w-control grid-flow-col auto-cols-fr`，列宽取最宽条目），条目组装 Segment 原子脸（`segmentVariants`，见 `ui/skins/segment.md`）；选中 = primary 背景色 + primary-fg 前景色（无加粗、无下划线，选中标记即色块）；无 hover（2026-11-20 用户裁定）。
4. well（有纵深）：井容器——等宽网格（`grid w-fit min-w-control grid-flow-col auto-cols-fr *:min-w-0`）+ `rounded-lg` + `border-frame border-border` + `bg-well` 井底 + `p-1.5` 框距 + `shadow-well` 井内阴影；条目为文字钮（px 基础档 + `control-text` + `text-foreground`，整档捆绑同 button 帧，用户定 2026-11-24），圆角读 `--radius-well-inner` 派生令牌（与框距 `p-1.5` 成对，式见 delivery `references/skin-rules.md` 第 17 条）；选中项凸起为 primary 对（`bg-primary` + `text-primary-fg` + `shadow-subtle`），hover 转 `primary-accent`；未选中 hover（非禁用）吃 accent 背景档（并写它的配对前景 `accent-fg`）。
5. 动效：无指示块即无位移动画；选中态切换为颜色 / 阴影瞬时对调，过渡走 `motion-frame`（bordered 经按钮变体自带，borderless / well 条目显式挂）。
6. 条目按 `disabled` 选择独立禁用类串，替换正常颜色与 hover / active 类并挂 `cursor-not-allowed`；bordered 使用 `buttonVariants.disabled`，保留按钮几何与禁用阴影。
7. 专属令牌：无。
