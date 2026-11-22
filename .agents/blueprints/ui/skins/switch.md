# Switch 皮肤（app/ui/skins/switch.tsx）

1. 命中区车道：label 行盒承担 44 下限（`min-h-control`），隐藏 input 保持 `size-6` 居中（`opacity-0`）。
2. 轨道：`w-10 h-5` 全圆 + `border-frame border-border` 描边 + 底色方案自答；勾选（`data-[checked=true]`）边与背景色同转 `primary`；颜色过渡走 `motion-frame`（方案自答：minimal 颜色渐变 150ms，neo 按其动效律色值硬切）；焦点环 `has-[:focus-visible]:focus-ring`。
3. 滑块：`size-5` 圆块（与轨高齐平）+ `background` 背景色 + 发丝描边 + `shadow-faint` 微浮；位移过渡 `transition-transform duration-frame ease-frame`（只动 transform，时长与缓动走方案帧动效令牌，reduced-motion 归零），双态显式平移：未选 `translate-x-0`、勾选 `translate-x-5`（行程 = 轨宽 40 − 滑块径 20，纯阶梯档无令牌）——双向均有具体值，保证开与关两个方向的过渡插值。
4. label 行：`text-base` + `font-label` + `gap-x-2`。
5. 禁用观感：轨道 `has-[:disabled]:dim`（压暗 + 禁用光标，`dim` 契约见 `ui/schemes.md` 第 8 条⑥），label 文字转 `surface-fg`。
6. 专属令牌：无。
（neo 阴影）承载面挂 shadow-frame——可交互件必有阴影（neo design.md 阴影律），minimal 无此工具类不渲染、零回归。
