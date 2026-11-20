# Group 皮肤（app/ui/skins/group.tsx）

1. 容器：`grid w-fit grid-flow-col auto-cols-fr`——零间距横向网格，列等宽（取最宽子件），子件等高拉伸。
2. 子件圆角经父选择器收编（保留子件自己的圆角值，只零化该零的角）：中间件（非首非末）四角归零；首件 end 侧两角归零（start 侧保留原值）；末件 start 侧两角归零（end 侧保留原值）；`:not(:first-child)` / `:not(:last-child)` 双守卫——独子不削角。
3. 不写分隔线、不写间距、不写边框重叠——需要分隔由消费方在子件上自理。
4. 本期只做横向；垂直与外壳内连接（如 NumberField 步进器与外壳圆角的联动）另立待定项。
5. 专属令牌：无。
