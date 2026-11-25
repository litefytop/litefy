# 指南页正文（内容域 · content/docs/ 根目录六篇）

- 本蓝图只负责指示性正文：介绍、安装、骨架、皮肤、动画与系统设置、AI 接入；总览归 `site/pages/overview.md`（主体是示例墙，不是文档），组件与 utils API 的骨架与外观分别归 `ui/components/`、`ui/skins/`、`ui/utils/` 蓝图。
- 导航外壳（侧栏面板、顶栏、页脚工具区、目录）归 `site/shell/navigation.md`；外观与动效面板归 `site/shell/appearance-panel.md`；应用内动效偏好归 `ui/utils/use-motion-preference.md`；顶部横幅归 `site/shell/motion-preference-notice.md`。本蓝图只维护篇目与正文。
- 侧栏由界面域渲染，本域只提供它消费的导航数据；一级、二级只表示显示层级，领域不随侧栏层级变化。
- 指南页以正文说明为主，不使用组件 demo 与源码框；正文里必要的文档站业务交互（icon 网格、初始化资源下载、实时偏好状态）放 `app/components/`，按 `site/widgets/` 蓝图维护。
- 正文与文档站交互组件按 delivery 的 guide 参考维护；引用的 UI 库能力按对应源码蓝图交付。
- 中文为正本；日常修改完成局部验证；英文同步与完整构建属于发版流程。
- 篇目按导航顺序：介绍 → 安装 → 骨架 → 皮肤 → 动画与系统设置 → AI 接入；slug 与中英标题以 `content/docs/_meta.ts` 为准。

## 导航与领域边界

- 文档导航正本为各目录 `_meta.ts`；指南页由本蓝图维护，组件与 utils 各按自己的领域蓝图维护。
- 内容篇目分三目录：`component/` 组件（可安装件）、`utils/` 工具函数、`utility/` 样式类——kbd、typo-* 等纯样式件（无组件封装、无导出、无安装，随皮肤样式层自带）归样式类，文档只写用法。
- 侧栏里的界面入口（非正文页，如颜色工具）由壳层追加，见 `site/shell/navigation.md`；入口指向的页面本身归 `site/pages/`，本域只写指向它的正文句子。

## 1. 介绍（index → content/docs/index.zh.mdx）

围绕主旨扩写成篇，纯文字无交互：这是一个 React19 组件库，遵循 Web 基线标准适配现代浏览器，组件以源码方式分发，有封装组件和原子组件，分别有 headless 模式和不同皮肤选择。

## 2. 安装（installation → content/docs/installation.zh.mdx）

```markdown
# 安装

组件采用源码分发，提供cli工具和手动安装两种方式。

## 安装cli

{介绍 cli 指令使用方法，以 packages/cli/readme.md 为准}

## 手动安装

组件库分为骨架和皮肤两种模式。手动安装时按需下载初始化资源。
```

## 3. 骨架（headless → content/docs/headless.zh.mdx）

主旨：组件本身没有样式，只提供组件的结构和行为，外观来自风格包或者自定义样式。

交互元素（文档站业务组件，放 app/components/，直接实现）：

- 适配器验证演示件（IconAdapterPlayground，蓝图见 site/widgets/icon-adapter-playground.md）：lucide / tabler 双适配器注入切换，验证换库后真实组件槽位照常工作

文案声明（一段话内嵌正文）：icons.tsx 是图标适配器，装组件自动带入（默认 lucide 字形、零 npm 依赖）；换图标库 = `litefy add <component> -i <lib>` 选官方适配器（落盘仍叫 icons.tsx，npm 包自动装），或手写同名导出的适配文件接任意库；导出名契约以 components/icons.tsx 为准。

## 4. 皮肤（styles → content/docs/styles.zh.mdx）

主旨：提示可以切换风格，然后根据当前路由，展示不同皮肤。

- showcase 入口：查看不同皮肤效果，再决定安装什么皮肤
- 展示不同皮肤的 index.css（代码块）
- 各皮肤 design.md 的预览/下载入口（design.md 是皮肤专属的设计语言文件）
- 禁用色：`disabled` / `disabled-fg` 是四案共有的独立令牌对；组件以独立禁用变体替换正常颜色与交互状态，保留圆角、边框、阴影和布局结构，显式使用 `cursor-not-allowed`，不使用灰度滤镜、`dim` 或禁用用途的 `pointer-events: none`；原生控件保留原生 `disabled`，自定义控件用 JavaScript 阻断动作
- 尺寸与留白：单基础值 `--spacing` 与倍数写法、紧凑档取整规则、内间距小于外间距的层级约束
- 宽度车道：六条车道的选道顺序（正文行宽 / 宿主 / 数字件 / 区间 / 浮层 / 定档）与两基定档表（控件级小容器 11 的倍数、容器级 16n），回答「这个件该多宽」；正本在 delivery `references/skin-rules.md` 第 16 条，本页只写面向消费方的说明，不复制皮肤写法细节
- 明度分层：三档面积预算的说法面向消费方——画布 `background` 约六成、内容容器 `surface-raised` 约三成、强调 `primary` 约一成；写清「需要被读的内容永远比画布更亮一档，日夜同向」，次要外壳（顶栏、侧栏、页脚）用更隐退的 `surface`，凹陷的输入区用 `well`；边框与阴影是第二道线，不是分层的主手段。令牌契约正本在 `ui/schemes.md` 第 21 条，本页只讲怎么用
- 风格预设：`/:lang/styles` 正文嵌 `StylePresets` 卡区（蓝图 `site/widgets/style-presets.md`）——点卡即时预览方案内换色，两枚复制按钮给 `<html>` 属性串与 CSS 变量块；正文说明「方案在安装期定（`init` / `-s`），颜色在运行期换」，不提供取色器入口，不承诺任意色值

## 5. 动画与系统设置（motion → content/docs/motion.zh.mdx）

- 面向使用者说明系统减少动态效果、应用内动效设置与组件主动暂停的关系，不把偏好当作环境错误。
- 应用内设置分为跟随系统、减少动态、完整动态；完整动态会忽略系统设置，正文要明确提示。入口在导航外壳的外观面板，不在正文里复制控件。
- 恢复动画以应用内为主：外观面板选“完整动态”，它优先于系统偏好；系统设置不维护各版本路径，只说明方向（Windows 开启动画效果、macOS 关闭减少动态）并外链 MDN。保留减少动态效果也是有效选择，不提供修改系统设置的网页按钮。
- 浏览器开发者工具的媒体查询模拟可能覆盖系统设置；检测结果以 `prefers-reduced-motion: reduce` 为准。
- 用文档站业务组件 `MotionPreferenceStatus` 同时显示系统偏好、应用内模式与合并后的实际效果；不嵌 `ComponentPreview`、不展示示例源码，开发者 API 链接到 utils 文档，不在本页复制接口说明。
- 明确 Banner 使用系统与应用内偏好合并后的结果，`playing` 不能绕过；恢复动画后仍受播放开关和悬停影响；页面不强制启用动画。
- 顶部提示为固定叠层，可随时关闭；关闭按标签页会话记忆，不改变任何偏好。

## 6. AI 接入（agents → content/docs/agents.zh.mdx）

面向 AI 编码助手的双语文档集（antd for-agents 模式），按关注点拆分：结构文档皮肤无关，design.md 皮肤专属；不做 headless/皮肤两套平行文档。

文档集组成：

- `/:lang/llms.txt`：文档导航索引（app/llms/ 路由输出）
- `/:lang/llms-full.txt`：组件全文文档；按 locale 分语，即 antd 的 llms-full + llms-full-cn
- `design.md`：皮肤专属，由各皮肤目录产出；本页列链接与用途，链接取 jsDelivr 上的方案正本。中英两份，英文按攒批补齐。这是唯一的皮肤专属文件——技能不随包分发，消费方只读文档与 design.md

页面内容：

- 可复制 prompt：说明各文件用途与消费规则——headless 项目只读结构文档（llms.txt/llms-full），忽略 design.md；皮肤项目 = 结构文档 + 所选皮肤 design.md；纯样式组件（无 headless 版）对 headless 项目不可用
- 文件清单表：名称、URL、语言、用途、适用范围（headless/皮肤）
- 接入方式：在线读取 URL / 复制全文

## 交付状态

- `_meta.ts`：篇目与顺序如篇目清单，slug 与中英标题一体。
- 翻译欠账由 `content/docs/sync.json` 白名单记账：改中文只移出白名单，发布前一次性补齐并登记，未翻译页面不登记。
- 验收 = dev 自测相符 + 双语门禁脚本；完整构建只在发布前跑，细则引用 delivery 的 guide 参考。
