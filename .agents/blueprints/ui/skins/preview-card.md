# PreviewCard 皮肤（app/ui/skins/preview-card.tsx）

1. 卡框：共享 Card 框去内边距（`p-0`）——上缘归图片不归框；浮动态（`data-[floating=true]`，tooltip 内）定宽 `w-72`，行内态上限 `max-w-96`。
2. 触发件：链接观感——链接文字色（方案自答）+ 无下划线，hover 补下划线并加深——「还有内容」靠下划线暗示，不靠色块。
3. 图片槽：Image 零件叠 `h-40` + `border-control` 边宽档 + 底色方案自答 + `shadow-surface` 阴影，图片铺满裁切。
4. 正文：`p-4`；标题 `text-sm` + semibold 字重 + `tracking-wide` + `case-label`；描述 `mt-1` + `text-xs` + `surface-fg`。
5. 专属令牌：无。
