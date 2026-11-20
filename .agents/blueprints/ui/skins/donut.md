# Donut 皮肤（app/ui/skins/donut.tsx）

1. 组合（自上而下）：根（`w-full`）+ SVG（`mt-2` 居中、`max-w-64` 上限、溢出可见）+ 扇区 + 中心读数 → 图例（ChartLegend 皮肤整包，居中）。
2. 扇区：`cursor-pointer`、无边（`stroke-0`），透明度过渡 `duration-sm`；`data-[dimmed=true]` 折到 35% 显——读数靠明暗不靠换色（图表数据编码豁免，Motion §6）；SVG 呈现属性以任意属性挂载，不走颜色工具类。
3. 中心读数：donut 变体盖住圆心（`absolute inset-0`）、pie 变体落在盘下（`h-12`）；label `text-xs` + `font-label` 档 + label 两项 + `surface-fg` + 截断，value `text-h3` + `leading-head` + 最重字重 + `foreground`；整块 `pointer-events-none` 不挡扇区。
4. 专属令牌：无（序列填色为运行期数据色，同 Chart 例外）。
