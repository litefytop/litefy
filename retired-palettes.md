# Retired palettes — 退役色板数值存档

> 2026-10-01 退役了 `data-brand` / `data-surface` 运行时换色方案，删除了以下 21 个 CSS 文件（删除提交前的版本可用 `git show <rev>:app/ui/styles/<file>` 找回）。本文件把其中的 OKLCH 数值原样存档，作为后续**重排色阶（color ramps）、改造为静态风格模板素材**的原料。
>
> 注意：这些值是旧"单 token 覆盖"模型的产物（brand 只覆盖 `--primary`/`--primary-accent`，surface 只覆盖 6 个中性 token），不是完整模板；新模板需要每套完整的 light + dark token 集。

## Brand 色板（13）

覆盖令牌：`--primary`、`--primary-accent`

| Palette | Scheme | --primary | --primary-accent |
|---------|--------|-----------|------------------|
| amber | light | oklch(55.5% 0.163 48.998) | oklch(47.3% 0.137 46.201) |
| amber | dark | oklch(76.9% 0.188 70.08) | oklch(82.8% 0.189 84.429) |
| cyan | light | oklch(52% 0.105 223.128) | oklch(45% 0.085 224.283) |
| cyan | dark | oklch(71.5% 0.143 215.221) | oklch(78.9% 0.154 211.53) |
| emerald | light | oklch(50.8% 0.118 165.612) | oklch(43.2% 0.095 166.913) |
| emerald | dark | oklch(76.5% 0.177 163.223) | oklch(84.5% 0.143 164.978) |
| fuchsia | light | oklch(51.8% 0.253 323.949) | oklch(45.2% 0.211 324.591) |
| fuchsia | dark | oklch(74% 0.238 322.16) | oklch(83.3% 0.145 321.434) |
| indigo | light | oklch(51.1% 0.262 276.966) | oklch(45.7% 0.24 277.023) |
| indigo | dark | oklch(78.5% 0.115 274.713) | oklch(87% 0.065 274.039) |
| lime | light | oklch(53.2% 0.157 131.589) | oklch(45.3% 0.124 130.933) |
| lime | dark | oklch(76.8% 0.233 130.85) | oklch(84.1% 0.238 128.85) |
| orange | light | oklch(64.6% 0.222 41.116) | oklch(55.3% 0.195 38.402) |
| orange | dark | oklch(70.5% 0.213 47.604) | oklch(75% 0.183 55.934) |
| pink | light | oklch(52.5% 0.223 3.958) | oklch(45.9% 0.187 3.815) |
| pink | dark | oklch(71.8% 0.202 349.761) | oklch(82.3% 0.12 346.018) |
| purple | light | oklch(55.8% 0.288 302.321) | oklch(49.6% 0.265 301.924) |
| purple | dark | oklch(71.4% 0.203 305.504) | oklch(82.7% 0.119 306.383) |
| rose | light | oklch(51.4% 0.222 16.935) | oklch(45.5% 0.188 13.697) |
| rose | dark | oklch(71.2% 0.194 13.428) | oklch(81% 0.117 11.638) |
| sky | light | oklch(50% 0.134 242.749) | oklch(44.3% 0.11 240.79) |
| sky | dark | oklch(74.6% 0.16 232.661) | oklch(82.8% 0.111 230.318) |
| teal | light | oklch(51.1% 0.096 186.391) | oklch(43.7% 0.078 188.216) |
| teal | dark | oklch(70.4% 0.14 182.503) | oklch(77.7% 0.152 181.912) |
| violet | light | oklch(54.1% 0.281 293.009) | oklch(49.1% 0.27 292.581) |
| violet | dark | oklch(70.2% 0.183 293.541) | oklch(81.1% 0.111 293.571) |

## Surface 色板（8）

覆盖令牌：`--background`、`--foreground`、`--muted`、`--muted-foreground`、`--accent`、`--neutral`

| Palette | Scheme | --background | --foreground | --muted | --muted-foreground | --accent | --neutral |
|---------|--------|--------------|--------------|---------|--------------------|----------|-----------|
| gray | light | oklch(96.7% 0.003 264.542) | oklch(21% 0.034 264.665) | oklch(92.8% 0.006 264.531) | oklch(27.8% 0.033 256.848) | oklch(87.2% 0.01 258.338) | oklch(55.1% 0.027 264.364) |
| gray | dark | oklch(21% 0.034 264.665) | oklch(96.7% 0.003 264.542) | oklch(27.8% 0.033 256.848) | oklch(92.8% 0.006 264.531) | oklch(37.3% 0.034 259.733) | oklch(70.7% 0.022 261.325) |
| mauve | light | oklch(96% 0.003 325.6) | oklch(21.2% 0.019 322.12) | oklch(92.2% 0.005 325.62) | oklch(26.3% 0.024 320.12) | oklch(86.5% 0.012 325.68) | oklch(54.2% 0.034 322.5) |
| mauve | dark | oklch(21.2% 0.019 322.12) | oklch(96% 0.003 325.6) | oklch(26.3% 0.024 320.12) | oklch(92.2% 0.005 325.62) | oklch(36.4% 0.029 323.89) | oklch(71.1% 0.019 323.02) |
| mist | light | oklch(98.7% 0.002 197.1) | oklch(14.8% 0.004 228.8) | oklch(93% 0.007 106.5) | oklch(28.6% 0.016 107.4) | oklch(87.2% 0.007 219.6) | oklch(56% 0.021 213.5) |
| mist | dark | oklch(14.8% 0.004 228.8) | oklch(98.7% 0.002 197.1) | oklch(28.6% 0.016 107.4) | oklch(93% 0.007 106.5) | oklch(37.8% 0.015 216) | oklch(72.3% 0.014 214.4) |
| olive | light | oklch(98.8% 0.003 106.5) | oklch(15.3% 0.006 107.1) | oklch(93% 0.007 106.5) | oklch(28.6% 0.016 107.4) | oklch(88% 0.011 106.6) | oklch(58% 0.031 107.3) |
| olive | dark | oklch(15.3% 0.006 107.1) | oklch(98.8% 0.003 106.5) | oklch(28.6% 0.016 107.4) | oklch(93% 0.007 106.5) | oklch(39.4% 0.023 107.4) | oklch(73.7% 0.021 106.9) |
| slate | light | oklch(96.8% 0.007 247.896) | oklch(20.8% 0.042 265.755) | oklch(92.9% 0.013 255.508) | oklch(27.8% 0.033 256.848) | oklch(86.9% 0.022 252.894) | oklch(55.4% 0.046 257.417) |
| slate | dark | oklch(20.8% 0.042 265.755) | oklch(96.8% 0.007 247.896) | oklch(27.9% 0.041 260.031) | oklch(92.8% 0.006 264.531) | oklch(37.2% 0.044 257.287) | oklch(70.4% 0.04 256.788) |
| stone | light | oklch(98.5% 0.001 106.423) | oklch(14.7% 0.004 49.25) | oklch(92.3% 0.003 48.717) | oklch(26.8% 0.024 320.12) | oklch(86.9% 0.005 56.366) | oklch(55.3% 0.013 58.071) |
| stone | dark | oklch(14.7% 0.004 49.25) | oklch(98.5% 0.001 106.423) | oklch(26.8% 0.007 34.298) | oklch(92.3% 0.003 48.717) | oklch(37.1% 0 none) | oklch(70.9% 0.01 56.259) |
| taupe | light | oklch(98.6% 0.002 67.8) | oklch(14.7% 0.004 49.3) | oklch(92.2% 0.005 34.3) | oklch(26.8% 0.024 320.12) | oklch(86.8% 0.007 39.5) | oklch(54.7% 0.021 43.1) |
| taupe | dark | oklch(14.7% 0.004 49.3) | oklch(98.6% 0.002 67.8) | oklch(26.8% 0.011 36.5) | oklch(92.2% 0.005 34.3) | oklch(36.7% 0.016 35.7) | oklch(71.4% 0.014 41.2) |
| zinc | light | oklch(96.7% 0.001 286.375) | oklch(21% 0.006 285.885) | oklch(92% 0.004 286.32) | oklch(27.8% 0.033 256.848) | oklch(87.1% 0.006 286.286) | oklch(55.2% 0.016 285.938) |
| zinc | dark | oklch(21% 0.006 285.885) | oklch(96.7% 0.001 286.375) | oklch(27.4% 0.006 286.033) | oklch(92.8% 0.006 264.531) | oklch(37% 0.013 285.805) | oklch(70.5% 0.015 286.067) |
