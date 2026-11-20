# Toc 骨架（app/ui/components/toc.tsx）

- 职责：目录导航：滚动高亮 + 阅读进度环，窄屏以弹出面板替代列表。

## 行为 / 状态

- 导出 `Toc` 与 `TocItem { id, label, depth? }`；`items` 为空返回 `null`；渲染为 `nav`，`aria-label` 仅在 `title` 为字符串时取该值
- 高亮复用 `useScrollSpy(items.map(id))`（见 `../utils/use-scroll-spy`），命中的 `activeIds` 全部标 `data-active`；`current` 取 `activeIds[0]` 对应项
- 进度：capture 相位监听 scroll（rAF 合并，事件 target 即滚动容器；window 滚动回落 `document.scrollingElement`）与 resize，比值 `scrollTop / (scrollHeight − clientHeight)` 截到 0–1，不可滚时取 1；环半径 9，`strokeDasharray` 为周长，`strokeDashoffset = 周长 × (1 − progress)`
- 链接为 `a[href="#id"]` 并带 `data-depth`；rail 与弹出面板各渲染一份列表，面板内链接点击（含键盘 Enter）即收起
- thumb：`ResizeObserver` 观察列表（effect 无依赖，每次渲染重建），按激活项首尾 rect 得 `translateY(y) scaleY(scale)`，`scale = (last.bottom − first.top) / clientHeight`；无激活项时不渲染
- 状态按钮 `data-open` + `aria-controls` + `aria-haspopup` 清空，内含进度环、`current?.label ?? title` 文案与 `ChevronDown`（亦带 `data-open`）；`title` 另以 `<p>` 渲染在 rail 顶部
- 面板 `PopoverContent`，placement 固定 `{ side: bottom, align: end, gap: 8 }`
- 槽位：`classNames.rail/title/scroll/list/item/thumb/status/ring/ringTrack/ringProgress/current/chevron/panel`；`styles.rail/title/scroll/list/item/status/ring/panel`
