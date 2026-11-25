# Tabs 皮肤（app/ui/skins/tabs.tsx）

1. 根与列表：根默认 `w-full min-w-0`，不内置最大宽度；皮肤将消费者 `className` 与 `classNames.root` 经 `cn` 合并后交给骨架。横竖两轴，皮肤 wrapper `orientation` prop 解析成两套类串（默认横向——根横 `flex-col` / 纵 `flex-row`；横条下缘 `border-b-frame`、竖条右缘 `border-r-frame`，纵向列表 `flex-col items-stretch`）；列表带 `group` 标记——箭头经 `group-data-[overflow=true]` 显形。
2. 滚动轨：横滚、隐藏滚动条、不带边——条线归列表；「此条可滚」由两端箭头说；所有宽度同一形态，放不下就横向拖动，不改布局。
3. 触发件两变体（皮肤 wrapper `variant` prop 解析成两套类串，根上发 `data-variant`；默认 `line`）：
   - `line`：`min-h-control` 命中 + `px-4 py-2`，下缘 2px 透明底线（选中前无下划线），`text-sm` + `control-label`；未选中 `foreground` 文字色，hover 吃 `accent` 背景档（并写它的配对前景，底色只给未选中页——`primary` 文字压 `accent` 不过 AA，激活页不换底）；激活（`data-[state=active]`）转 `primary` 文字色 + `primary` 底线。
   - `primary`：无底线、`rounded-md` 块；未选中 `foreground`、hover 吃 `accent` 背景档（并写它的配对前景 `accent-fg`）；激活铺 `primary` 对（背景色 + 配对文字色）；列表去下缘 / 右缘分隔线。
   - 禁用观感：两变体触发件按 `disabled` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / active。
4. 箭头：44 方（`min-h-control min-w-control`）+ `rounded-md`；到边禁用选择独立禁用类串，使用禁用色与 `cursor-not-allowed`。
5. 内容体：`rounded-lg` + `p-4` + `text-base` + `leading-body`，落在每个 tabpanel。
6. 专属令牌：无。
