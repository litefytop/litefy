# Typography 排版域（app/ui/schemes/<slug>/index.css）

蓝图：schemes.md rule 8 第 ⑤ 块的 `typo-*` 家族与第 ⑥ 块的长文作用域在本文件展开。

1. 定位：排版域只答「字符」——字号 / 行高 / 字距 / 字重 / 文字色，外加 code 与 link 的完整观感、list 的列表呈现（缩进与 `&:is(ul)` disc / `&:is(ol)` decimal 嵌套符号，preflight 清空后必须自带）、quote 的左边线与内边距。间距（块间margin）、边框线、表格、分隔线、行宽一律不属于排版域。
2. 两种用法、一套视觉——
   - 单挂：`typo-h1` ~ `typo-h6`、`typo-headline`、`typo-kicker`、`typo-body`、`typo-quote`、`typo-list`、`typo-code`、`typo-link`、`typo-overline` 十四枚 `@utility`，任意元素单独挂即得该角色完整观感。
   - 区域：`typography` 类挂容器，由 `@layer base` 的 `@scope (.typography) to (.not-typography)` 把同一批 `@apply typo-*` 套到子孙的 h1–h6、p、ul/ol、blockquote、code、a 上；域内不含任何 margin 与结构样式，`.not-typography` 为逃生口；`pre code` 复位保留（pre 内 code 不吃芯片观感，属纠错非节奏）。
3. 标题阶梯律（用户定则）：长文阅读层级的 h1–h6 字号逐级递减，下限为正文——任何标题档都不小于正文（h6 ≥ 1rem），深层级标题靠字重与字号双通道分层；headline / kicker / overline 是展示与标注角色，不在标题阶梯内（overline 保持「标注小于标题」）。
4. headline 展示档：落地页与展示页首屏的唯一大标题（首页 hero、404 大字、方案 showcase 首屏题），每屏至多一个。与相邻档的分界——h1 是长文阅读层级的顶格档（文档页标题），headline 是首屏展示级大字、不是阅读角色：只单挂、不进长文作用域，区域映射不含它。字号读 `--text-headline`（流动值 `clamp(2.25rem, 1.5rem + 3vw, 3.75rem)`，示例值：小屏约 2.25rem、768px 约 2.9rem、1200px 起顶到 3.75rem，四案同答），行高读 `--leading-headline`、字距读 `--tracking-headline`（字号越大行高越小、字距越紧，字距用 em），三令牌与字重每案必答；headline 靠 clamp 连续自适应视口，不进紧凑档媒体 ramp（文字档不动律照旧，紧凑 ramp 不改任何文字令牌）。
5. overline 眉标档：分区眉标（showcase 分区题、文档分区之上的标注行），单行小字，与它标注的 h1 / h2 保持「标注小于标题」的层级。与相邻档的分界——`--text-label` 机制族（`font-label` / `case-label` / 四轴捆绑 `control-label`）是控件与字段标签、随控件走；`overline` 是排版展示角色：大写、最宽字距、小字号，只单挂、不进长文作用域，区域映射不含它。字号读 `--text-overline`、字距读 `--tracking-overline`（em），行高读 `--leading-label`（单行小字与标签同一行盒答案，不另设令牌）；大写内建于角色本体，字重每案必答。
6. kicker 引导档：首屏 headline 之上的引导行（hero 眉标），黄金比展示档——字号 = 正文 × φ（1.618），取斐波那契 13/8 有理近似答 `1.625rem`（正文 16px 下整 26px、无小数，示例值；链上再 ×13/8 得 42.25，落在 headline 流动区间 [2.25rem, 3.75rem] 内，链路自洽）；大写与最宽字距承 overline 的声腔，字距复用 `--tracking-overline`（em 随字号缩放）、行高读 `--leading-headline`（展示档行盒），字号读 `--text-kicker`，字重每案必答。只单挂、不进长文作用域。与 overline 的分界：kicker 与 headline 配对、比正文大；overline 与 h1 / h2 配对、比正文小——两个场景两档，不共用一个档名。
7. 单源约束：scope 元素规则与单挂 utility 一一对应，经 `@apply` 复用，域内零附加声明。
8. 逐档行高与字距：标题档读 `--leading-head`、正文档读 `--leading-body`、控件标签读 `--leading-label` 与 `--tracking-label`、headline 档读 `--leading-headline` 与 `--tracking-headline`、kicker 档读 `--leading-headline` 与 `--tracking-overline`、overline 档读 `--leading-label` 与 `--tracking-overline`，字号越大相对行高越小、字距越紧（规律见 delivery `references/typography.md`）；同一 line-height 不铺全档，字距用 em 不用 px。
9. 中文混排：中西文与中文数字之间的自动补隙（1/8 em，实测 16px 下每处边界 2px）由浏览器默认承担——`text-autospace` 初始值即 `normal`，不写同值冗余声明，方案要关闭或换档时才显式声明；标点挤压同理由默认 `text-spacing-trim: normal` 承担，换档才声明。两条都是继承属性、渐进增强——不支持的浏览器排版退化为默认，不用 JS 改文本。
10. 块间距与行宽由使用方自答：文档站正文壳（docs-shell article）用子代工具类（`[&_p]:mt-5` 一类）自答散文节奏；demo 用 `gap-*`；行宽挂 `max-w-[40em]`（车道见 delivery `references/skin-rules.md` 16.1），排版域自身不带宽度。
11. 专属令牌：无——全部引用各方案 typography 令牌。
12. 无组件、无导出、无安装：类名即约定，直接写在标记上；文档只说明用法，不放安装模块。
13. 正文字色：`typo-body` / `typo-quote` 落在文档画布，文字色读 `foreground`；`surface-fg` 只配实际表面背景，不承担长文正文或引文色。

## 待定项

- neo-brutalist showcase 车道的装饰数字与画布标本（hero 统计值、规则编号大字、Aa 对比标本）仍用 Tailwind 命名字号档，未迁回方案阶梯：它们是图形元素而非阅读角色，阶梯里没有对应档位；是否为「展示数字」增设档位待定。其余 showcase 档外类名（首屏题 `text-[96px]`、minimal `text-36` 一类死类、分区题与排版区裸用命名档）已迁回 `typo-*` 阶梯。
