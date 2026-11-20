# Chart 皮肤（app/ui/skins/chart.tsx）

1. 组合（自上而下）：body（relative 定位上下文）+ canvasWrap（透明画布不铺底色，底色由消费方背景承担，见 use-chart-palette.md）+ canvas（`cursor-crosshair` 十字读取）+ tooltip 五槽位（容器 / 标题 / 行 / 色块 / 数值）→ 图例（`classNames.legend` 接 `ChartLegend` 皮肤，画布下方）→ 提示行（末行居中小字，`text-foreground`；骨架只直渲调用方的 `zoomHint` 节点——未传时皮肤出自有默认提示「Drag to zoom · double-click to reset」，字符串包进皮肤自有 `<p>`，自定义节点直通，空串隐藏；默认 `invisible`，`group-hover/chart` 或 `group-focus-within/chart` 时显现——根挂 `group/chart`，图例按钮聚焦/触屏 tap 即走 focus-within 车道，hover 非唯一入口；PDF 导出与打印无悬停也无焦点，不带交互提示；盒子保留，图表高度不随悬停变化）。
2. 绘色机制：canvas 像素由 JS 色板绘制——默认 fixed 模式前 8 色从固定 Tailwind 色板按序抽取（浅底 300 档、深底 200 档——语义同款档位，明暗由根元素 dark 类判定），超出 8 色以 `--primary` 色相按黄金角续接；色板不强制对底 ≥3:1（量具类不强制 1:3，用户定则；见 use-chart-palette.md）；tooltip 色块与画布序列同源（同一色板值内联）。DOM 零件不自行持色值，运行期数据色是外观通道的已注明例外。
3. 模式开关：`--chart-palette-mode`（`fixed` | `mono`）由消费者经内联样式设置、JS 读取，皮肤不经手。
4. 专属令牌：无（色板为运行期派生，非色板槽位）。
