# FilterCombobox 骨架（app/ui/components/filter-combobox.tsx）

- 职责：脱离表格的一行筛选器。开发者传入字段与每列允许的操作符；输入列名出现候选，选中列名后出现该列操作符候选，选定操作符后在行内输入值并提交成一条规则；规则通过 `value` / `onChange` 传出。支持复杂筛选（多规则、区间操作符）。
- 表格筛选是外部行为：`FilterCombobox` 只产出 `FilterRule[]`，消费方自行驱动 `Table` 过滤；共享 `app/ui/utils/filter-query.ts` 的 `FilterRule` / `FilterOperator`。
- 导出：`FilterCombobox`、`FilterComboboxStatus`、`FilterComboboxProps`、`FilterComboboxStatusProps`、`FilterComboboxClassNames`、`FilterComboboxStyles`、`FilterComboboxRef`、`FilterComboboxFetcher`、`FilterChipRender`、`FilterChipRenderArgs`、`FilterOptionRender`、`FilterOptionRenderArgs`。

## 交互

- 输入区模型：一根连续的 token 输入流——已提交 chip、草稿 chip、输入框同处一个 `flex-wrap` 行，输入框是流中最后一个伸缩件（`flex-[1_1_8rem] min-w-16`），光标始终跟在已有内容末尾、位置随内容宽度自然流动；输入不因阶段切换而分段、重置或换位置，自始至终在同一个输入框里连续进行。没有固定前缀文本，没有独立的「已选展示区」
- 草稿 chip：选中列后列名即以虚线草稿 chip（`draft` 槽）落入输入流、紧贴光标之前，与已提交的实线 chip 区分；选定操作符后扩展为「列名 + 操作符」；值输入中光标跟在 chip 后面的输入框里继续打字。chip 为纯视觉件（`aria-hidden`），语义由输入框占位与 `role="status"` 播报承担；`Esc` 逐级回退即草稿 chip 逐级收缩（`value → operator → field`）
- 草稿控制钮在输入框（与 hint）后方、跟随换行：确认钮（`submit` 槽，取 `Check` 图标，`texts.submitText` 作可访问名）仅在值阶段且草稿非空时出现，点击校验并提交——草稿 chip 连同值固化为实线 chip（末端 `X` 移除钮），`Enter` 与确认钮等效，校验失败由 `role="alert"` 播报、不固化；放弃钮（`cancel` 槽，取 `X` 图标，`texts.cancelDraftText` 作可访问名）在整段草稿态（`stage !== "field"`）出现，点击一次放弃整条草稿回到 `field`，与 `Esc` 的逐级回退互补
- 只有一个浮层：候选列表为顶层浮层——输入条挂唯一 anchor name（`data-anchor-name`），候选列表在根内以输入条兄弟节点渲染，元素带 `popover="manual"`，锚定输入条底边、start 对齐、宽度跟随输入条，走 floating-position 定位机制，不被祖先溢出截断；候选列表 DOM 常驻，开合由浮层机制驱动，有条目才显示；任何阶段都不弹第二个浮层、不嵌套编辑面板
- 阶段 `stage: "field" | "operator" | "value"`，三段共用同一个输入框与同一个候选列表
- `field`：输入按字段名、标签、别名过滤候选；候选列表的展开只来自三个入口——聚焦输入框、输入文字、按空格（`preventDefault`，空格不进草稿）；不设下拉开合钮
- `operator`：候选只取该列 `operators`，条目仅显示操作符名称（`texts.operatorLabels`），不重复显示操作符键名——默认全文字（`is` `is not` `greater than` `at least` `less than` `at most` `between` `not between` `before` `after` `contains` `does not contain` `is empty` `is not empty`），保证零理解成本、国际化靠 `operatorLabels` 整体替换；选中后切到 `value`，输入框聚焦继续输入
- `value`：按操作符校验；单值校验非空，区间按可替换分隔符切两个值并校验两侧；`Enter` 或点提交钮把规则追加进 `rules` 并回到 `field`。枚举字段（`options` 非空）在值阶段复用同一个候选列表展示选项，输入即过滤；点击或 `Enter` 选中选项直接提交规则。数字与日期字段不做值候选，保持纯文本输入
- 值阶段提示（hint）：小浮签悬浮在 bar 上方右端（`absolute -top-7 right-0`，不随输入流内容移动），进入值阶段即显示（不依赖聚焦状态），由 `resolveValueHint` 返回的数组驱动、水平排列——日期字段在任何带值操作符下必有格式提示（`dateValueHint`，text 型，含引导文字如 `Format YYYY-MM-DD`）；区间操作符必有分隔符键帽提示（keys 型：解释文字 `separatorLabel` + `<kbd>` 键帽，无示例值），键帽按字段区分——数字 `separatorKeys`（`␣` `,` `/`）、日期 `dateSeparatorKeys`（`␣` `,` `/` `-`，日期可用 `-` 分割）；日期区间为格式 + 键帽两条、数字区间仅键帽一条；文本、数字单值、枚举不出现。hint id 拼进输入框 `aria-describedby`，离开值阶段即消失
- 日期输入与存储固定 ISO `YYYY-MM-DD`，值阶段以 hint 提示该格式；不做其他日期格式的解析或格式化
- 候选条目 `onMouseDown` 必须 `preventDefault`，阻止输入框失焦收起列表，保证 `click` 落到 `onSelect`——默认渲染器与皮肤渲染器都遵守
- 无值操作符（`isEmpty` / `isNotEmpty`）跳过值输入直接成规则
- `Esc` 逐级回退 `value → operator → field`，任何阶段都能退到初始；`Backspace` 在空输入时删末尾规则
- 已提交规则以行内实线 chip 显示，各有独立移除钮（close 图标，取 `X`）与可访问名；点 chip 重新编辑该条（回填为草稿 chip 继续输入）
- 已提交 chip 全部直接展示，不做折叠与 `+N` 计数：chip 永远完整可见，宽度不足时输入框与清空钮跟随换行；点击输入区任意空白处聚焦输入框
- 输入条单行 `flex-wrap`：搜索图标固定头部（`shrink-0`，不随内容与容器变化）→ 已提交 chips（实线）→ 草稿 chip（虚线）→ 输入框 → 确认钮 / 放弃钮（跟随内容换行）；清空钮（`clear` 槽，取 `RotateCcw` 图标，`texts.clearText` 作可访问名，点击清空全部规则回到 `field`）**钉在 bar 右端**（absolute 右侧垂直居中，不随内容换行流动），有已提交规则时显示、bar 经 `data-clear` 预留右侧空间防重叠；hint 触发器固定 bar 右上角；结果数不在输入条内显示，`resultCount` 仅供状态区 `role="status"` 的 sr-only 播报

## 行为 / 状态

- props：`fields`、`value` / `defaultValue`（`FilterRule[]`）、`onChange`、`texts`、`separators`、`fetcher` + `onResult` / `onError`（可选，沿用 AbortController 竞态）、`resultCount`（仅供状态区 sr-only 播报）、`renderChip`、`renderOption`、`classNames`、`styles`、`ref`
- 组件内部只持有阶段、草稿文本、active 索引、loading、error；查询正本只有 `rules`
- 候选列表有条目才显示；`aria-controls` 指向的 DOM 常驻，以浮层 `hidden`（popover 关闭态）控制显隐，不卸载
- 提交链路：`toFilterParams` 风格的扁平规则数组 + 新 `AbortController` + `onResult` / `onError`，`AbortError` 不写状态不回调
- 无障碍：输入框 `role="combobox"` + `aria-expanded` / `aria-controls` / `aria-activedescendant` / `aria-autocomplete="list"`；候选 `role="listbox"` / `role="option"`；`role="status"` 常驻播报阶段与结果数，`role="alert"` 播报校验错误；Tab 顺序 = DOM 顺序
- `FilterComboboxRef`：`reset`、`submit`、`getRules`、`focusInput`
- 槽位：`{ root; bar; chip; chipLabel; chipRemove; input; draft; hint; hintKeys; hintKey; list; option; optionLabel; optionDetail; submit; cancel; clear; status; error }`；骨架零样式
- 全部用户可见文案走 `texts` 契约（见 `combobox-query` 蓝图），组件不内置 i18n 运行时与语言包；动态切换语言 = 宿主替换 `texts` 对象
- 不做：溢出折叠与 `+N` 计数、括号分组、AND/OR 切换、保存视图、异步字段搜索、多日期格式解析、SQL/DSL 拼接——组件只收集并结构化值（`FilterRule[]` / `toFilterParams`），如何拼进 SQL、DSL 或 ORM 由消费方二次封装
