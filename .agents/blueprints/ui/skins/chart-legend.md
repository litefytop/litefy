# ChartLegend 皮肤（app/ui/skins/chart-legend.tsx）

1. 角色：root 换行 flex 行（`justify-center` 居中、`gap-x-4`）；item 为可点行（`min-h-control` 命中、`aria` 由骨架发、`text-foreground` 文字色）——text 角色惯例，hover 加下划线（行必有文字；不换色、不铺底色），不声明按压（text 角色零按压反应）；`data-hidden` 时 40% 折显；swatch 两态一类：`data-shape="line"` 细条 / `"square"` 方块。
2. 色样不带边框：方形色样 size-2.5 纯色即内容，neo 的 2px 框会吃掉大半色面——line 形态同样纯色胶囊。
3. 色块底色来自运行期色板（骨架内联），是外观通道的已注明例外，皮肤不持色值。
4. 类串同时导出（`chartLegendClasses` / `chartLegendPartClasses`）：Chart 组合经 `classNames.legend` 内嵌图例时直接消费，不经组件入口。
5. 专属令牌：无。
