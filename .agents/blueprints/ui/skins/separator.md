# Separator 皮肤（app/ui/skins/separator.tsx）

1. 裸线形态（无 children）：发丝线——颜色走 `border` 令牌，横向 `h-px`、纵向 `w-px` + `min-h-6` 下限。
2. 带标签形态：flex 居中行（display 由骨架内联），`gap-2` 节奏 + `my-4` 纵向外距；标签走 `text-label` + `leading-label` + label 三项（`font-label` / `tracking-label` / `case-label`）+ `surface-fg` 文字色——字号与行高归角色档、不另写，只留纵向吸附下限 `min-h-6`；线仍是 `bg-border`（`classNames.line`）。
3. 专属令牌：无。
