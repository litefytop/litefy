# Badge 皮肤（app/ui/skins/badge.tsx）

1. 纯样式组件：无骨架、无交互态，不适用命中区与焦点环；从 `@/ui/skins` 桶导出，不进 `@/ui` 主桶。
2. 容器槽：方盒（`size-11`），`rounded-sm` 圆角，`surface` 背景色配 `surface-fg` 前景色，`shadow-subtle` 微浮，内容居中；children 为消费方传入的默认内容（图标等）。
3. 计数槽：右上角骑线（`translate-x-1/2 -translate-y-1/2`），`min-3.5` 最小盒，`rounded-md` 圆角，`primary` 背景色配 `primary-fg` 前景色，`shadow-subtle`。
4. 计数文字：`text-sm` + label 声（`control-label`）+ `tabular-nums`；超宽省略（核心 `truncate`）。`label` 可省略：省略或空串时角标退化为 3×3 圆点（`size-3`），有内容时恢复 `min-3.5` 起步、随内容生长（`not-empty:*`）。
5. 颜色不承载状态：`primary` 背景色是固定品牌底色，数字本身即内容，无需 `aria` 补充。
6. 专属令牌：无——全部取共享档位（圆角 sm / md、surface / primary 背景色对与前景色、subtle 阴影、label 三项）。
