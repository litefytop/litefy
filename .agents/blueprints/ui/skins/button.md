# Button 皮肤（app/ui/skins/button.tsx）

1. 只导出一个封装组件 `Button` 与 `buttonVariants`：复用骨架成品 `Button`，只供外观——变体串按 `data-variant` / `data-danger` 经 `buttonVariants` 选取（primary 默认 / outline / text / danger，见 3–6）；不自行组合零件。
2. 帧类基础流 `inline-flex items-center justify-center gap-x-2`：buttonVariants 须被裸 `<a>` 整串穿戴（display 决定 h-control 是否生效），流自足成串；status 配置后的网格切换归骨架 `data-[status]:inline-grid`（specificity 胜帧类 flex），帧类不双写。高度恒 `h-control`（控制几何令牌，不骑数字乘道——乘道随 `--spacing` 逐案缩放会让 neo 按钮与 44px 控件车道断档）；帧圆角 `rounded-pill`，非纯图标 px 走 pill 补偿算式 `calc(var(--spacing)*3+min(var(--radius-pill),var(--height-control)/2))`（见 `ui/schemes.md` 第 14 条）；恒宽预留：骨架发射 `data-status-reserve`（status 配置且未传 icon 且有文字）时在 pill 补偿 px 基础上对称加宽 (icon+gap)/2（移动端 icon `size-5`、PC `size-4`），闲置与激活总宽恒等；纯图标（`data-pure-icon`）`aspect-square` + `px-0` 自动方型，命中区外扩伪元素（`after:-inset-hit`）脱离文档流需锚点，纯图标形态条件补 `relative`（消费方定位类经类名合并后写胜出）。图标尺寸由按钮统一强制：`[&_svg]:size-5`（移动端）/ `sm:[&_svg]:size-4`（PC 端）——用户指令，icon 与 status.icon 同尺寸由此保证原位换标零位移。
3. primary（默认）：`primary` 背景色 + `primary-fg` 前景色 + `shadow-frame` 承重，hover 换 `primary-accent`。
4. danger（`data-danger`）：`danger` 背景色 + `danger-fg` 前景色 + 发丝描边 + `shadow-frame` 承重（可交换按钮一律承重，text 例外），hover 换 `danger-accent`、文字保持 `danger-fg`（`-fg` 叠 `<status>` 与 `-accent` 两档背景实测均过 AA，见 schemes.md 规则 3），描边不随悬停换档，焦点环转 danger。
5. outline（`data-variant="outline"`）：`background` 背景色 + `foreground` 前景色 + 发丝描边，hover 换 `accent` 背景色。
6. text（`data-variant="text"`）：无背景色、无框、文字色恒为 `foreground` 不换——hover 加下划线（`underline-offset-4`；纯 icon 的 text 按钮无文字、线不可见，现行约定接受）；不挂抬升/压平动效，不声明按压——text 角色零按压反应（按压由皮肤显式挂 `active:` utilities，text 不挂）。
7. 专属令牌：无。
