# Wizard 皮肤（app/ui/skins/wizard.tsx）

1. Wizard 组合：步条（Steps 皮肤横排整包）+ 单 DOM 翻页器（`h-48` 舞台高）+ 页脚行（两端对齐 + `gap-2`）；根以 `[&>*+*]:mt-6` 编节奏。
2. 页脚钮：back = outline 档、next = primary 档，直接叠共享按钮角色；箭头是组件自带字形，唯一按后代定尺寸的节点（`size-4` 默认图标档）。
3. InlineWizard：纵向 Steps 皮肤整包当手风琴 + 每步自带页脚（右对齐 `mt-3` + `gap-2`）；步内容 `text-sm` + `leading-5`。
4. 专属令牌：无。
