# SegmentGroup 皮肤（app/ui/skins/segment.tsx）

1. 组合（默认与 primary 变体）：壳与选项共一框——壳 `rounded-sm` 收角 + `border-frame border-border` 描边 + `shadow-surface` 静止阴影 + `background` 底色 + 框距 `p-well`（方案井框距，0 即条目贴合壳缘）；条目零间距贴合（组内无 gap），条目 `rounded-none`，圆角由壳独占；条目 44 命中（`min-h-control`）并自带 `px-3` 横向内边距。
2. 变体（`variant`，可选 `"primary" | "text"`，缺省为指示块形态）：
   - 缺省：壳上叠一枚滑动指示块衬底选中项。
   - `primary`：指示块底色转 `primary`、描边 `border-frame border-border`，选中项（`aria-checked`）文字转 `primary-fg`。
   - `text`：无壳无指示块；条目走等宽网格（`grid w-fit grid-flow-col auto-cols-fr`，列宽取最宽项，吸收选中加粗的宽度变化保零位移）；条目基态 `font-label`，选中项文字转 `primary` + `underline`（`underline-offset-4`）+ `font-strong`。
3. 指示块：`rounded-sm` + 底色 `bg-surface` 与边框 `border-frame border-border` + `shadow-subtle`；矩形经测量内联（translate 到选中项的 offset / 尺寸——运行期几何、类表达不了，内联例外注明；骨架不接管，皮肤自测）。层序夹层：壳底色 < 指示块（`z-10`）< 条目（`relative z-20`）——壳有了不透明底色后，指示块必须浮在壳上、条目文字再浮在指示块上。
4. 指示块动画：位移 200ms `ease`（皮肤自持 `MOTION` 常量，不走 `motion-frame` 束）；宽高不在过渡属性之列，尺寸变化直接落位（布局属性不入动画，motion.md 性能预算）。
5. 条目文字：`text-sm` + 最重字重（text 变体按第 2 条降为 `font-label` 基态）+ `case-label tracking-label` + `surface-fg` 文字色；hover（非禁用、未选中）：缺省与 primary 变体换 `accent` 背景对（背景色 + 前景色一起转 `accent` 对），text 变体换 `accent` 文字色；禁用 `cursor-not-allowed` + 压暗。
6. 专属令牌：无。
