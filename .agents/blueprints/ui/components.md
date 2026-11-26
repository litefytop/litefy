# 骨架图标契约（app/ui/components/）

1. 骨架持有状态字形默认值：Eye/EyeOff、Loader2、Check、Chevron 系这类**状态字形**由骨架渲染——字形切换是行为（骨架域），尺寸颜色是外观（皮肤经 classNames 槽）。皮肤层禁止自绘 svg。
2. `components/icons.tsx` 是**图标适配器**，不是普通源文件：契约面 = 骨架消费面（用多少适配多少，零预留件）——只收骨架实际消费的字形（直接 `import { ... } from "./icons"` 或经 `icons` 映射按契约名取用，32 项：含 `icons` 映射 + `sourceNames` 契约名→来源库名映射表 + `IconName`/`IconProps`/`IconNode` 类型 + `createIcon`/`createFilledIcon` 工厂），消费方槽位图标（chat 发送/语音/附件、上传加图等）不在契约面，由消费方自备；骨架只 `import { ... } from "./icons"`。适配器按库各一份适配表文件：默认面 `app/ui/components/icons.tsx` 即 lucide 适配器（32 字形全内联、零 npm 依赖、16px 线性 svg 单源）；其余官方适配器住 `packages/cli/adapters/icons-<lib>.tsx`，每份文件分两部分——公共部分是契约全集导出（`createIcon`/`createFilledIcon` 工厂、`IconName`/`IconProps`/`IconNode` 类型、`icons`、`sourceNames`），字形部分是 32 项逐项取源的适配表：该库有对应字形 → `import` 该库组件做别名导出，无对应字形 → 内联与默认面同源的 Lucide 定义（回退 Lucide）；`sourceNames` 逐项指向当前实际来源库的导出名，回退项保持 Lucide 名，标签本身即回退信号。每份适配表文件必须导出契约全集，缺一类即违约；落盘同名 `icons.tsx`（`litefy add/install --icon-library <lib>`，registry 条目 `icons/<lib>`，声明该库 npm 依赖），骨架 import 不动；业务自定义图标不进适配表，由业务用工厂或自引库自行解决。导出名契约的站点展示面 = headless 页适配器验证节的字形网格（随适配器自动同步，各适配器数量必须一致）；源文件 `components/icons.tsx` 为唯一实现真相源。骨架新增图标位时同步扩契约面与全部官方适配器。
3. 每个骨架图标位暴露一个覆盖通道，皮肤要换字形经通道传入：覆盖 prop 名随位、与 classNames 槽同名 + `Node` 后缀（chevron 槽 ↔ `chevronNode`、check 槽 ↔ `checkNode`）；带状态标记的位用函数形态（collapse `icon`，`(open) => node` 持 `data-open`，旋转保留）。实现模式 `overlay ?? <Default/>`，缺省渲染默认字形，任何方案漏传都不破坏功能。
4. **适配器一致性门禁**：`scripts/check-icon-adapters.mjs`（types:check 链内）自动比对默认面与全部官方适配器（`packages/cli/adapters/icons-*.tsx`）的 `icons` 与 `sourceNames` 键集——数量、键名、键序三项完全一致即过，任何缺漏即红；换上适配器后跑全库 `types:check` 仍负责逐条 `import { ... } from "./icons"` 核对（缺导出即红）；③ 组件页 DOM 目检代表性图标槽（select 箭头、password 眼睛、pagination、dialog 状态等，tabler 类适配器以 `tabler-icon-*` 类名为活体标记）仍人工执行。注意各库默认尺寸差异（tabler 24px，lucide 适配器 16px），槽位尺寸由 classNames 控制。
5. 内容位通道沿用既有名不迁移：button `icon`（加载槽自定义图标）、breadcrumb / password `children`（整位内容语义），功能与 `*Node` 等价。

## 待定项

- 其余骨架图标位的通道补齐（banner X、chat 动作组、dialog / toast 状态字形映射、calendar 翻页、command 搜索、lattice-loader 标记、nav-bar、number-input、pagination、steps、table 排序、tabs 导航、thought-line、toc、transfer、tree）——通道模式与命名照本契约，逐组件补齐时同步各自组件蓝图。
- `check-icon-adapters.mjs` 是否扩展校验适配表文件的契约全集导出（工厂与类型），当前门禁只核 `icons` / `sourceNames` 键集。
- 适配表文件的 Lucide 回退定义与默认面的同源维护：手工拷贝、漂移由门禁键集核对兜底；是否改脚本从默认面生成待定。
