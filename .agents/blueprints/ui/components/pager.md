# Pager 骨架（app/ui/components/pager.tsx）

- 职责：单页视窗滑动器：`index` 受控换页，带滑动过渡与触摸手势，可循环。

## 行为 / 状态

- `children` 经 `Children.toArray` 过滤非元素，总数为 0 返回 `null`；`index` 必传受控，只通过 `onChange(next)` 申请换页；`transition` 为 `slide`（默认）或 `none`，`gesture` 默认 true，`loop` 默认 false
- 归一化：空集为 0，`loop` 取模，非循环 clamp 到 `[0, total − 1]`；内部 `renderedIndex` 记录已落位页
- 切页：`transition="none"` 或视口宽为 0 直接落位；否则按前向步数 `fwd = (target − current + total) % total` 定方向（`fwd ≤ total / 2` 记 +1，否则 −1），叠一层 `data-position="slide"` 预览层，时长取 `getSchemeDurationMs(--duration-md)`（见 `../utils/scheme-duration`，兜底 200ms），定时结束落位；过渡中收到新 `index` 则取消定时器直接落位
- 手势（仅 touch）：`DRAG_RATIO = 0.25`，位移达视口宽 25% 才提交；非循环且到端点时位移乘 0.3 阻尼；提交时先钉在 `offset = −dir × width` 再 `onChange`，settle 后落位；滑动或手势锁定期间忽略新手势
- 拖动期间按 `data-position="prev|next"` 渲染两侧邻页层（`aria-hidden`），无邻页则不渲染；track 过渡中带 `data-animating`
- 根 `overflow:hidden`，视口 `touchAction: pan-y` + `userSelect:none`；无键盘翻页
- 定时器生命周期：settle / 落位定时器一律持 ref，卸载时清理；touchmove 位移更新经 rAF 合帧，每帧至多一次状态写入
- 槽位：无
