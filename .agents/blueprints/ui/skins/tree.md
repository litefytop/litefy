# Tree 皮肤（app/ui/skins/tree.tsx）

1. 缩进机制：骨架把层级深以内联 `--litefy-depth` 发布到行 / 枝 / 标签，缩进在该载体上合成（`--litefy-indent: calc(lg + sm × depth)`）——复合值若只声明在根会冻结在 0 层；基数与步长读共享间距梯（运行期值、类表达不了——机制属性已注明）。
2. 行：`min-h-control` 命中 + 无圆角整行（高亮贴边铺满整行，激活行背景色因此成通条） + `ps-(--litefy-indent)` 起缩进 + `pe-3` 收口，`text-sm` + `font-field` + `surface-fg`，hover 换 `hover` 对，`focus-visible:focus-ring` 焦点环（触发钮与链接行同享）；节点标签截断。
3. 分枝：`grid-template-rows` 过渡展开（`duration-md`）；折叠态（`[data-open=false]_&`）转 `invisible` 保几何；枝线 `before:` 1px 竖线、颜色走 `border` 令牌，挂在缩进位；激活行（`data-[active=true]`）背景色铺 `primary`、文字转 `primary-fg`（字重不变）；分枝引导线（branch `before:bg-border`）挂 `z-10`，从激活行填充上方穿过不被告遮挡；禁用禁指针 + 压暗。
4. 分组标签：小节标题——`text-xs` + `font-label` 档 + label 两项 + `surface-fg` 文字色，同款缩进。
5. 图标：`size-4` 槽，展开转 90°（`data-[open=true]`，`duration-md`）。
6. 专属令牌：无。
