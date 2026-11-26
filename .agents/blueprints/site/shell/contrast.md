# 业务层文字色配对（app/components · app/routes · app/demos · app/styles）

1. 画布与浮层：`bg-background`、透明背景与 `bg-surface-raised` 上的正文、次要文字、说明、占位文字、图标一律读 `foreground`；层级靠字号、字重与间距表达，不把 `surface-fg` 当通用弱化文字色。
2. 表面填充：实际铺 `bg-surface`（含方案渐变填充）的容器必须显式或经父容器继承 `surface-fg`；嵌套换回 `bg-background` / `bg-surface-raised` 时必须重新继承或显式改回 `foreground`。
3. 状态填充：`bg-primary` / `bg-accent` / `bg-<status>` 及其 `-accent` 悬停档分别配 `text-primary-fg` / `text-accent-fg` / `text-<status>-fg`；换背景档就在同串写上新档的配对前景（`hover:bg-accent` 带 `hover:text-accent-fg`）——同一枚 `-fg` 对静置背景与 `-accent` 两档都过 AA，日/夜两档不必再切文字色，成套律由令牌层保证（`ui/schemes.md` 第 24 条）。
4. 独立语义前景：不落在对应状态块内的文字、图标与边框统一挂 `text-<status>-independent` / `border-<status>-independent`；该角色是状态令牌的机制别名，不占色板槽位，由各方案按实际背景取值（minimal / flat-minimal / neo-brutalist 夜档读 `<status>-accent`、neon-gradient 夜档读 `<status>`、日档读同族 800 档字面，见 `ui/schemes.md` 第 3 条）。状态块内文字仍只用 `text-<status>-fg`。
5. 删除槽位：业务层不使用已删除的 `text-on-surface`；表面文字统一写 `text-surface-fg`。
6. 代码块：Shiki 代码本身继续读亮暗主题；行号与普通注释读 `foreground`，增删行的 `+` / `-` 读 `success` / `danger`，不用表面文字色或状态前景色直接落在画布上。neon-gradient 背景三档随日/夜分档（`ui/schemes.md` 第 16 条），代码车道与其它方案一样按 `.dark` 类走共享 `app/styles/shiki.css`，站点层入口不再强制钉暗档。
7. 外壳与工具页：文档跳转链接聚焦时铺 `bg-surface` 必须配 `text-surface-fg`；HomeShell 页脚根与子文字都读 `surface-fg`，hover 不切回画布白字；颜色工具的画布标签与说明读 `foreground`，结果条整条铺 `bg-surface text-surface-fg`，条内按钮保留自己的背景与前景配对。
8. 校验：neon-gradient 背景分档 + 品牌语义单档（`ui/schemes.md` 第 16 条）必须达到 WCAG 2.2 AA——正文至少 4.5:1，大字至少 3:1，必要图标至少 3:1；同一页面同时检查静置、hover、选中与焦点态。
9. 底档分派（`ui/schemes.md` 第 21 条的落点判据）：壳层常驻大面积（顶栏、侧栏、页脚、分区带）留 `bg-surface`——它的职责是隐退，不是承载阅读内容；嵌在正文里承载文字与控件的容器（Card、面板、结果区、示例框）挂 `bg-surface-raised`；输入井、值区挂 `bg-surface`（第四档「井」已撤销，用户定 2026-11-25，见 `ui/schemes/elevation.md`），轨道与进度底改挂 `bg-border`（用户定 2026-11-26：`surface` 与画布只差一档、细轨看不清），凸起面不得拿来充当凹陷；Popover / Dialog 面板及其内默认组件一律 `surface-raised`，不在面板内铺 `surface`。逐处按「这块是内容、外壳还是凹槽」三分，不看视觉习惯；改档时同步文字配对（第 1 / 2 条），亮暗两档各测一次对比（neon-gradient 背景两档各测一次，品牌与语义同值只测一遍）。
