# 骨架图标契约（app/ui/components/）

1. 骨架持有状态字形默认值：Eye/EyeOff、Loader2、Check、Chevron 系这类**状态字形**由骨架渲染——字形切换是行为（骨架域），尺寸颜色是外观（皮肤经 classNames 槽）。皮肤层禁止自绘 svg。
2. `components/icons.tsx` 是**图标适配器**，不是普通源文件：它对骨架暴露固定的导出名清单（全部字形 + `icons` 映射 + `sourceNames` 契约名→源库名映射表 + `IconName`/`IconProps`/`IconNode` 类型 + `createIcon`/`createFilledIcon` 工厂），骨架只 `import { ... } from "./icons"`。默认实现取 lucide 字形、零 npm 依赖（16px 线性 svg 单源内联）；**换图标库 = 替换这一个文件**：`litefy add/install --icon-library <lib>` 安装官方适配器（registry 条目 `icons/<lib>`，`installAs: "icons.tsx"` 落同名文件并声明该库 npm 依赖），或手写同名导出的适配文件接任意库。导出名契约的站点展示面 = headless 页适配器验证节的字形网格（随适配器自动同步，各适配器数量必须一致）；源文件 `components/icons.tsx` 为唯一实现真相源。
3. 每个骨架图标位暴露一个覆盖通道，皮肤要换字形经通道传入：覆盖 prop 名随位、与 classNames 槽同名 + `Node` 后缀（chevron 槽 ↔ `chevronNode`、check 槽 ↔ `checkNode`）；带状态标记的位用函数形态（collapse `icon`，`(open) => node` 持 `data-open`，旋转保留）。实现模式 `overlay ?? <Default/>`，缺省渲染默认字形，任何方案漏传都不破坏功能。
4. **适配器验证标准动作**（新增或修改适配器后必做，三查缺一不可）：① 换上适配器后跑全库 `types:check`——TS 对全库每一条 `import { ... } from "./icons"` 逐一核对，缺导出即红（目检证不了契约完整性，本次实测即靠它抓出 PanelLeft / Sparkle 三个错名）；② headless 页适配器验证节网格：字形数量与默认面（37）**完全一致**——超集与缺集都是适配器面错误，数量一致是契约信号；③ 组件页 DOM 目检代表性图标槽（select 箭头、password 眼睛、pagination、dialog 状态等，tabler 类适配器以 `tabler-icon-*` 类名为活体标记）。注意各库默认尺寸差异（tabler 24px，lucide 适配器 16px），槽位尺寸由 classNames 控制。
5. 内容位通道沿用既有名不迁移：button `icon`（加载槽自定义图标）、breadcrumb / password `children`（整位内容语义），功能与 `*Node` 等价。

## 待定项

- 其余骨架图标位的通道补齐（banner X、chat 动作组、dialog / toast 状态字形映射、calendar 翻页、command 搜索、lattice-loader 标记、nav-bar、number-input、pagination、steps、table 排序、tabs 导航、thought-line、toc、transfer、tree、wizard）——通道模式与命名照本契约，逐组件补齐时同步各自组件蓝图。
