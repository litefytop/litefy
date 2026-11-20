# Watermark 皮肤（app/ui/skins/watermark.tsx）

1. 根：定位上下文 + 裁切（`relative overflow-hidden`）——骨架把 canvas 铺在 `inset: 0`，消费方内容不溢出水印矩形；除此之外零外观：平铺的字体 / 颜色 / 透明度全是 props，皮肤不带方案意见。
2. 专属令牌：无。
