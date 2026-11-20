# Callout 皮肤（app/ui/skins/callout.tsx）

1. 纯样式组件：无骨架、无交互态，不适用命中区与焦点环。
2. 形态（markdown admonition 同款）：flex 行——左内置语义图标（`size-4`）+ 右文本列（类型标题 `font-strong` + 正文），图标与标题取配对 `*-fg` 强色，容器 `px-3 py-snug rounded-md` + `text-label leading-6 font-label`；起始侧立强调条 `border-s-4`、色取变体配对 `*-fg`（经验规则：admonition 强调条档——发丝档夹在粉彩底与页面底之间读不出竖线）。
3. 语义底：容器铺语义背景色档（`bg-info` / `bg-success` / `bg-warning` / `bg-danger`，令牌即档位、无 JS 取色，见 schemes.md 规则 3）、文字与图标取配对 `*-fg`；`data-variant` 切换，缺省 info；图标与标题随变体取对应内置图标（circleInfo / circleCheck / triangleAlert / circleAlert）与英文类型词（Info / Success / Warning / Danger）。
4. 专属令牌：无——状态文字色与浅底档为共享档。
5. 图标居中：图标对标题行首居中——容器 items-start 供多行内容，图标补 mt-1（(行高 24 − 图标 16) / 2 的 4px 档）。
