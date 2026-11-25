# Separator 皮肤（app/ui/skins/separator.tsx）

1. 裸线形态（无 children）：发丝线——颜色走 `border` 令牌，方向由 wrapper `orientation` prop 选串解析（默认横向），横向 `h-px`、纵向 `w-px` + `min-h-6` 下限。
2. 带标签形态：flex 居中行（display 由骨架内联），`gap-2` 节奏；横向 `w-full` + `my-4` 纵向外距，纵向只留吸附下限 `min-h-6`；标签走 `control-text`（字号 / 行高 / 标签声整档捆绑）+ `foreground` 文字色；线仍是 `bg-border`（`classNames.line`）。
3. 专属令牌：无。
