# Image 皮肤（app/ui/skins/image.tsx）

1. 外框：裁切定位盒（`relative overflow-hidden`），`border-control` 边宽档 + `bg-surface` 背景色 + `shadow-surface` 阴影——留白的方案两答皆空（无边框、无阴影）。
2. 图片槽：绝对叠层铺满裁切（`absolute inset-0 object-cover`），默认透明、`data-[revealed=true]` 淡入（`transition-opacity duration-md`）——渐进加载的呈现段。
3. 组合导出：`imagePartClasses` 供 PreviewCard 等宿主在自己面板内装配图片。
4. 专属令牌：无。
