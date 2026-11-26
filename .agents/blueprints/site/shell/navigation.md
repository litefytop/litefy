# 导航外壳（app/components/docs-shell.tsx 与 showcase 顶栏）

- 层：界面域·壳层——跨页常驻外观（侧栏面板、顶栏、移动端抽屉、页脚工具区、目录栏）。同层的其他壳见本目录，嵌在正文里的交互件归 `site/widgets/`，独立路由的功能页归 `site/pages/`。
- 职责：文档壳与首页/展示页共用导航外观；正文归 `content/guide.md`，总览与工具页归 `site/pages/`，外观面板归 `site/shell/appearance-panel.md`，横幅归 `site/shell/motion-preference-notice.md`。
- 壳层网格：`h-dvh overflow-hidden` 满窗 grid；lg 起区域 `'topbar topbar' 'sidebar main'`——topbar 整行、侧栏整列、正文占余列；窄档单列 `'topbar' 'main'`。topbar 是横幅与浮动条共享的自动高度槽，业务决定互斥或组合，无内容时行塌缩；侧栏与正文之间无让位补丁，宽度由网格列自答，侧栏关闭时列塌缩、main 吃满。
- 滚动模型：文档页 window 恒不滚，滚动容器是 `main`（`overflow-y-auto` + `data-scroll-root` 标记）；路由切换 PUSH 归零、POP 按 sessionStorage 按路径恢复、带 hash 的导航跳过归零交给浏览器 `scrollIntoView`；root 的 `ScrollRestoration` 保留给非文档路由的 window 滚动。
- 正文盒随内容定高：`main` 挂 `items-start`——滚动容器默认的 `align-items: stretch` 会把正文盒钉成一屏高，正文溢出盒外即越过下内距、贴住滚动区底边；`items-start` 让盒随内容长，`pb` 呼吸位在正文末尾生效。目录列本就 `self-start`，不受影响。
- 页内滚动侦听一律容器无关：目录阅读进度与滚动侦测走 capture 相位 scroll 监听（scroll 不冒泡但 capture 上传到 window），浮动导航的回顶/回底就近查 `[data-scroll-root]`。
- 锚点让位走常量：滚动容器挂 `scroll-pt` 一个声明覆盖全部锚点目标，标题与表格不再逐个挂 `scroll-mt`；main 列内无覆盖层（顶栏是网格行），锚点落点只让呼吸空隙。
- 跳转链接：网格根第一个子节点是 `<a href="#main-content">`（`sr-only focus:not-sr-only`，聚焦时固定左上角浮出，双语标签「跳到主要内容 / Skip to content」）；`main` 挂 `id="main-content"` 与 `tabIndex={-1}` 作落点，键盘用户一键越过侧栏直达正文（a11y 下限见 ui-rules `operable.md` 20）。
- 侧栏断点 lg 起固定列，窄档抽屉（`openSidebar` 媒体查询与断点同值 1024）；浮动条 `lg:hidden`。
- 侧栏面板分三区：header 工具区（标识、收起/关闭、搜索入口）与 footer 工具区（风格、外观、语言、GitHub）定位固定，只有中列导航区（目录树）随内容伸缩并独立滚动；树展开不位移 header 与 footer，面板高度恒等视口，桌面列与抽屉同构。
- 页脚工具区只放外观、语言、GitHub 三个控件，右对齐，`gap-1`；外观按钮打开单一外观面板，不再分别放主题、风格、调色板按钮。GitHub 为链接型纯图标：直挂 `data-pure-icon="true"` 并挂 `pure-icon` 类 复用纯图标契约（禁手写 `px-0` / `aspect-square`）。
- 浮导航（FloatingNav，文档页右缘）四枚纯图标钮，自上而下为回顶 / 上一页 / 下一页 / 回底：前后页有目标时渲染 `Link`（复用 `buttonVariants.outline` + `pure-icon` + `aspect-square rounded-none`，不嵌 `Button`），无目标时渲染同外观的 disabled `Button`；所有纯图标钮同挂 `data-pure-icon="true"` 与 `pure-icon` 类复用纯图标契约；方角观感经 `rounded-none` 覆盖帧圆角（注册刻度内同组消解），不手写零内距 / 方型类。
- 浮导航仅桌面呈现：主指针为细指针且视口不窄于 48rem 才挂载整件（`(pointer: fine) and (width >= 48rem)`），粗指针或窄视口整件不渲染——移动端右下角不留浮动按钮；订阅 matchMedia 的 `change` 事件随主指针 / 视口切换挂载状态，服务端快照答 false（SSR 不输出，避免水合闪烁）；浮导航不靠 CSS 显隐占位。三处路由调用点不各自判环境，桌面门控只在组件内一处作答。
- 快捷键单点绑定且随浮导航同挂载：`Ctrl+↑↓←→` 四键只在浮导航一处监听（↑↓ 滚动到边、←→ 走 `findNeighbour` 前后页），输入件聚焦时不拦截；移动端浮导航不挂载即四键不监听，不另设桌面专用监听层。前后页同时有浮导航方向按钮与正文末尾 chip 跳转块（`site/widgets/docs-page-nav.md`）两个可点入口，快捷键提示只写在浮导航按钮的 `title`，跳转块不渲染键帽。跳转块只随正文页存在，总览页（`site/pages/overview.md`）无正文列，前后页走浮导航按钮、快捷键与侧栏。
- 三控件保持 44×44 命中区，不缩控件、不加宽侧栏。侧栏宽读 `w-64`（默认 16rem，随 `--spacing` 逐案缩放，neo 24rem）；页脚 `px-3` 下默认案可用 232px，三控件加两处间距共 140px；不套零间距外容器，避免焦点环与 hover 边界相撞。
- 顶栏复用同一外观按钮，保留语言，不放 GitHub（GitHub 由文档页侧栏页脚承载）；移动端从抽屉页脚进入，不新增独立入口；首页与 showcase 顶栏同构。
- 首页顶栏控件：搜索 <sm 收成 44×44 图标按钮（sm 起展开为定宽搜索框，md 起带 Ctrl K 角标，角标用 `kbd` 工具类键帽（schemes/kbd.md 同源））；风格切换为 44×44 图标按钮，点开下拉菜单列出全部方案、当前方案打勾；外观与语言为 44×44 图标按钮；站点名恒显 logo 图标与文字；空间不足时站名文字收缩截断兜底，logo 不缩、控件命中区不动。验收下限 320px 视口。
- 壳层容器不设最大宽度：文档壳的正文区与横幅全宽随视口，`max-w-320` 只属首页/展示页等页面域容器（其顶栏与页脚随页面域）；目录列随 main 右缘排布，正文列自身仍走宽度车道（spacing 数字乘道）。
- 目录与侧栏随网格行自答位置；桌面目录由 `main` 直接子级的 `sticky top-8 self-start shrink-0` 包装列吸顶，包装列高度按目录内容收缩，内层 `nav` 不再受 flex 拉伸成一屏高；浮动条与横幅进入共享 topbar 正常文档流，不使用 `fixed`、`sticky` 或高度变量；桌面端正文顶部留白由 main 自身 padding 常量承担。
- 目录按页开关：目录数据来自文档页的结构化标题（docs-view 收页后经 store 传 `toc` prop 给壳），`toc` 为空整列不渲染；正文 frontmatter `toc: false` 显式关闭单页目录（docs 集合 schema 扩展该布尔位，headless 页为现例）——单页开关不引入壳层按路径的特殊待遇。
- 导航数据只读 `pageTrees` 与 `_meta.ts`，不在壳层复制正文或标题；界面入口（如颜色工具）由壳层追加，其页面本身归 `site/pages/`。
- 界面入口的 href 留在当前车道：`toSchemeHref` 的车道内路径白名单覆盖文档路径与 `/[:lang]/tools/color`，四道侧栏点「颜色工具」进本道 `/[前缀/]:lang/tools/color`，不回落到默认方案；正文链接（mdx）、搜索结果与浮动导航走同一白名单，不加单案特殊处理。
- 正文列（`article.typography`）宽走 `max-w-160` 居中（40rem 基准，随 `--spacing` 逐案缩放，neo 60rem）：列宽随方案栅格缩放，demo 等演示件随列同宽、neo 占据更大空间，手机端 `w-full` 不超屏宽；段落、列表、引文守 40em 阅读行宽（`[&>p]:max-w-[40em]` 子代类收窄、随列左对齐不居中——基准案行宽与列宽同值无差异，neo 行宽窄于列宽、右侧留白属预期；a11y 下限见 ui-rules `perceivable.md` 19，车道见 delivery `references/skin-rules.md` 16.1）。正文间距只走令牌乘道（`mt-*` / `mb-*` 即 `--spacing` 倍数），壳层不为任何单案额外加第二处间距处理（用户定 2026-11-22）。
- `DocsArticle` 两头各挂一块壳件：头部是页题工具条（复制 Markdown 与打开菜单），末尾是上一页 / 下一页跳转块 `site/widgets/docs-page-nav.md`（文档树由路由经 `tree` 传入，不传即不渲染）；跳转块自带 `not-typography`，工具条只含按钮件、不吃正文链接排版。
- 正文标题（h2–h6）统一下间距 `mb-5`：标题与后续任意块（正文、Tabs、代码块、预览件）都有衔接间距——正文块的 `mt-5` 与之塌陷不叠加，块级演示件（无自身外距）由标题下间距兜底。
- 正文表格单元格（`td`/`th`）挂 `overflow-wrap: anywhere` 兜底：固定布局列内的无词界长串（URL 式 token、超长类型）允许任意字符处换行，词界换行由 MDX 渲染层（`site/shell/mdx.md`）的 `<wbr>` 承担。
24. 文字色配对（`site/shell/contrast.md`）：顶栏、侧栏、浮动条、跳转链接聚焦态与页脚铺 `bg-surface` 时统一继承或显式挂 `text-surface-fg`，侧栏与顶栏 logo 的 `fill` 同读 `surface-fg`；按钮自己的前景色不得覆盖表面配对。正文画布上的描述、表头以外的次要文字与目录读 `foreground`；文档表头改实色 `bg-surface text-surface-fg`，不用半透明表面色配深字。侧栏内 Tree 的行、触发钮与分组标签由消费方覆盖为 `text-surface-fg`，激活行仍覆盖回 `text-primary-fg`。
