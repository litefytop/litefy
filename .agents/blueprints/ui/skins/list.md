# List 皮肤（app/ui/skins/list.tsx）

1. 视口：滚动半 + 框半——`rounded-md` + `border-frame` 描边；滚动隐藏滚动条，内嵌 ol / ul 重置列表标记。宿主已画框（Popover / Dialog / Cascader）只组合滚动半（`listViewportClasses`），不带框。
2. 根：去列表标记；有序变体（`data-[ordered]`）换十进制标号 + `ps-6`。
3. 行：`px-3 py-snug`——行保持块布局（内容任意），44 下限由 padding 反解行盒而非 min-height（min-height 会把单行顶居中）；`text-sm` + `font-field`；行分隔 `border-b-hair` 发丝档（一边 0 一边整划，末行无线）；hover 与 `data-[highlighted=true]` 同吃 `accent` 对（键盘高亮 = 指针悬停）。
4. 组头：底色条（底色方案自答）+ `py-snug` 与行同高（44 命中梯，同高不同权）+ `text-sm leading-5`（与行同节奏，不另设小字号）+ `font-label`（label 比交互正文大，字族字重双轴区分）+ `tracking-label` + `case-label` + `surface-fg` 文字色，同款下分隔。
5. 空态：`surface-fg` 小字，`px-3 py-2`。
6. 组合导出：`listClasses` / `listPartClasses` / `listViewportClasses` / `listFrameClasses` 供 Cascader、Combobox、Command、FormItem 等宿主装配。
7. 专属令牌：无。
（neo 阴影）独立框半挂 shadow-frame——宿主内嵌的视口半不带框不受影响，minimal 无此工具类不渲染。
