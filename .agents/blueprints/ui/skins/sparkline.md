# Sparkline 皮肤（app/ui/skins/sparkline.tsx）

1. 组：`h-12 w-32` 默认盒（消费方可覆盖）；三个零件只管绘制——柱（`fill-current`）、面积（`fill-current` + 15% 洗色）、线（`fill-none` + `stroke-current` + `stroke-2`）。
2. 着色随环境：`fill-current` / `stroke-current` 取宿主文字色——放进彩色块里就随那块的颜色；线帽与拐角走共享 `line-cap` / `line-join` 档（圆头 / 平头两答）。
3. 专属令牌：无。
