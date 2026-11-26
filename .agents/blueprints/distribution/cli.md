# CLI 分发（packages/cli）

- 域：分发域——`packages/cli/**` 与生成注册表的 `scripts/copy-registry.js`（发什么、怎么取）。命令与选项以 `packages/cli/readme.md` 为准。
- 职责：`packages/cli/` 是唯一随 npm 发布的单元（包名 `litefy`），按 `registry.json` 把源码文件复制进用户项目；`sources/` 只做离线兜底，与注册表同源——镜像不入库、不驻留仓库工作树：发布打包时由 `sync-sources` 现生成进包，发布完成后即清理，平时需要本地兜底时手动 `cli:sync` 临时生成。
- 只分发源码：注册表逐文件列组件骨架、组件皮肤、纯样式组件、hooks、utils 与方案样式表，新增或改名组件同步注册表，不维护第二份清单。
- `add <component>` 恒定安装骨架 + 对应皮肤：组件条目挂 `skin` 字段指向 `app/ui/skins/<name>.tsx`，皮肤落入用户项目的 `skins` 目录；皮肤文件只是不被引用也不会破坏编译，headless 消费者可手动删除。
- 纯样式组件（无骨架：callout / card / badge 等）注册表收编为 `type: "skin"` 条目，`add callout` 直接安装皮肤文件——安装不存在失败分支；皮肤间相对依赖（`./cn` / `./button` 等）经条目 `dependence` 一并解析。
- 皮肤间相对导入跨到骨架的（如 skins/number 引 components/input），由骨架条目的 `dependence` 兜底——骨架带入，其皮肤随组件条目同行。
- `litefy.json` 三目录：`components` / `utils` / `skins`（`skins.path` 缺省为 components 同级的 `skins`，兼容旧配置）+ 各自 installed 清单；三个目录的 barrel 由 CLI 回写。根 `ui/index.ts` 桶只含 components + utils——成品名（Button 等）在骨架与皮肤两层同源，`export *` 合桶会互相遮蔽，皮肤经 `@/ui/skins` 独立消费。
- 方案是项目级一次性决定：`init` 交互选定（发品位清单 = minimal / neo-brutalist / flat-minimal / 暂不选=纯 headless），写入 `config.scheme` 并装该方案 `index.css`；已定方案后每次 `add` 末尾自动整包同步样式，无需重复携带；`-s` 语义收敛为「切换方案」（改写 `config.scheme` 并重装样式表）。混用方案不支持，注册表不提供按组件选方案的形态。
- 发品位是一份显式清单，不是目录扫描结果：`scripts/copy-registry.js` 的 `style/*` 条目与 `init` 的方案选项同读该清单（`minimal` / `neo-brutalist` / `flat-minimal`），`neon-gradient` 属渐变风格实验轨——目录、`index.css`、`/neon` 路由照常存在且可读，只是不进注册表、不进 `init` 选项（口径见 `ui/schemes.md` 待定项）。实验轨转正式发布 = 名字加进清单，不改其它分发代码。
- 方案内换色属运行期，不属安装期：`config.scheme` 只答「哪套方案」，颜色档经根元素属性（`data-brand` / `data-accent` / `data-surface`，梯的存在与数量由方案 `index.css` 的 ramp 决定）选择，安装流程不选颜色。`litefy style <scheme> --preset <组合>`（如 `--preset lime/amber`）只做两件事——把属性组合写进 `config.preset`、打印 `<html>` 上的接法与当前档说明；不生成第二份 CSS 文件、不改写 `styles/index.css`。ramp 正本该在方案样式表里，CLI 复制一份值就会与它漂移。
- 方案样式安装强制覆盖 `styles/index.css`（含切换方案与每次 `add` 的自动同步）：方案排他，样式表必须与 `config.scheme` 一致并取 CDN 最新内容，不走「已存在则跳过」。
- 不分发技能：不设装技能的命令、不设技能清单、npm 包不带技能文件；仓库内技能是单语工程资产（`.agents/skills/**`），只在仓库里用。
- 对外学习面是双语文档：`content/docs/**` 与 `/:lang/llms.txt`、`/:lang/llms-full.txt`，皮肤另加各方案的 `design.md`（jsDelivr 直链；中英两份，英文攒批翻译）。方案目录只有 `index.css` 与 `design.md`。
- 方案以整体为单位安装：`add style` 只交付该方案 `index.css`，它是纯主题层（令牌 + base + `@theme` + 变体 + `@utility`），不含 `@import "tailwindcss"` 与 `@source`。入口接线归消费方：用户在自己的 Tailwind 入口先 `@import "tailwindcss"` 再 `@import` 该 `index.css`（tailwind 在前，先声明级联层序），由用户入口的扫描覆盖安装的皮肤与用户业务代码（皮肤类按安装文件逐类生成，未安装不生成；排版经 base 层 `@apply` 常载，属方案身份层，不依赖扫描）。CLI 不改写任何扫描路径。站点入口（`app/global.css` 与 neo / neon / flat 路由入口）自持 `@import "tailwindcss" source(none)` + `@source` 做精确扫描。
- 图标适配器（契约见 `ui/components.md`）：registry 条目 `icons` 是默认适配器（lucide 实现，零 npm 依赖，随骨架 dependence 自动带入）；备选适配器条目 `icons/<lib>` 每库一份，源文件住 `packages/cli/adapters/icons-<lib>.tsx`（官方首批 tabler 与 phosphor，如 `icons-tabler.tsx`、`icons-phosphor.tsx`），由 `scripts/copy-registry.js` 扫描该目录自动生成条目——库名取文件名去 `icons-` 前缀，`dependencies` 经 `scanExternalImports` 自动收集该库 npm 包；条目带 `installAs: "icons.tsx"`（落同名文件，组件 import 不变）与 `barrel: false`（适配器不进 components barrel——字形名与组件名撞车，如 glyph Calendar vs 组件 Calendar；默认 `icons` 条目同为 `barrel: false`）。新增适配表 = 在 `adapters/` 落一份 `icons-<lib>.tsx`，注册表零配置跟进。
- `add/install` 的 `-i, --icon-library <lib>`：lucide 即默认面；非 lucide 时 `icons` dependence 解析到 `icons/<lib>` 条目（查无此条目则报错并列出可用库）；`-i` 显式指定图标库时 `icons.tsx` 视作可覆盖文件，已存在也直接覆盖，不要求 `--overwrite`（其余文件覆盖规则不变）；裸 `install` 全量安装时跳过 `icons/*` 适配器条目（它们只经选项生效）。
- registry 条目新字段：`installAs`（落盘文件名覆盖，`addSingle` 按它命名）、`barrel: false`（`writeBarrelIndex` 跳过该条目）。
