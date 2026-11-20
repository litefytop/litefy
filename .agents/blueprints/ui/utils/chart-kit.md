# chart-kit 图表几何（app/ui/utils/chart-kit.ts）

1. 职责：图表 pure 几何与采样库，零依赖、零 DOM——坐标变换、路径生成、刻度计算、抽稀与命中全部是纯函数。
2. 坐标与路径：`polar`（角度→坐标）、`arcPath`（环/扇路径，整圆走双弧、`sweep <= 0` 回空串）、`donutLayout`（按可见值分扇，`gap` 为角度留白、小扇区留白折半）、`scaleLinear`（零跨度域回中值）、`linePath`（折线；`smooth` 走单调三次曲线，同号区间才弯曲、极值不过冲）、`areaPath`（折线闭合到底边）、`polygonPoints`。
3. 雷达族：`radarRings`（等距 `levels` 圈）、`radarSpokes`、`radarPolygon`（值按量程截断到半径内）。
4. 刻度：`niceTicks`（1/2/5/10 人为阶）、`niceTimeTicks`（秒内→天→月→年四级阶梯各配步长集与格式化，返回 `{ ticks, format }`）。
5. 采样与命中：`lttb`（LTTB 抽稀，`lttbDecimate` 阈值常量 `LTTB_THRESHOLD = 2000`，`decimate` 超阈值才采）、`nearestIndex`（有序 x 轴二分找最近点）、`dataWindow`（视窗两端索引，外扩一）、`computeYDomain`（可见窗口 y 域，跳过空值、零跨度外扩 ±1）、`seriesPoints`（窗口内点集映射）、`minPositiveDelta`（最小正差，柱宽用）。
6. 消费方：Chart、Donut、Radar、Sparkline 与 chart-paint；安装与 API 正本为 `content/docs/utils/chart-kit.zh.mdx`。
