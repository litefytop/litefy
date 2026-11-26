# FilterCombobox 骨架（app/ui/components/filter-combobox.tsx）

- 职责：收合式组合筛选器。收起时只显示 trigger 按钮（无规则显示 `texts.triggerText` 占位文案，有规则显示 `texts.triggerCountText` 条件数，`{count}` 占位）；点开面板才看到明细并编辑规则，解决条件过多撑爆行内布局的问题。开发者传入字段与每列允许的操作符；面板内输入列名出现候选，选中列名后出现该列操作符候选，选定操作符后在行内输入值并提交成一条规则；规则通过 `value` / `onChange` 传出。支持复杂筛选（多规则、区间操作符）。
- 表格筛选是外部行为：`FilterCombobox` 只产出 `FilterRule[]`，消费方自行驱动 `Table` 过滤；共享 `app/ui/utils/filter-query.ts` 的 `FilterRule` / `FilterOperator`，值校验、候选与提示逻辑共享 `app/ui/utils/combobox-query.ts`。
- 导出：`FilterCombobox`、`FilterComboboxStatus`、`FilterComboboxProps`、`FilterComboboxStatusProps`、`FilterComboboxClassNames`、`FilterComboboxStyles`、`FilterComboboxDialogClassNames`、`FilterComboboxDialogStyles`、`FilterComboboxRef`、`FilterComboboxFetcher`、`FilterOptionRender`、`FilterOptionRenderArgs`。

## 交互

- 形态：trigger + Dialog 面板——面板机制整体复用 `Dialog` 骨架（与 Command/cmd 同一套）：trigger（`data-slot="trigger"`，search 图标 + 文案按钮，`aria-haspopup="dialog"` + `aria-expanded`）点击开面板；面板是受控 Dialog（`open` / `onOpenChange`），showModal 居中呈现、原生 Esc cancel 与 backdrop 点击关闭、trap-tab-key 焦点圈；不做浮动定位、不用 popover manual、不做 anchor、不做 match-width
- 面板内自上而下：bar（token 输入流）→ 列表区（条件列表 / 候选列表双态，文档流内嵌）→ 状态区 → **提示行（footer，面板最下方单独一行，与 cmd footer 同款）**；面板高度固定（皮肤 flex 列 + 固定高），提示与列表的出现 / 消失不改变面板高度；面板内不弹第二个浮层、不嵌套编辑面板
- 提示行（`footer` 槽）：左侧固定 ↑↓ 键帽（`aria-hidden`，导航提示），右侧动态提示（`hint` 槽，id 拼进输入框 `aria-describedby`）随阶段变化——条件列表态提示「↵ 编辑 / Del 删除 / Space → 筛选列名」（`texts.enterEditText` / `texts.deleteHintText` / `texts.spaceSearchText`）；`field` / `operator` 阶段提示「↵ 选择 / esc 取消」（`texts.enterSelectText` / `texts.escHintText`）；`value` 阶段沿用 `resolveValueHint`（日期格式 + 分隔符键帽，文本字段无动态提示）；触屏与窄屏整行隐藏（皮肤 `pointer-coarse:hidden max-sm:hidden`）。**溢出保护**：动态提示可能多条（条件态三组、日期区间两组）——footer 允许换行（`flex-wrap min-w-0`）、右侧提示组可收缩换行（`min-w-0 flex-wrap justify-end`）、键帽组 `shrink-0`；面板固定高 + 列表 `flex-1`，footer 增高只压缩列表区，不撑破面板
- 输入区模型：一根连续的 token 输入流——草稿 chip、输入框同处一个 `flex-wrap` 行，输入框是流中最后一个伸缩件（`flex-[1_1_8rem] min-w-16`），光标始终跟在已有内容末尾；输入不因阶段切换而分段、重置或换位置。没有固定前缀文本，没有独立的「已选展示区」
- 列表区一物两用：无输入（`field` 阶段且输入框为空）时显示已写好的条件列表——已提交规则以普通列表行呈现（**无 chip 外观**：无边框、无背景、无 hover 下划线，直接用 `option` / `optionLabel` 槽着装，行尾保留 `chipRemove` 移除钮），逐条竖排在 `list` 槽容器内（`data-slot="rules-list"`，`role="listbox"` / `role="option"`，`aria-selected` 标记键盘高亮行）；一旦有输入（或进入 `operator` / `value` 阶段），候选列表替换条件列表；清空输入回到条件列表。bar 内不展示任何已提交条件，已提交条件只出现在列表区
- **列表容器常驻**：`list` 槽容器始终渲染（空态无内容、无 listbox 语义，仅占位）——面板固定高 + 容器 `flex-1`，footer 因此钉死在面板底部，列表为空时也不会跳到输入框下方；`data-slot` 空态为 `list`、条件态 `rules-list`、候选态 `suggestion-list`
- 草稿 chip：选中列后列名即以虚线草稿 chip（`draft` 槽）落入输入流、紧贴光标之前；选定操作符后扩展为「列名 + 操作符」；值输入中光标跟在 chip 后面的输入框里继续打字。chip 为纯视觉件（`aria-hidden`），语义由输入框占位与 `role="status"` 播报承担；`Esc` 逐级回退即草稿 chip 逐级收缩（`value → operator → field`）
- 草稿控制钮在输入框后方、跟随换行：确认钮（`submit` 槽，取 `Check` 图标，`texts.submitText` 作可访问名）仅在值阶段且草稿非空时出现，点击校验并提交——草稿连同值固化为一条规则、进入条件列表，`Enter` 与确认钮等效，校验失败由 `role="alert"` 播报、不固化；放弃钮（`cancel` 槽，取 `X` 图标，`texts.cancelDraftText` 作可访问名）在整段草稿态（`stage !== "field"`）出现，点击一次放弃整条草稿回到 `field`，与 `Esc` 的逐级回退互补；两枚钮（submit / cancel）与条件行移除钮均复用原子 `Button`——内置图标走 `icon` 槽发射 `data-pure-icon`，并自带 `data-field-trailing` 组内端角判定标记
- 候选列表：面板内 bar 下方文档流渲染（不再是独立浮层），仅在「有输入或处于 `operator` / `value` 阶段」且有条目时渲染；未渲染时输入框不指向它。`aria-controls` 与 `aria-activedescendant` 指向列表内条目
- 阶段 `stage: "field" | "operator" | "value"`，三段共用同一个输入框与同一份候选
- `field`：输入按字段名、标签、别名过滤候选；候选的出现来自输入文字，或空格 / `→` 显式切换——`field` 阶段输入为空时列表区默认显示条件列表，按空格（`preventDefault`，不进草稿）或 `→` 切到字段名候选列表（空输入下 `→` 无光标副作用），`Backspace` 从候选态退回条件列表（不删规则）；不设下拉开合钮
- `operator`：候选只取该列 `operators`，条目仅显示操作符名称（`texts.operatorLabels`），不重复显示操作符键名——默认全文字（`is` `is not` `greater than` `at least` `less than` `at most` `between` `not between` `before` `after` `contains` `does not contain` `is empty` `is not empty`），保证零理解成本、国际化靠 `operatorLabels` 整体替换；选中后切到 `value`，输入框聚焦继续输入
- `value`：按操作符校验；单值校验非空，区间按可替换分隔符切两个值并校验两侧；`Enter` 或点提交钮把规则追加进 `rules` 并回到 `field`。枚举字段（`options` 非空）在值阶段复用同一份候选展示选项，输入即过滤；点击或 `Enter` 选中选项直接提交规则。数字与日期字段不做值候选，保持纯文本输入
- 值阶段提示（hint 内容）：进入 `value` 阶段后由 `resolveValueHint` 返回的数组驱动、在提示行右侧水平排列——日期字段在任何带值操作符下必有格式提示（`dateValueHint`，text 型，含引导文字如 `Format YYYY-MM-DD`）；区间操作符必有分隔符键帽提示（keys 型：解释文字 `separatorLabel` + `<kbd>` 键帽，无示例值），键帽按字段区分——数字 `separatorKeys`（`␣` `,` `/`）、日期 `dateSeparatorKeys`（`␣` `,` `/` `-`，日期可用 `-` 分割）；日期区间为格式 + 键帽两条、数字区间仅键帽一条；文本、数字单值、枚举不出现
- 日期输入与存储固定 ISO `YYYY-MM-DD`，值阶段以 hint 提示该格式；不做其他日期格式的解析或格式化
- 候选条目 `onMouseDown` 必须 `preventDefault`，阻止输入框失焦收起列表，保证 `click` 落到 `onSelect`——默认渲染器与皮肤渲染器都遵守
- 无值操作符（`isEmpty` / `isNotEmpty`）跳过值输入直接成规则
- `Esc` 逐级回退 `value → operator → field`，回退各段拦截 Esc；`field` 阶段不拦截 Esc——直接交给 Dialog 的原生 cancel 关闭面板（条件列表不可折叠）；条件列表态 `Enter` 编辑高亮条件、`Del` 删除高亮条件；`Backspace` 在空输入时删末尾规则（条件列表同步更新）
- 面板关闭即放弃当前草稿回到 `field` 阶段，已提交规则保留；关闭途径：backdrop 点击、Esc（Dialog cancel）、`focusInput` 之外无其他
- 已提交规则以普通列表行显示在面板内的条件列表里（不在 bar 内，**无 chip 外观**）：`option` / `optionLabel` 槽着装的纯文本行 + 行尾移除钮（`chipRemove` 槽，close 图标，取 `X`，独立可访问名）——无边框、无背景、无 hover 下划线；条件行**可像候选一样选择**：`↑` / `↓` 移动高亮（`data-highlighted="true"`）、`Enter` 编辑高亮条件、`Del` 删除高亮条件、鼠标 `mousemove` 跟随高亮、点击行编辑（点行内按钮除外）；编辑即回填为草稿继续输入，候选随之替换条件列表；点击输入区任意空白处聚焦输入框
- 面板高度固定：面板为 flex 列 + 固定高（皮肤 `h-[min(24rem,calc(100vh_-_3rem))]`），列表区（`list` 槽，**常驻**）`flex-1 min-h-0 overflow-y-auto` 占满 bar / status / footer 之外的剩余空间，条件或候选超出即在列表区内滚动——输入过程中面板高度恒定不跳变，列表为空时 footer 仍钉在面板底部
- 输入区 / 列表区容器与 cmd 同款**不带背景色**：bar 与列表区透明融进面板（皮肤不铺 recessed 面），输入条单行 `flex-wrap`（input group 容器）：搜索图标前缀（`prefix` 槽，**size-11 触控目标 11 基**，`flex items-center justify-center`，负边距出血盖住 bar 内距）→ 草稿 chip（虚线）→ 输入框 → 确认钮 / 放弃钮（跟随内容换行）——**group 内容只含确认与放弃两钮**（`data-field-trailing` 仅 submit / cancel 发射）；清空钮（`clear` 槽，取 `RotateCcw` 图标，`texts.clearText` 作可访问名，点击清空全部规则回到 `field`）是 group 容器的**后缀段**：**size-11 触控目标 11 基**、负边距出血盖住 bar 内距与右端圆角（`-my-1 -mr-2 rounded-l-none rounded-r-md`），背景与面板同色（`bg-surface-raised`）；有已提交规则时显示；结果数不在面板内显示，`resultCount` 仅供状态区 `role="status"` 的 sr-only 播报
- trigger 按钮：`aria-expanded` / `aria-haspopup="dialog"`（与 Command 的 trigger 同款，不做 aria-controls）；面板打开时聚焦输入框，`focusInput` ref 方法在面板未开时先开面板再聚焦

## 行为 / 状态

- props：`fields`、`value` / `defaultValue`（`FilterRule[]`）、`onChange`、`texts`、`separators`、`fetcher` + `onResult` / `onError`（可选，沿用 AbortController 竞态）、`resultCount`（仅供状态区 sr-only 播报）、`renderOption`、`dialogClassNames` / `dialogStyles`（直通 Dialog，`content` 与 `panel` 槽拼接）、`classNames`、`styles`、`ref`
- 组件内部只持有面板开合、阶段、草稿文本、active 索引、loading、error；查询正本只有 `rules`
- 面板关闭即放弃草稿；`disabled` 不改变面板开合，只是原生禁用 trigger 与全部控件并由 JS 阻断编辑链路（候选不渲染、focusInput 与开面板无效），面板开着时被禁用即冻结在禁用外观
- 候选列表有条目才渲染；面板由 Dialog 的 showModal / close 控制开合，Dialog 内容保持挂载
- 提交链路：`toFilterParams` 风格的扁平规则数组 + 新 `AbortController` + `onResult` / `onError`，`AbortError` 不写状态不回调
- 无障碍：trigger 为普通按钮；输入框 `role="combobox"` + `aria-expanded` / `aria-controls` / `aria-activedescendant` / `aria-autocomplete="list"`；候选与条件列表均 `role="listbox"` / `role="option"`，行高亮 `data-highlighted="true"`、条件行以 `aria-selected` 标记；提示行左侧键帽组 `aria-hidden`，动态提示 id 拼输入框 `aria-describedby`；`role="status"` 常驻播报阶段与结果数，`role="alert"` 播报校验错误；Tab 顺序 = DOM 顺序
- `FilterComboboxRef`：`reset`、`submit`、`getRules`、`focusInput`（面板未开时先开）
- `disabled` 组级禁用：根输出 `data-disabled` / `aria-disabled`，trigger、输入、submit、cancel、clear 原生禁用；候选不渲染，commit、submit、reset、聚焦输入、开面板、field/operator 选择、规则编辑、删除与键盘处理均由 JS 阻断；条件行移除钮同步禁用
- 禁用遵循 `ui/schemes.md` 第 8 条：根不挂 inert；皮肤用 `mergeSlots` 完整替换 trigger/bar/draft/input/status/error 禁用类串，保留布局与结构、移除 hover/focus/active 类并显式禁用色与 `cursor-not-allowed`
- 槽位：`{ root; trigger; triggerLabel; panel; bar; prefix; chipRemove; input; draft; hint; hintKeys; hintKey; footer; list; option; optionLabel; optionDetail; submit; cancel; clear; status; error }`；骨架零样式（`chipRemove` 专指条件行行尾移除钮，无独立 chip 槽）
- 全部用户可见文案走 `texts` 契约（见 `combobox-query` 蓝图），组件不内置 i18n 运行时与语言包；动态切换语言 = 宿主替换 `texts` 对象；trigger 文案含 `triggerText`（默认 `Filter`）与 `triggerCountText`（默认 `{count} filters`）；提示行文案含 `enterSelectText`（默认 `Select`）/ `escHintText`（默认 `Cancel`）/ `enterEditText`（默认 `Edit`）/ `deleteHintText`（默认 `Delete`）/ `spaceSearchText`（默认 `Search fields`）
- 不做：括号分组、AND/OR 切换、保存视图、异步字段搜索、多日期格式解析、SQL/DSL 拼接——组件只收集并结构化值（`FilterRule[]` / `toFilterParams`），如何拼进 SQL、DSL 或 ORM 由消费方二次封装
