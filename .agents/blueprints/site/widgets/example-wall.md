# 示例墙（app/components/example-wall.tsx）

- 数据源是当前皮肤的 `demoModules`（`app/demos/**`）：每个目录只消费 `basic.tsx`，按 demo 目录名松散匹配文档 slug，并解析其所属 section——glob `content/docs/**/*.mdx` 建 looseName→{section, slug} 映射（component / utility / utils 各段一并收录），标题取对应段 `_meta.ts`（eager glob `content/docs/*/_meta.ts`）的 `displayName`；typography / kbd 文档在 utility 段，按段解析才能取对标题与路由。
- 不进墙的项：`use-*` 目录，以及无固定可视形态的虚拟滚动、拖拽、分页、远程分页、主题类 demo。
- 布局用逐行网格 + `useLoadMore`：`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` 与 `gap-4` 负责响应式列数和间距，卡片从左到右、从上到下填充，不足一行时只在末尾留空；不读取卡片高度、不做列分配。卡片进入近 viewport 才 `React.lazy` 挂载，同一 loader 复用缓存，挂载前显示骨架占位。加载哨兵以就近的 `[data-scroll-root]` 为观察根——哨兵处在滚动容器底部内边距之外，视口根的 `rootMargin` 穿不透滚动容器的裁剪，必须以滚动容器为根才能命中。
- 墙头标题即页题：en `Overview` / zh `总览`，`typo-h1` 与文档页 h1 同源；副句一行说明出处与用法。
- 卡片不设 `overflow-hidden`（它会裁掉标题链接的焦点环）：圆角经 `rounded-t-[inherit]` / `rounded-b-[inherit]` 继承卡片半径，demo 区负责内容滚动与裁剪。
- demo 预览区固定 `h-64`；内部 `DemoFitBox` 用 `ResizeObserver` + `requestAnimationFrame` 读取 demo 的自然宽高，按预览区可用宽高等比缩放并垂直居中，缩放上限为 1；逐行网格不读取卡片高度、不参与缩放计算，两类测量互不依赖。超宽或超高 demo 优先缩小完整展示，加载占位骨架与预览区同高；标题链接进入文档页查看原始尺寸与完整交互。`WallCard` 与 `DemoFitBox` 是墙的内部结构，不单独成组件；第二个使用场景出现时再提为 site widget。
- 卡片链接指向 `/{locale}/docs/${section}/${slug}`（section 按 slug 所属文档段解析，component / utility 等），经 `toSchemeHref` 保留当前皮肤车道。
- 根容器 `flex flex-col gap-6 w-full max-w-288 mx-auto`：水平居中随行宽自答，上边距由宿主页面承担。
- 使用场景与页面编排见 `site/pages/overview.md`。
