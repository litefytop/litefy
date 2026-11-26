---
name: new-scheme
description: 新增 Litefy UI 风格（app/ui/schemes/ 下第三套及以后的 index.css + design.md）前调用——步骤序、@theme 声明判定、共享角色清单、base 层全局 vs 挂载判定、design.md 写法约定
---

# 新增风格

1. 触发：新增第三套及以后的风格；minimal 与 neo-brutalist 是参照实现
2. 步骤序：① 先列签名特征清单（形态类 2~5 项）写进 design.md prose 签名清单节——排版节奏类参数（间距基数、行高阶梯、全局默认字体、标签大小写）不承载风格、回归基础档（蓝图 `ui/schemes.md` 第 26 条收敛律）；② 再写 `design.md`——文件头 YAML 块是数值唯一权威，正文只讲规则与去处；③ 跨方案新约定先落蓝图 `ui/schemes.md` 再动源码（蓝图先行）；④ `index.css` 按蓝图第 8 条六块实现，`@theme` 逐档对齐 YAML，不一致以 YAML 为准并报告冲突；⑤ 门禁 `pnpm types:check` + dev 冒烟核产物
3. 令牌与结构不变量看蓝图 `ui/schemes.md`——22 枚色板、六块定序、角色完备律、机制值单源，此处不重复
4. `@theme` 声明判定：核心不存在的名字 → 方案声明（先例：`--text-h1…h6`、`--height-control`）；核心存在但取值不同 → 重答（先例：`--font-sans`、neo 的 `--tracking-tight`）；核心存在且同值 → 不声明，核心即答案（先例：minimal 的 `tracking-*` / `font-weight-*` 已删）。例外：字体族必在 `@theme` 声明、值即 YAML（蓝图第 10 条），与核心同值也声明
5. 共享角色一条不许缺席：`shadow-frame` / `shadow-block` / `shadow-surface` / `shadow-elevated` / `focus-ring` 系 / `--stroke-cap` / `--stroke-join` / 控件标签声 / `--animate-pulse`——缺答的角色在共享皮肤串里是静默缺失，编译不报错、观感直接丢
6. 机制优先走核心模板，不造平行件：核心已有的能力（先例：`animate-pulse`），新方案只在 `@theme` 重答值，不新造自定义 utility 复制核心
7. base 层全局 vs 挂载判定：会与皮肤产生目标歧义或属性竞争的，不设全局——显式挂载（先例：焦点环走 `focus-visible:focus-ring`，内层件不挂即无环；按压反馈由皮肤显式挂 `active:` utilities，未挂即无按压）；皮肤表达不了、或表达错了会变成功能缺陷的，留在方案层（先例：禁用 + `[inert]` 契约、裸 `border` 发丝色）
8. 排版作用域用 `@scope (.typography) to (.not-typography)`、内部只写元素名选择器——@scope 不加权，层契约与岛语义见两份参照 `index.css`；不用 `:where` 链
9. `design.md` 正文写法：编号分段短句；Do / Don't 只留方案语言边界，通用禁令外链 delivery 的 `references/skin-rules.md`、排版外链 `references/typography.md`、动效外链 `references/motion.md`、装饰外链 `references/decoration.md`、无障碍外链 ui-rules 技能；Components 只留专属令牌与未迁移短条，组件角色归蓝图 `ui/skins/<name>.md`；长文作用域机制描述随 `index.css` 同步
10. 固定色方案不设 `[data-brand]` / `[data-surface]` ramp；可运行期换色的方案才设，且只重指向色板内令牌（先例：minimal 设、neo 不设）
11. 每套方案必须自答的三层参数，缺答即静默降级：字号阶梯逐档配行高与字距（不是全局一个 line-height）、时长三档配缓动与减动效清零、装饰层参数全部出自令牌——判定与下限见第 9 条三份外链，本文件不重复
