# Typography 排版域（app/ui/schemes/<slug>/index.css）

蓝图：schemes.md rule 8 第 ⑤ 块的 `typo-*` 家族与第 ⑥ 块的长文作用域在本文件展开。

1. 定位：排版域只答「字符」——字号 / 行高 / 字距 / 字重 / 文字色，外加 code 与 link 的完整观感、list 的列表呈现（缩进与 `&:is(ul)` disc / `&:is(ol)` decimal 嵌套符号，preflight 清空后必须自带）、quote 的左边线与内边距。间距（块间margin）、边框线、表格、分隔线、行宽一律不属于排版域。
2. 两种用法、一套视觉——
   - 单挂：`typo-h1` ~ `typo-h6`、`typo-body`、`typo-quote`、`typo-list`、`typo-code`、`typo-link` 十一枚 `@utility`，任意元素单独挂即得该角色完整观感。
   - 区域：`typography` 类挂容器，由 `@layer base` 的 `@scope (.typography) to (.not-typography)` 把同一批 `@apply typo-*` 套到子孙的 h1–h6、p、ul/ol、blockquote、code、a 上；域内不含任何 margin 与结构样式，`.not-typography` 为逃生口；`pre code` 复位保留（pre 内 code 不吃芯片观感，属纠错非节奏）。
3. 单源约束：scope 元素规则与单挂 utility 一一对应，经 `@apply` 复用，域内零附加声明。
4. 逐档行高与字距：标题档读 `--leading-head`、正文档读 `--leading-body`、控件标签读 `--leading-label` 与 `--tracking-label`，字号越大相对行高越小、字距越紧（规律见 delivery `references/typography.md`）；同一 line-height 不铺全档，字距用 em 不用 px。
5. 中文混排：`@layer base` 的 `html` 字体块声明 `text-autospace: normal`，中西文与中文数字之间自动补 1/8 em 间隙（实测 16px 下每处边界 2px）；标点挤压由浏览器默认 `text-spacing-trim: normal` 承担，方案要换档时才声明，不写同值冗余声明。两条都是继承属性、渐进增强——不支持的浏览器忽略，排版退化为默认，不用 JS 改文本。
6. 块间距与行宽由使用方自答：文档站正文壳（docs-shell article）用子代工具类（`[&_p]:mt-5` 一类）自答散文节奏；demo 用 `gap-*`；行宽挂 `max-w-[40em]`（车道见 delivery `references/skin-rules.md` 16.1），排版域自身不带宽度。
7. 专属令牌：无——全部引用各方案 typography 令牌。
8. 无组件、无导出、无安装：类名即约定，直接写在标记上；文档只说明用法，不放安装模块。
