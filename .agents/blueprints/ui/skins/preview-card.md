# PreviewCard 皮肤（app/ui/skins/preview-card.tsx）

1. 卡框：共享 Card 框与内容容器档位，行内态默认 `md` 24rem，去内边距（`p-0`）——上缘归图片不归框；浮动态（`data-[floating=true]`，tooltip 内）保留定宽 `w-72` 并受浮层 320px 上限约束。皮肤将消费者 `className` 与 `classNames.root` 经 `cn` 合并后交给骨架；浮动态默认上限先于消费者类串合并，消费者可用 `data-[floating=true]:max-w-*` 覆盖。
2. 触发件：链接观感——链接文字色（方案自答）+ 无下划线，hover 补下划线并加深——「还有内容」靠下划线暗示，不靠色块。
3. 图片槽：Image 零件叠 `h-40` + `border-hair` 边宽档 + 底色方案自答 + `shadow-surface` 阴影，图片铺满裁切。
4. 正文：`p-4`；标题 `text-sm leading-5 control-label`；描述 `mt-1` + `text-xs leading-4` + `foreground`。
5. 专属令牌：无。
