# Tooltip 皮肤（app/ui/skins/tooltip.tsx）

1. 接线容器不自带外观；两个着装件各走自己的 `className`。
2. 触发词：行内车道豁免——不撑高行盒，`inline-flex` + `px-2` + `rounded-md`，`text-sm` + `font-emphasis` 交互词字重。
3. 浮泡：`w-max max-w-96` 自适应浮层，`px-4 py-2`，`rounded-xl` + `border-frame` 描边 + `surface-raised` 背景色 + `shadow-hint`（轻提示层——minimal 答 elevated 档、neo 答 `none`，轻提示不带阴影），`text-sm` + `font-field`。
4. 专属令牌：无。
