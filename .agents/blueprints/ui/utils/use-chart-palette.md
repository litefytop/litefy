# useChartPalette 图表色板（app/ui/utils/use-chart-palette.ts）

1. 职责：图表系列色板 hook——canvas 像素与多系列 DOM 场景吃不到 CSS 类，色值在 JS 里从方案令牌派生；内建 sRGB↔oklch 数学（转换、gamut 内 chroma 二分钳制）。
2. 色板产出不强制对底 ≥3:1（量具类不强制 1:3——用户定则，粉彩审美优先）：hook 不做对比校验、不设对比基底参数，档位即档色。实测值：亮档对 background 1.6–2.9:1、对 surface 1.3–2.5:1；暗档对暗 background 10–15:1、对 minimal / clinical 暗 surface 7–11:1；neo 夜间 lime 面（1.1–1.5:1）与 neon 紫面（2.1–2.8:1）为既有低对比豁免项。
3. 两模式：`fixed`（缺省）——固定 8 色 Tailwind 色板**交错排列**按序抽取（red/green/blue/orange/cyan/violet/amber/pink——相邻抽取色相差 80°+），亮档 400、暗档 300（用户定则，较语义档深一档以收敛夜间亮度；值取安装版 Tailwind `theme.css` 真值，模式读根元素 dark 类），超出 8 色以 `--primary` 解析色相为起点按黄金角 137.508° 续接；`mono`——单色相明度阶梯，chroma 钳 0.14–0.28。
4. 模式开关：消费者经内联样式写 `--chart-palette-mode: mono`，hook 读探针父元素的计算值；未写即 fixed。
5. 令牌探测：临时 span 探针读 `--primary`（mono 色相 / 续接起点 / 同族阶梯基色，可指 `probeParentRef` 父元素，缺省 documentElement）；明暗档由根元素 dark 类判定；`MutationObserver` 监听根元素 class / style 变化重算，色值逐项相同则保留原引用不触发重渲染。
6. SSR 首帧：`useState` 初值为固定亮档色板，渲染期不读 document；暗档、mono 模式与 `--primary` 探针解析均在 effect 内完成，解析后色值逐项不同则替换引用触发一次重渲染，首帧与客户端解析结果一致无 hydration 偏差。
7. `useSameFamilyShades(count)`：同族明暗阶梯（`--primary` 色相，pale→strong 插值），供需要同色系分档的场景。
8. 语义填充（Meter 分档、Progress 状态、Callout 底、Toast 内条）不走本 hook——它们读语义令牌（`<status>` 背景色档 300 / 200，规则 3），令牌即档位、无需 JS 计算；本 hook 只服务 canvas 场景（Chart / Donut / Radar 的像素取色）与多系列 DOM 场景（MeterGroup 段色）。
9. 消费方：Chart、Donut、Radar（canvas 像素）、MeterGroup 段色；安装与 API 正本为 `content/docs/utils/use-chart-palette.zh.mdx`。
