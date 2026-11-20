# Lattice Loader 皮肤（app/ui/skins/lattice-loader.tsx）

1. 行：`inline-flex items-center gap-x-3 text-sm font-field text-foreground`；动词由骨架直渲，皮肤把字符串包进自有 span（`min-w-0` + `whitespace-nowrap`，全 `foreground` 文字色），自定义节点直通，文案为空不渲染（无幻影间隙，指示器形态消费即纯波形）；缺省动词 `Thinking` / `Done in` / `Failed after` 由皮肤提供；timer 槽 `font-mono text-xs text-surface-fg`。本组件是 spin 等价物的实现载体：ThoughtLine 思考态即此波形，定格读对勾。
2. 格阵：`inline-grid`，列轨由骨架内联 `grid-template-columns` 供给，格距 `gap-1`；cell 槽 `size-1.5`（`square` 形态直角、`round` 形态 `rounded-pill`）——尺寸是定值，走本皮肤串，不设消费者尺寸阶梯。
3. 点亮波：根挂 `group/lattice`；cell 静置底色 `surface`，`data-status=working` 时挂 `motion-safe:group-data-[status=working]/lattice:animate-lattice`（`@theme inline` 动画档 `--animate-lattice`——圈长与相位都写进动画简写：时长读格阵槽内联的 `--lattice-loop`，逐格延迟以第二时间值读格内联的 `--lattice-cell-delay`；普通 `@theme` 会在 `:root` 就把这些代成兜底值，schemes.md 9；独立的 `animation-delay` 长手声明会被 `animation` 简写重置归零、全格同相，禁用；`@keyframes lattice-wave` 住三案 `index.css`——亮色恒答 `primary`、静置恒答 `surface`，亮窗恒为半圈：相位差一步的邻格轮转成弧段，`3×3` orbit 任一时刻外圈至多 4 格带色；minimal 案在半圈亮窗内柔和起落、前后缘渐变，neo 案半圈 `primary` 半圈 `surface` 硬切、恒 4 格实心弧段步进）；`prefers-reduced-motion` 下波停、格子保持静置色。
4. 定格溶解：`data-status=done|error` 时 cell 过渡到画布底色（`duration-sm` 档——neo 即 0ms 硬切）、mark 槽淡显 + 轻模糊收缝（同 `duration-sm` 档，minimal 即 150ms 内完成、neo 即瞬切）；mark 槽 `absolute inset-0` 居中叠于格阵槽（格阵槽 `relative`——组件渲染了脱离文档流的子元素，按形态条件补定位类），`size-5`，成功 `text-success-fg`（内置 `Check`）、失败 `text-danger-fg`（内置 `X`）；动词随 `data-status` 换文案，秒表停摆（文字色 `surface-fg` 不变）。
5. 无障碍下限：本件非可聚焦控件，不挂焦点环；动效全部尊重 `prefers-reduced-motion`（呼吸类挂 `motion-safe:`，定格换形不受限）。
6. 专属令牌：`--animate-lattice`（点亮波动画档，声明在 `@theme inline`）与 `@keyframes lattice-*` 住三案 `index.css`；其余无。
7. 组合导出：`latticeLoaderRootClasses` / `latticeLoaderClasses` 供 ThoughtLine 皮肤装配其嵌套加载器（根类进 thought-line 的 `lattice` 槽，槽位包进 `latticeClassNames`）。
