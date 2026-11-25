# 源码文件浏览器（app/components/source.tsx · Source / FileSource）

- 文件列表态：顶栏 `app/ui/` 路径眉 + 分组（无样式骨架 / 皮肤 / 样式入口）文件钮，自然高度。
- 预览态：顶栏当前文件名 + 返回钮；预览根 flex 列、默认定高 `h-128`，预览码区 `min-h-0 flex-1 overflow-hidden p-3` 撑满剩余高度且不滚；CodeStage 传 `h-full! aspect-auto!` 取消 site.css 的 4:3 定窗（aspect-ratio/height 为无层规则，须 important 覆盖）改撑满码区——单一滚动条归 CodeStage 内部 `code-stage-scroll`，码区与预览根均不滚，杜绝连续滚动条。
- 高度经 `className` 由消费方接管：传 `min-h-0 flex-1 h-auto max-h-none` 即撑满父容器（安装卡固定比例容器），码区随之撑满、CodeStage 单内滚；不传则默认定高 `h-128` 窗口单内滚（`styles.mdx` 的 `StyleStylesheets` 消费观感）。