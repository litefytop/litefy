# floating-position（app/ui/utils/floating-position.ts）

- 职责：把锚定浮层（`popover="manual"` 面板）定位到锚点旁——读面板的 `data-float-*` 属性（锚名元素或坐标点、side / align / gap / matchWidth），算出 fixed 坐标写入内联样式；`showFloatingPanel` 先停到屏外防闪现，`showPopover` 后立即定位；`useFloatingPosition` 监听滚动与缩放持续重定位。
- 定位写入：`position: fixed; margin: 0; left; top`，同时把 `right` / `bottom` 置 `auto`——UA 给 `[popover]` 的默认 `inset: 0` 在只覆盖 left / top 时，会把宽高不定的面板沿 right / bottom 钉满视口（宽高随内容的面板被拉伸满屏）；显式定宽的面板不受此清理影响。
- 越界：side 按可用空间翻转（bottom↔top、right↔left），对齐位置在视口内夹取；坐标点形态不做翻转，只按空间换侧。
- 重定位节奏：scroll / resize 回调经 rAF 合帧，每面板每帧至多一次重定位；每次重定位先读锚点与面板几何、后写样式，matchWidth 的宽度写入发生在几何读取之后。