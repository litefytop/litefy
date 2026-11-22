# Segment 皮肤（app/ui/skins/segment.tsx）

1. 原子件脸（Segment，类常量经 `segmentVariants` 导出供组合皮肤组装）：文字钮形态——`min-h-control min-w-0` + px 基础档 + `text-sm` + `font-label` 档 + label 两项 + `text-surface-fg` + `cursor-pointer select-none` + `rounded-sm`；选中（`aria-[checked=true]`）换 primary 背景色 + primary-fg 前景色；无 hover（2026-11-20 用户裁定）；与 `buttonVariants.text` 同形但无 hover，故不引用 button 变体；禁用压暗走 `disabled:dim` 自答（`dim` 契约见 `ui/schemes.md` 第 8 条⑥）。
2. 组合皮肤（SegmentGroup）住 `ui/skins/segment-group.md`，组装本脸与变体差异。
3. 专属令牌：无。
