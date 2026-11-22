# 组件 demo（app/demos/**）

1. 目录即正本：`app/demos/<name>/`，文档页经 `ComponentPreview name="<name>-<file>"` 挂载，示例墙按目录名匹配追加变体名（消费端归 `site/widgets/` 蓝图）。
2. 禁用态统一展示：实现了禁用态的交互组件一律配 `disabled.tsx`，只放一个禁用态实例，不与可用态对比（可用态归 basic）；条目级禁用的组件（无单控件形态或以列表为语义单元的，如 radio、segment、menu、command、tabs、tree、transfer、calendar、color-swatch、swipe-actions）在实例里整组禁用——组内所有条目全部禁用，禁止只禁其中一部分：有组级 disabled 的组件（radio、segment、color-swatch）传组级 prop，其余逐条目标注 disabled，calendar 用恒真 isDateDisabled；所有禁用 demo 最外层元素一律挂 inert，从最外层掐断指针、键盘与辅助技术通路（组件不透传 props 的以 wrapper div 承载）；禁用观感由皮肤自答（`dim` 经 `disabled:` / `inert:` 等标记变体），纯 inert 掐断而无皮肤观感的（command 触发器一类），外层非 inert 包裹层挂 `dim`——inert 元素被命中测试跳过，压暗与光标都由外层应答。清单（28）：button、calendar、cascader、checkbox、color-swatch、combobox、command、date-picker、date-range-picker、filter-combobox、input、input-otp、menu、multi-select、number-field、number-input、password、radio、segment、select、slider、swipe-actions、switch、tabs、toggle、transfer、upload、tree；未实现禁用态的组件不配。
3. 单控件 + 组条两形态并存的组件（checkbox、toggle）按 radix 式拆分：`basic.tsx` 只留单控件，组条拆入 `group.tsx`，`disabled.tsx` 只禁单控件；组条条目级禁用不单独配 demo（API 表已载 `option.disabled`）。
4. 文档挂载：各组件 zh.mdx 用法节末尾加 `### 禁用` 小节——一行概括 + `<ComponentPreview name="<name>-disabled" />`（doc-format 第 3 条「额外能力自成小节」）；checkbox、toggle 在禁用小节前加组条小节（`### 多选组` / `### 组条`）挂 `group.tsx`；英文攒批同步，slug 移出 `content/docs/sync.json` 白名单。

## 待定项

非表单组件（button、menu、tabs、tree 等）是否也取消禁用 demo、统一由消费方 inert 自禁，待裁决——pagination、command 已按此执行（command 组级 prop 已删，仅余条目级禁用）。
