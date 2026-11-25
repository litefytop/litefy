# Segment 皮肤（app/ui/skins/segment.tsx）

1. 原子件脸（Segment，类常量经 `segmentVariants` 导出供组合皮肤组装）：文字钮形态——`min-h-control min-w-0` + px 基础档 + `gap-x-2` + `control-text`（整档捆绑同 button 帧，用户定 2026-11-24） + `text-foreground` + `cursor-pointer select-none` + `rounded-sm`；选中（`aria-[checked=true]`）换 primary 背景色 + primary-fg 前景色；无 hover（2026-11-20 用户裁定）；与 `buttonVariants.text` 同形但无 hover，故不引用 button 变体；禁用选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / active。
2. 组合皮肤（SegmentGroup）住 `ui/skins/segment-group.md`，组装本脸与变体差异。
3. 专属令牌：无。
