# litefy-design 变更记录

设计规范与检测脚本的历史版本说明。当前版本见 SKILL.md 头部 `version` 字段。

- **2.8.0（2026-09-28）**：新增官网与文档分层指引——头部声明官网 litefy.top（组件文档、面向 AI 的 `llms.txt` / `llms-full.txt`、技能分发页）与"用法不内嵌"分层约定（设计约束进本文件，API 细节一律外链：仓库内查 `AGENTS.md` / `content/docs`，仓库外查官网）；§0"选组件"按所在环境分流（本仓库查 AGENTS.md，装进业务项目后查官网）；description 面向分发场景微调（适用范围改为"任何使用 Litefy UI 的项目"，排除项改为"不使用 Litefy UI 的项目"）。
- **2.7.0（2026-09-22）**：无障碍静态检查切换为 `oxlint --jsx-a11y-plugin` 一次性调用（`pnpm dlx`，零仓库依赖，§12.2），移除 eslint 配置示例；文档瘦身——删除示例代码块（规则由 design-detect 机器执行，无需示例），变更记录外置到本文件（不再属于 SKILL.md 正文）；design-detect 新增 `nested-tabs` warn（Tabs 面板内嵌套 Tabs，§11 Tabs 反模式 / §12.4）。
- **2.6.0（2026-09-21）**：§15 Table 新增两条强制约束——数据型表格必须配套分页导航（服务端分页优先）；行内操作按钮配色强制（`text-primary` 普通 / `text-danger` 危险，禁止前景色与 warning），文案两字动词优先并列宽下限；补充"单元格截断须 `block truncate`"（行内 span 的 truncate 无效）。
- **2.5.0（2026-09-20）**：Tabs 组件新增面板双模式 `unmountOnHide`（销毁 / hidden 保活）与 `panelClassName`（§11），保活面板带行内 display 兜底；RadioGroup 修复 options 透传 `id` 不落到控件的缺陷；§12.2 改为标准工具分工（eslint-plugin-jsx-a11y 静态 + axe-core 渲染后）；design-detect 随 skill 分发（skill 内 `scripts/design-detect.mjs`，扫描根目录按安装位置自动推断，§0 / §12.4）；新增 Tabs 组件规范与"触发条 + 手搓 hidden 面板"反模式（§11）；§10.5 新增盒中盒反模式；design-detect 新增 `tabs-manual-panels`、`nested-scroll` warn，并明确**不做无障碍规则**的职责边界（§12.4）。
- **2.4.0（2026-09-19）**：Chip / Callout 变体对齐代码实现（`error` → `danger`，移除未实现的 `surface`）；按压 `inset` 阴影收口到组件层（§3 / §10.5）；业务代码阴影强制语义名，新增 legacy-shadow-name warn（§5 / §12.4）；design-detect 修复内联 `rgb()` 漏检、`bg-[#fff]` 重复报与 URL 锚点误报；补充错误文案与双语文档同步规则（§9 / §10）。
- **2.3.0（2026-09-19）**：新增工作流（§0）、反模式库（§10.5）、验证闭环（§12）与 design-detect 机器检测；暗色阴影三件套（`--surface-raised` / 白色亮环 / 顶部内高光，§5）；Tailwind 默认刻度映射语义四级；组件带阴影时的焦点/按压态工具类化说明（§3）。
