# FilterCombobox 皮肤（app/ui/skins/filter-combobox.tsx）

1. `FilterCombobox` 包装 headless `FilterCombobox`，注入 `filterComboboxClasses` 与 `renderChip` / `renderOption` 两条缺省通道；复用 `fieldGroupClasses`、`buttonVariants`、`cn`、`mergeSlots`，不新写输入框框线。
2. 根 `flex w-full flex-col gap-y-1 @container`，无背景色、无卡片外壳。
3. 输入条（`bar`）：字段框（`fieldGroupClasses`）+ `relative flex min-h-field w-full flex-wrap items-center gap-x-1 gap-y-1 px-2 py-1 text-sm`，焦点环走 `focus-within:focus-ring`；行首搜索图标 `shrink-0` 固定头部、`text-surface-fg`；有已提交规则时骨架发 `data-clear`，条经 `data-clear:pr-13` 给右端钉住的清空钮预留空位。
4. 已提交 chip（`chip`）：`inline-flex h-7 max-w-full shrink-0 items-center rounded-md border-hair border-border bg-surface-raised px-1 text-sm`；值段（`chipLabel`）是点按重编辑的 `ButtonRoot`（`text-surface-fg` + `focus-visible:focus-ring`，可访问名带 `texts.editLabel`），移除钮（`chipRemove`）为 `buttonVariants.text` 小档图标钮（`h-7 min-h-0 w-7 min-w-0 px-0`，`X` 图标，可访问名带 `texts.removeLabel`）——chip 内两钮互不嵌套。
5. 草稿 chip（`draft`）：同实线 chip 尺寸，边换 `border-dashed`、文字 `surface-fg`；紧贴输入框之前落入换行流，随阶段收缩（`value → operator → field`）。
6. 行内输入框（`input`）：`min-w-16 flex-[1_1_8rem] border-0 bg-transparent outline-none`，占位 `placeholder:text-surface-fg`——输入框是换行流最后一个伸缩件，光标始终跟在已有内容末尾。
7. 草稿控制钮：提交钮（`submit`，`Check` 图标）与放弃钮（`cancel`，`X` 图标）均为 `buttonVariants.text` 小档图标钮（`h-7 min-h-0 w-7 min-w-0 px-0 shrink-0`，**禁止 primary**），在输入框与提示后方、跟随内容换行；chip 流内小钮（`h-7`＝28px）达 24 硬底线即合规，属 token 流零件、不占 11 基；显隐由骨架裁决（提交钮仅值阶段草稿非空时出现，放弃钮在整段草稿态出现）。
8. 清空钮（`clear`）：钉在输入条右端（`absolute right-1 top-1/2 -translate-y-1/2`）的 `buttonVariants.text` 图标钮（`h-control w-control min-h-0 min-w-0 px-0`——控制令牌车道，随字段框同高，`RotateCcw` 图标），垂直居中、不随换行流动。
9. 值阶段提示（`hint` / `hintKeys` / `hintKey`）：悬浮在输入条上方右端（`absolute -top-7 right-0 z-10`，不随输入流移动）的底色浮签——`bg-surface-raised` + `border-frame` + `text-xs` + label 两项（`tracking-label` / `case-label`）+ `shadow-subtle`，`pointer-events-none`；键帽直接引用 `kbd` 工具类（schemes/kbd.md 同源单一正本，与 Command 快捷键帽同源）。
10. 候选面板（`list`）：顶层浮层（定位与开合全由骨架的 floating-position 机制承担，皮肤只给外观）——`max-h-72 min-w-64 overflow-y-auto` 自带浮层配方（`rounded-xl` + `border-frame` + `bg-surface-raised` + `shadow-elevated`）叠圆角补偿带 `panelPadClass`（律见 `ui/schemes.md` 第 12 条），宽度由锚点匹配；选项行（`option`）`h-control`（44，`px-3`）不带行级圆角——行 hover 由面板补偿带兜住，`data-highlighted` 换 `bg-surface`；标签（`optionLabel`）`flex-1 truncate`、详情（`optionDetail`）`text-xs surface-fg` 缀尾；候选 `onMouseDown` preventDefault 防失焦（缺省渲染器即皮肤渲染器）。
11. 状态与错误：状态行（`status`）`text-sm text-surface-fg`（sr-only 播报由骨架承担，结果数不在输入条内显示）；错误（`error`）`text-danger-fg`。
12. 组合导出 `filterComboboxClasses`。
13. 专属令牌：无。
