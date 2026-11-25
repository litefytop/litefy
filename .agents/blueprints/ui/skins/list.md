# List 皮肤（app/ui/skins/list.tsx）

1. 视口：滚动半 + 框半——`rounded-md` + `border-frame` 描边；滚动隐藏滚动条，内嵌 ol / ul 重置列表标记。宿主已画框（Popover / Dialog / Cascader）只组合滚动半（`listViewportClasses`），不带框。独立 List / Order 默认 `lg` 28rem，`size` 可选 `sm` 20rem / `md` 24rem / `lg` 28rem / `xl` 32rem，根 `w-full min-w-0` 并按档位封顶，父容器更窄时收缩；皮肤将消费者 `className` 与 `classNames.viewport` 经 `cn` 合并后交给骨架，其余槽走状态合并。
2. 根：去列表标记；有序变体（`data-[ordered]`）换十进制标号 + `ps-6`；禁用行按 `data-disabled` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，点击与键盘激活由骨架 JavaScript 守卫阻断，不使用 inert 或 `pointer-events: none`。
3. 行：`px-3 py-snug`——行保持块布局（内容任意），44 下限由 padding 反解行盒而非 min-height（min-height 会把单行顶居中）；`text-sm` + `font-field`；行分隔 `border-b-hair` 发丝档（一边 0 一边整划，末行无线）；hover 与 `data-[highlighted=true]` 同吃 `accent` 背景档并写它的配对前景（键盘高亮 = 指针悬停），共用导出的 `listOptionHoverClasses`；禁用态由 List 自答。
4. 组头：底色条（底色方案自答）+ `py-snug` 与行同高（44 命中梯，同高不同权）+ `text-sm leading-5`（与行同节奏，不另设小字号）+ `control-label`（label 比交互正文大，字族字重双轴区分） + `foreground` 文字色，同款下分隔。
5. 空态：`foreground` 小字，`px-3 py-2`。
6. 组合导出：`listClasses` / `listPartClasses` / `listViewportClasses` / `listFrameClasses` 供 Cascader、Combobox、Command、FormItem 等宿主装配；`listOptionHoverClasses` 供 List、Select、MultiSelect、Command 共用 hover 与键盘高亮配色。
7. 专属令牌：无。
（neo 阴影）独立框半挂 shadow-frame——宿主内嵌的视口半不带框不受影响，minimal 无此工具类不渲染。
