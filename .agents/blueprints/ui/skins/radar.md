# Radar 皮肤（app/ui/skins/radar.tsx）

1. 组合（自上而下）：根（`w-full`）+ SVG（`mt-2` 居中、`max-w-72` 上限、溢出可见）→ 网格 + 轴标签 + 序列多边形 → 图例（ChartLegend 皮肤整包，居中）。
2. 网格：环与辐条发丝线（`stroke-[0.5px]`）+ `border` 描边色；最外环加粗闭合（`data-[outer=true]:stroke-1`，桌面档同值）；轴标签 `fill-foreground` + `text-xs` + label 声（`control-label`）。
3. 序列多边形：14% 洗色填充（`fill-opacity` 以任意声明挂载，不走颜色工具类）+ `stroke-[1.5px]` + 圆角拐点（`stroke-linejoin:round`）；hover 折到 28% 洗色（`data-[hovered=true]`）、失焦折到 35% 显（`data-[dimmed=true]`）——读数靠明暗不靠换色（图表数据编码豁免，Motion §6）；透明度过渡 `duration-sm`。
4. 专属令牌：无（序列填色为运行期色板，同 Chart 例外）。
