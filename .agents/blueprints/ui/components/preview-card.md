# PreviewCard 骨架（app/ui/components/preview-card.tsx）

- 职责：预览卡：图片 + 标题 + 描述的卡片，可选 trigger 以浮层形式展示。

## 行为 / 状态

- `src` 与 `title` 必传，`alt`、`description` 可选；`href = "#"`、`delay = 200`；其余 div 属性落在卡片根
- 卡片结构：`Image`（`classNames.image` 直通）→ body → `h3` 标题 → `p` 描述（有才渲染）；`className` 与 `classNames.root` 合并
- 无 `trigger`：直接返回卡片；有 `trigger`：返回 `<a href>`（`classNames.trigger` + `data-anchor-name`）包裹 trigger，卡片移入 `TooltipContent` 浮层，卡片根加 `data-floating="true"`
- 交互经 `useTooltipWiring`（见 `./tooltip`）：pointerenter / focus 显示，pointerleave / blur 按 `delay` 延迟隐藏
- 浮层 id 与锚点由 `useId` 去符号生成（`preview-<uid>`、`--preview-<uid>`）
- 槽位：`classNames.root/trigger/image（ImageClassNames 形状）/body/title/description`；`styles.image/body/title/description`
