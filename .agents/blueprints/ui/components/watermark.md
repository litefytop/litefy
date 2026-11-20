# Watermark 骨架（app/ui/components/watermark.tsx）

- 职责：在内容上层平铺旋转文字水印的 canvas。

## 行为 / 状态

- 导出 `WatermarkRoot` / `WatermarkCanvas` / 组合 `Watermark`；`text` 必填，默认 `fontSize 16`、`color "surface-fg"`、`fontFamily "sans-serif"`、`rotate -30`、`gap 100`、`padding 20`、`opacity 0.3`
- 颜色解析：语义色只收 22 枚色板内的角色名并映射 `--color-<角色>`（文字水印合理角色集为 `foreground` / `surface-fg` / `primary-fg` / `accent-fg` 与语义四族 `-fg`），其余字符串按字面原值；语义色用 `getComputedStyle(document.documentElement)` 取值，取不到时按 `prefers-color-scheme` 回退为半透明黑白。旧词表槽位（`secondary` 族、无 `-fg` 后缀的旧名）不再收录，存量映射随重构清除（schemes.md 第 4 条待定项）
- 平铺绘制：canvas 尺寸取父元素 `getBoundingClientRect` × `devicePixelRatio`，backing 与 CSS 尺寸同步；`clearRect` 后以旋转文本包围盒 + `padding * 2` 为单元，步长 `max(单元, gap)`，`globalAlpha = opacity`
- 重绘时机：绘制参数变化、`prefers-color-scheme` 变化、`documentElement` 的 class/style 变动（`MutationObserver`）、父元素尺寸变化（`ResizeObserver` + rAF 合并）
- 兜底：`text` 为空、无父元素、取不到 2d context、父尺寸为 0 时跳过绘制
- canvas 内联 `position: absolute; inset: 0`、`pointer-events: none`、`user-select: none`，外部 `style` 可覆盖
- `Watermark` 在 children 之后渲染 canvas，根透传 div 属性与 `style`
- 槽位：`classNames: canvas`；`styles: canvas`
