# Sidebar 皮肤（app/ui/skins/sidebar.tsx）

1. 根：全高纵向列（`flex flex-col h-full`），`bg-surface` 背景色配 `surface-fg` 文字色；中列滚动由消费方 `flex-1`，工具条落尾；不描边、不叠阴影——bar 的边线是页面布局决定，皮肤不越权。
2. 收起态：`data-[open=false]` 直接 `hidden`（从不做宽度动画）；定位与尺寸归消费方 `className`。
3. 专属令牌：无。
