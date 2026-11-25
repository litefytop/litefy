# 中性明度阶梯（凹—平—凸）

约束正本：`app/ui/schemes/*/index.css` 的中性档、`app/ui/skins/*.tsx` 的中性角色归属、`site/shell/contrast.md` 第 9 条的底档分派。`ui/schemes.md` 第 21 条是本文件的入口。

## 方向律

1. 明度即层级：越需要被读到的东西越凸、越亮，亮暗两档同向，夜间不反相。
2. 夜间不反相的三条依据：反相后暗档浮层比画布更黑，只能靠 1px 描边认边界，与「分离由明度承担、边框阴影退居第二道」冲突；反相要求每条状态类串分日夜写两遍，与 schemes.md 第 24 条「同一条串两档都成立」的成对律意图冲突；暗档投影是黑上加黑，可辨性最差，暗档靠 inset 白亮环补深度（schemes.md 第 15 条）。
3. 夜间的「背景退后」由遮罩承担（Dialog / Drawer / Popover 的宿主压暗），不靠把表面阶梯翻向。
4. 阶梯只管中性档。品牌 `primary` 与语义四族是对比强调，不占阶梯位：亮档 `primary` 近黑、暗档近白，靠自身对比发声。
5. 分级判据（用户定 2026-11-25）：静态档沿 Tailwind 具名色板逐级排布，相邻两档只挪一阶，不跨阶、不自造中间值；彩色方案取本家族同名阶（sky 的 白 / 50 / 100 / 200 / 300），Tailwind 950 以下无具名阶时按同族色相自定义、步长对齐该家族相邻两阶的实测差。层级靠「每档只挪一阶」的秩序感挣，不靠大步长；一阶之差不与边框阴影对冲——明度仍是第一读法，`border-frame` / `border-hair` / `shadow-recess` 是共担的第二道线。
6. 凹陷不设独立色档（用户定 2026-11-25，撤销同日「井底层另挂 `bg-well`」的写法）：静态层只有三档——凹 `surface`、平 `background`、凸 `surface-raised`。凡凹陷（输入井面、值区、多行域、Segment 井道、轨道族）一律读 `bg-surface`，凡突起一律读 `bg-surface-raised`；第四档 `disabled` 不入阶梯，见「禁用档」。

## 静态三档（凹—平—凸）

1. `surface` — 凹槽层：壳层 bar（顶栏 / 侧栏 / 底栏）、rail、目录栏、表头、斑马纹行、轻量分区带；输入井面、值区、多行域、Segment 井道；轨道族——Slider 槽、Progress / Meter / MeterGroup 未填充底、Steps 未走完的连线、SwipeActions 行体、FloatingToc 游标底、Toast 倒计时条、Chart 轨道线。永远比它自己的宿主低一档（彩案的 `surface` 是身份色档，方向由色相承担，见逐案取值第 5 / 6 条）。凹陷的下沉读法由 `--shadow-recess` 内阴影补第二道，不替明度差代劳。
2. `background` — 画布层：主内容区、页面底、正文列、示例舞台。比凹槽亮一档，读作从壳层镂出的洞；亮档让出最亮中性位给凸起层，是否带色由各案自答——中性案答家族 50 档（minimal neutral-50 98.5、flat-minimal sky-50 97.7），带色方案跟随本方案表面色族的 50 档，暗档答凹槽与凸起之间的具名档（neutral-900 20.5）。
3. `surface-raised` — 凸起层（亮档锚纯白、暗档锚家族 800 档，是阶梯顶端）：控件静置面（按钮 / 字段壳 / 选择触发件 / 指示框 / 开关拇指 / 滑块拇指 / 切换组 / 步进钮）、卡片、浮层（Dialog / Drawer / Popover / Menu / Tooltip / Toast / 命令面板 / 浮层内嵌列表视口）、Chip、示例框。
4. `--paper-surface` — 纸白：只归 Paper 与打印车道（schemes.md 第 13 条），不进 UI 阶梯。
5. 文字配对沿用 schemes.md 第 19 条：凹槽层读 `surface-fg`，画布读 `foreground`，凸起层读 `surface-raised-fg`；皮肤换档必同步换配对前景档——井面与多行域的正文和占位符原读 `foreground`，改挂 `surface` 后一并改读 `surface-fg`（成对律，schemes.md 第 24 条）。
6. 具名阶映射（neutral 家族，minimal 实测值；彩案按本家族同名阶）：亮档自上而下一阶一阶——凸起 = 纯白 100、画布 = 50 档 98.5、凹槽 = 100 档 97.0、悬停 / 选中 = 300 档 87；暗档——悬停 / 选中 = 700 档 37.1、凸起 = 800 档 26.9、画布 = 900 档 20.5、凹槽 = 950 档 14.5。同一条阶梯，凸起在顶、悬停在底，静态三档只占中间连续三阶；原「井底 = 200 档」的空位不回收，禁用档另占一阶（见下）。

## 禁用档（固定中性灰）

1. `disabled` 不随 `surface` 走（用户定 2026-11-25：禁用色与表面色是完全不同的两件事，禁用始终保持中性灰）：minimal / flat-minimal / neo-brutalist 亮档统一 `oklch(70.8% 0 none)`（neutral-400）、暗档统一 `oklch(43.9% 0 none)`（neutral-600）；neon-gradient 两档同答（schemes.md 第 16 条）。取阶判据——去彩（C ≤ 0.02）、与本案悬停档错开一阶、对三档静态背景 ≥8 个 L 点（中性案）/ ΔE ≥0.08（彩案）。不取 300 档：那是中性案悬停档的位子，禁用与 hover 同值会让禁用件看着像选中件。
2. 实测（本仓库脚本，OKLab L 点与对比度）：`disabled` 对 凹 / 平 / 凸 三档——minimal 亮 26.2 / 27.7 / 29.2、暗 29.4 / 23.4 / 17；flat-minimal 亮 24.3 / 26.9 / 29.2、暗 27.4 / 22.4 / 14.5；neo-brutalist 亮 ΔE 0.272 / 0.252 / 0.292、暗 ΔE 0.233 / 0.439 / 0.234；neon-gradient 亮 0.204 / 0.267 / 0.282、暗 ΔE 0.299 / 0.202 / 0.167。对本案 `accent`：minimal 亮 16.2 / 暗 6.8、flat-minimal 亮 12.0 / 暗 6.0——彩案由 ΔE 计（neo 亮 0.268、neon 亮 0.176 / 暗 0.336），全部错开一阶以上。
3. `disabled-fg` 必须在新禁用底上过 AA 4.5:1（成对律实测）：minimal 亮 26.9 → 5.83、暗 92.2 → 6.19（现值不动）；flat-minimal 亮 sky-800 29.4 → 5.34、暗 sky-200 90.1 → 5.87（现值不动）；neo-brutalist 亮现值 `#525252` 只剩 3.01 破 AA → 改 `oklch(26.9% 0 none)` 5.83，暗现值 70.8 只剩 3.01 → 改 `oklch(92.2% 0 none)` 6.19；neon-gradient 旧亮档 `#e9d5ff` 底与 `surface` 同色、旧暗底配 `#d8b4fe` 只剩 4.41 → 现值 亮 `#0f0a1e` 7.48 / 暗 `#e9d5ff` 5.73（暗档本案 purple-200）。
4. 禁用底不挂渐变：四案 `@utility bg-disabled` 已答 `background-color: var(--color-disabled)` + `background-image: none`，保持——固定灰是「失去色彩」的读法，不随表面色族流动。
5. 门禁（`scripts/check-color-pairs.mjs` 增两律，随本轮落地）：① 禁用档中性律——`--disabled` 彩度 C ≤ 0.02（「禁用始终保持中性灰」的可核形式）；② 禁用档车道可辨——`disabled` 对 `background` / `surface` / `surface-raised` 三档按 `KIND` 走既有阈值（中性案 ≥8 个 L 点、彩案 ΔE ≥0.08）。`disabled` 对 `accent` 不设阈值，错开一阶由本蓝图第 1 条判据与各案 design.md 实测记录约束。

## 交互档方向

1. `accent` 是悬停 / 选中 / 占位档，取值方向为「对宿主对比最大」：亮档沉到静态档之下（接触即沉，取 neutral 300 档 / sky-300），暗档浮到 `surface-raised` 之上（取 neutral 700 档 / sky 同族 37.9）；两档都由 schemes.md 第 24 条车道可辨律兜底（中性案 ≥8 个 L 点，彩色案 ΔE ≥0.08）。一阶律下实测最小道距为亮档 10.0 点 / 暗档 8.6 点（flat-minimal 暗档对凸起）、彩案 ΔE 0.093，全部达标。
2. 凸起层控件的悬停首选位移与阴影升档（`lift` / `shadow-block-hover`），`accent` 换色是第二道反馈；轨道与斑马行只有换色一道。
3. 按压 `--elevation-pressed` / `crush` 永远向内凹，与档位高低无关。

## 归属判据

1. 逐处三分：这块是凹槽、平面还是凸起——承载输入的空腔、值区与轨道是凹槽（`bg-surface`），页面底是平面，可点内容与浮起面板是凸起；按判据选档，不按视觉习惯。
2. Chip 判为凸起层：它是内容令牌又是可点 / 可移除件，宿主跨画布与壳层两种档，只有凸起档在两种宿主上都成立；同族的 FilterCombobox 选值件已在凸起档，两处归一。
3. Badge、Avatar 留凹槽层：标记与占位底板不是动作件，贴在凸起件角上时靠凹槽色与宿主拉开。
4. Table 是凸起层的容器装凹槽层的表头与斑马行——面板浮起、行槽沉下，两者同屏成立。
5. Collapse / Details 的根是凸起层（承载阅读内容）；SwipeActions 的行体是轨道面，读凹槽档。
6. Segment 的 `variant="well"` 变体名保留——它指「井道形状」这一容器形态，不是被撤销的 `--color-well` 色档；井道底色改挂 `bg-surface`。

## 逐案取值

1. minimal 亮档（neutral 家族一阶一阶，配对与步长为本仓库脚本实测）：凹 `surface` 100 档 97.0 → 平 `background` 50 档 98.5 → 凸 `surface-raised` 纯白 100，步长 1.5 / 1.5；`--well`（200 档 92.2）随井档删除。本案身份是「同色井承凹」——凹与画布只隔 1.5 个 L 点，下沉读法由 `--shadow-recess` 双向内阴影（`inset 2px 2px 4px` 黑 10% + `inset -2px -2px 4px` 白 65%）与发丝边共担。`accent` 87 不动；`disabled` 70.8 + `disabled-fg` 26.9 / 5.83。配对 foreground 14.5 / 18.96、surface-fg 26.9 / 13.86、surface-raised-fg 14.5 / 19.79、accent-fg 37.1 / 7.01，全过 AA。`[data-surface]` 八条删掉 `--well` 行。
2. minimal 暗档（阶梯与配对为本仓库脚本实测）：凹 950 档 14.5 → 平 900 档 20.5 → 凸 800 档 26.9 → 悬停 700 档 37.1，步长 6.0 / 6.4 / 10.2；`--well` 删除（原与 `surface` 同值，即暗档关井）。`disabled` 43.9 + `disabled-fg` 92.2 / 6.19。配对 foreground 97.0 / 16.42、surface-fg 92.2 / 15.72、surface-raised-fg 97.0 / 13.86、accent-fg 87.0 / 7.01，全过 AA 与车道律。
3. minimal 暗档的 `[data-surface]` 八条按同族色相沉到画布之下（950 档一带），逐档实测 `surface-fg` ≥4.5:1 后才回梯；亮档八条现值 92.8–93 对新画布 98.5 已有 5.5–5.7 个 L 点，维持画布之下现状只补实测记录。
4. flat-minimal 亮档（sky 家族同名阶，配对与步长为本仓库脚本实测）：凹 sky-100 95.1 → 平 sky-50 97.7 → 凸 纯白 100，步长 2.6 / 2.3；`--well`（sky-200 90.1）随井档删除。发丝边与零投影仍是本案身份，本案 `--shadow-recess` 答 `none`——凹与画布只隔 2.6 个 L 点，第二道线是否补 1px 发丝内描边见待定项 2。`accent` sky-300 82.8 不动：对三档静态背景 −12.3 / −14.9 / −17.2、ΔE 0.143 / 0.17 / 0.194。`disabled` 70.8 + `disabled-fg` 29.4 / 5.34。配对 foreground 17.5 / 17.75、surface-fg 29.4 / 12.04、surface-raised-fg 17.5 / 18.94、accent-fg 29.4 / 8.33，全过 AA。
5. flat-minimal 暗档：凹 16.5（同族色相 243，Tailwind 950 以下无具名阶，步长对齐 sky 家族相邻阶实测值）→ 平 21.5 → 凸 sky-950 29.4 → 悬停 37.9，步长 5.0 / 7.8 / 8.5；`--well` 删除（原与 `surface` 同值）。`disabled` 43.9 + `disabled-fg` 90.1 / 5.87。配对 foreground sky-50 / 16.38、surface-fg sky-100 / 16.73、surface-raised-fg sky-50 / 13.03、accent-fg sky-50 / 9.32，全过 AA 与车道律。
6. neo-brutalist 只核中性不变量，一阶律的约束对象是 minimal / flat-minimal 两套冷白中性案，本案明度阶参与身份表达、按 schemes.md 第 21 条下沿例外保留现值：`surface-raised` 比 `background` 亮一档（日纯白 100 vs 暖纸 96、夜 20.5 vs 纯黑，成立）且由 2px 纯黑描边兜底；`surface` 是身份色（日酸橙绿 lime-300 / 夜粉 pink-700），不参与中性阶梯排序，取值归 schemes.md 第 20 / 23 条——井面与轨道直接吃这档身份色，对画布靠色相自辨（亮 ΔE 0.113、暗 ΔE 0.517，实测可见）。原 `--color-well: var(--surface)` 随井档删除，皮肤串改挂 `bg-surface`。禁用档按本案去彩中性改表：亮 `oklch(70.8% 0 none)` + `oklch(26.9% 0 none)`、暗 `oklch(43.9% 0 none)` + `oklch(92.2% 0 none)`（现值亮 #e5e5e5 / #525252、暗 26.9 / 70.8 与新底配对破 AA，见禁用档第 3 条）。
7. neon-gradient 背景三档分日夜、品牌与语义单档（schemes.md 第 16 条），不参与本轮阶梯取值修订：井档删除，凹陷层直接读本案 `surface` 档——`bg-surface` 是同构渐变件，夜档轨道与井面铺饱和紫粉渐变 `#a855f7 → #ec4899 → #f43f5e`、日档铺浅紫渐变 `#e9d5ff → #fbcfe8 → #fecdd3`。井面正文与占位符读 `surface-fg`（成对律）：夜档深墨 `#0f0a1e` 对渐变各停靠点 4.7–10.4、日档深紫 `oklch(38% 0.1 325)` 对 `surface` 实测 7.74（design.md 第 10 条实测）。原「暗档自答深紫 `#3b2457`」随井档一并撤销——该值当时是为救白字 4.17:1 而设的第四档，改挂 surface 配对后不再需要。禁用档固定灰：日 `oklch(70.8% 0 none)` + `#0f0a1e` 7.48、夜 `oklch(43.9% 0 none)` + `#e9d5ff` 5.73（旧亮档 `#e9d5ff` 与 surface 同色、旧暗 `#3b2457` 与新 `disabled-fg` 只剩 4.41 破 AA，两枚旧值一并作废）。
8. 凹面对外方向的偏差登记（neon-gradient）：本案夜档 `surface` 比 `background` 更亮（60 vs 25 一带）、日档 `surface` 比 `background` 更沉（88 vs 97.5 一带），方向律第 1 条「越凸越亮」在本案由彩度与身份承担、不由凹陷档承担——彩案的身份色本就排在明度序之外（schemes.md 第 20 / 23 条），neo-brutalist 暗档同理（粉 52.5 vs 纯黑 0）。此偏差不算违例，但 design.md 必须写明「本案凹陷读身份色档，靠色相与渐变而非明度分层」。

## 施工面（本轮改动清单）

1. 四案 `index.css`：删 `--well` 声明（minimal 亮 1 + 暗 1 + `[data-surface]` 八条 16 行、flat-minimal 2 行、neon-gradient 2 行）、删 `@theme` 里的 `--color-well`、删 `--padding-well`、`--radius-field-inner` 公式去掉 `var(--padding-well)` 项、`--radius-well-inner` → `--radius-recess-inner`、`--shadow-well` → `--shadow-recess`（含 `@utility shadow-well` → `shadow-recess`）；`--disabled` / `--disabled-fg` 按禁用档第 1 / 3 条改表。
2. `app/ui/utils/cn.ts`：theme 表里 `shadow` 组 `"well"` → `"recess"`、`spacing` 组删 `"well"`。
3. 皮肤串：17 处 `bg-well` → `bg-surface`（slider 4、progress 1、meter 1、metergroup 1、steps 2、swipe-actions 2、floating-toc 1、input 2、number 2、segment 1）；承载文字的凹面同步换配对墨色——input.tsx:35 / :63、number.tsx:15 / :94、segment.tsx:55 的正文与占位符 `foreground` → `surface-fg`；`shadow-well` 3 处 → `shadow-recess`；`p-well` 3 处删除（`--padding-well` 四案同为 0，删后无位移）；`--radius-well-inner` 1 处改名。
4. 文档环：`ui/schemes.md` 第 6 条（井底机制值那句整句删除）、第 9 条（井三件套改凹陷第二道线 + 轨道族措辞「挂 `bg-well`」→「挂 `bg-surface`」）、第 21 条（三档表述）；`site/shell/contrast.md` 第 9 条「凹下去的轨道、进度底、输入井挂 `bg-well`，不得改用 `bg-surface` 充当」→ 改「挂 `bg-surface`」；四案 `design.md`（YAML `well:` 块删除、相关规则文与禁用档实测重写）；12 个 skins 蓝图（slider / progress / meter / metergroup / steps / swipe-actions / floating-toc / input / number / segment-group 等提到井底的表述）；`delivery/references/skin-rules.md` 两处；组件文档 zh 7 篇移出 `content/docs/sync.json` 攒批、en 按既有节奏补；`app/lib/style-templates.ts` 的「same-tone sunken wells」措辞复核（新模型下反而更贴，预计不改）。
5. 门禁：`scripts/check-color-pairs.mjs` 增禁用档两律（中性律 C ≤ 0.02 + 车道律按 `KIND` 复用阈值），并在 `LANE_BASES` 注释里说明禁用档不入悬停车道核算。

## 验收

1. 令牌层：不新增颜色令牌——24 枚色板 + `surface-raised` / `surface-raised-fg` 成对机制槽不变；`--color-well` / `--well` / `--padding-well` 全仓归零，`--shadow-well` / `--radius-well-inner` 改名后旧名归零；轨道族与输入井同挂 `bg-surface`。
2. 阶梯：静态三档沿 Tailwind 具名阶一阶一阶排布（不跨阶、不自造中间值），亮暗两档各自的三档互不相等、递增方向一致（neon-gradient 按第 1 条方向律单列）；禁用档彩度 0——四案同答亮 70.8 / 暗 43.9；实测 L 值与步长写进各案 design.md 的 Colors，并标证据强度。
3. 门禁：`pnpm types:check` 零警告（含 check-color-pairs / check-ui-css / check-blueprint-sync / check-doc-format）+ `npx oxlint` 零警告 + `class-length` 零 WARN 零 NESTED；`check-color-pairs` 新增两律当场过，不登记例外。
4. 观感：dev 站四案 × 亮暗两档 × 首页 / 文档页 / 示例墙逐页核对——凹、平、凸三层按阶递进；亮档凹与平只差 1.5–2.6 个 L 点，发丝边与 `shadow-recess` 承担第二道线，二者合看须让人不读描边也知道谁压着谁；禁用件在四案两档都读得出「灰、死、不可点」，且明显不是选中件；夜间浮层压上画布时不需读描边就知道它浮着。观感若判「分不出」，整条阶梯仍按具名阶整体下移（凸起锚纯白 / 800 档不动，凹槽退 200 档、悬停档随之再下移一阶，禁用档跟着错开一阶），照样一阶一阶挪，不造中间步长。

## 已定

1. 凹陷层不设独立色档（用户定 2026-11-25，覆盖同日上午的「轨道族挂 `bg-well`」）：`--color-well` / `--well` / `--padding-well` 删除，`--shadow-well` → `--shadow-recess`、`--radius-well-inner` → `--radius-recess-inner`；凡凹陷读 `bg-surface`、凡凸起读 `bg-surface-raised`。同日「neo / neon 井底改读 `surface`」与「neon 暗档自答深紫」两条随之撤销——它们本是为救第四档的可见性与 AA，第四档删除后由 surface 配对（`surface-fg` 墨）直接成立。
2. 禁用档固定中性灰、不随表面档走（用户定 2026-11-25）：亮 `oklch(70.8% 0 none)`、暗 `oklch(43.9% 0 none)`（四案同值），与悬停档错开一阶；`disabled-fg` 各案按 AA 实测改表（禁用档第 3 条）。
3. 令牌名不改（用户定 2026-11-25）：`surface` / `background` / `surface-raised` 保持现名，凹 / 平 / 凸只作本文件与各案 design.md 的车道名表述，不进类名与变量名。
4. 一档一阶（用户定 2026-11-25，覆盖同日早先的「静态三档两两 ≥4 个 L 点」判据）：静态档取值直接用 Tailwind 具名色板阶梯，相邻档只差一阶，画布与纯白只差一阶，差异不做大；schemes.md 第 21 条的「抬亮区间 ≥0.04」不再约束静态中性三档，只约束强调层（`accent` 车道、`primary` 与语义块）。
5. 静态三档本轮不重排（用户定 2026-11-25）：凸起锚纯白（暗档 800 档）、画布锚 50 档（暗档 900 档）、凹槽锚 100 档（暗档 950 档）与悬停档 300 / 700 全部保持，只动井档删除与禁用档改表。
6. 语义四族背景日夜同值（用户定 2026-11-25）：`.dark` 不声明语义四族，静置 `<status>`、悬停 `<status>-accent`、块上墨 `<status>-fg` 两档共用一套值（schemes.md 第 3 条）——语义块是强调层、不在中性三档阶梯上，本轮的凹 / 平 / 凸实测与改派不受影响。
7. neon-gradient 背景三档分日夜、品牌与语义单档（用户定 2026-11-25，schemes.md 第 16 条）：凹陷读 `surface` 渐变（夜 `#a855f7 → #ec4899 → #f43f5e`、日 `#e9d5ff → #fbcfe8 → #fecdd3`）、凸起读 `surface-raised`（夜 `oklch(29% 0.075 262)`、日 `oklch(99% 0.008 325)`）、禁用读固定灰（夜 `oklch(43.9% 0 none)`、日 `oklch(70.8% 0 none)`）；品牌与语义两档同值，各剩一列值。

## 待定项

1. 亮档 `[data-surface]` 八条与 14 条 `[data-brand]` 的联动：表面色板按各自家族取 100 / 50 / 白 / 300 四阶（200 档随井档空出），需逐族实测（暖族 stone、冷族 sky 的相邻阶步长不同），随 minimal 整体迁移那一批一起做。
2. flat-minimal 亮档凹陷层与画布只差 2.6 个 L 点且本案 `--shadow-recess` 答 `none`、零投影：轨道与输入井是否补 1px 发丝内描边作第二道线（`inset 0 0 0 1px`，不违反「零投影」的读法），观感复核后定。
3. 一阶律下亮档画布与凸起只差 1.5 个 L 点，是否给凸起层统一补 1px `border-control` 作第二道线（minimal 现有 `shadow-frame`、flat-minimal 有发丝边、neo 有 2px 纯黑），随皮肤重排逐案定。
4. Checkbox / Radio 指示框与 Switch 拇指走 `shadow-unchecked` 双环（环间隙读 `background`）：环间隙色是否改读所在容器档，随这两件重构时逐案定。
5. Chart 轨道线（现 `stroke="var(--surface)"`，chart.tsx:486）与 Radar 轴（radar.tsx:13）是 SVG `stroke` 而非背景填充：本轮凹陷层统一读 `--surface` 后两处已同档，是否再补一枚轨道描边机制值供 SVG 语义化引用，随图表迁移那批定。
