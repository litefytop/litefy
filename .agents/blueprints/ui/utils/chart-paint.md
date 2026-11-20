# chart-paint Canvas 绘制（app/ui/utils/chart-paint.ts）

1. 职责：Chart 的 canvas 绘制管线，把 chart-kit 的几何落到 2d context——纯绘制函数，不持有状态。
2. 主题色探测：`readThemeColor`（临时 span 探针读方案变量计算值，`none` 替换为 `0`，SSR 回退 fallback）。
3. 画布帧：`computePlotRect`（按 y 刻度标签实测宽度定左边距，固定上下右留白 10 / 26 / 12，返回绘图矩形）；`AXIS_FONT` 为坐标轴字体常量。
4. 绘制件：`drawYAxisGrid`（网格线 + 右对齐刻度文本）、`drawXAxisLabels`、`drawAxes`（x 底轴与 y 左轴两条脊线，半像素对齐 1px，网格之后、裁剪之前调用）、`drawBars`（分组柱，柱宽取组宽 0.7、组内均分）、`drawLineSeries`（面积填充 + 圆角拐点描线）、`drawCrosshair`（十字线 + 空心圆点）、`drawSelection`（拖拽缩放选区，双边缘线）；`fillWith` / `strokeWith` / `resetAlpha` 管理透明度。
5. 消费方：Chart；安装与 API 正本为 `content/docs/utils/chart-paint.zh.mdx`。
