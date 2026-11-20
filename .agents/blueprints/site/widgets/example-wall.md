# 示例墙（app/components/example-wall.tsx）

- 数据源是当前皮肤的 `demoModules`（`app/demos/**`）：按 demo 目录名松散匹配组件 slug，标题取 `content/docs/component/_meta.ts` 的 `displayName`，非 `basic` 变体在标题后追加变体名。
- 不进墙的项：`use-*` 目录，以及无固定可视形态的虚拟滚动、拖拽、分页、远程分页、主题类 demo。
- 布局用库的 `Masonry` + `useLoadMore`；卡片进入近 viewport 才 `React.lazy` 挂载，同一 loader 复用缓存，挂载前显示骨架占位。加载哨兵以就近的 `[data-scroll-root]` 为观察根——哨兵处在滚动终点之外（滚动容器底部内边距不进可滚区），视口根的 `rootMargin` 穿不透滚动容器的裁剪，必须以滚动容器为根才能命中。
- 墙头标题即页题：en `Overview` / zh `总览`，`typo-h1` 与文档页 h1 同源；副句一行说明出处与用法。
- 卡片不设 `overflow-hidden`（它会裁掉标题链接的焦点环）：圆角经 `rounded-t-[inherit]` / `rounded-b-[inherit]` 继承卡片半径，demo 区自留 `overflow-hidden` 负责内容裁剪。`WallCard` 是墙的内部结构，不单独成组件；第二个使用场景出现时再提为 site widget。
- 卡片链接指向 `/{locale}/docs/component/{slug}`，经 `toSchemeHref` 保留当前皮肤车道。
- 根容器 `flex flex-col gap-6 w-full max-w-288 mx-auto`：水平居中随行宽自答，上边距由宿主页面承担。
- 使用场景与页面编排见 `site/pages/overview.md`。
