# Popover 皮肤（app/ui/skins/popover.tsx）

1. 触发件：直接叠 `buttonVariants.outline`——按钮形披露件不重述按钮框；触发串模块层含 `pure-icon` 类（文字 / 纯图标双形态共串，属性 gating）；纯图标触发件（外观与动效、风格切换）由消费方显式传 `data-pure-icon` 唤起方型形态（`aspect-square` + 内距清零），消费方不手补 `px-0`。
2. 内容面板两层：外壳 `w-fit min-w-0 max-w-[min(20rem,calc(100vw_-_1rem))] max-h-96 overflow-hidden rounded-md border-frame border-border bg-surface-raised text-base leading-relaxed shadow-elevated` 负责封顶与圆角裁剪、自身不滚；外壳内由皮肤渲染滚动视口 `max-h-[inherit] overflow-auto` 包住 children——视口上限继承外壳档位，消费方对外壳的 `max-h-*` 覆写自动传导到滚动层。经典滚动条是方角、不随元素自身圆角裁剪，圆角与滚动同层时滚动条两端顶进圆角缺口，故圆角归外壳、滚动归视口，滚动条贴边、两端被外壳圆角裁掉。
3. 容器零内边距：外壳 padding 计入 `max-h`，滚动视口顶满时会裁掉底部留白——内容 padding 由消费者写在视口内的内容 wrapper 上，不落外壳也不落视口。
4. 组合导出：`popoverClasses`（trigger / content）供自带内容结构的 DropdownMenu / ContextMenu / Cascader 整体取用——浮层配方一处正本；补偿内边距不随配方携带，各消费组件面板串内联 `p-[var(--radius-md)]`（每组件面板只并一个变量，律见 `ui/schemes.md` 第 12 条）；`content` 为单层滚动形态（`overflow-auto` 直挂面板）。
5. 专属令牌：无。

## 待定项

- 单层滚动形态（DropdownMenu / ContextMenu / Cascader 面板）滚动条两端同样顶进圆角缺口，随各自重构接入两层结构。
