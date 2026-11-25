# 中性明度阶梯（凹陷—凸起）

约束正本：`app/ui/schemes/*/index.css` 的中性档、`app/ui/skins/*.tsx` 的中性角色归属、`site/shell/contrast.md` 第 9 条的底档分派。`ui/schemes.md` 第 21 条是本文件的入口。

## 方向律

1. 明度即层级：越需要被读到的东西越凸、越亮，亮暗两档同向，夜间不反相。
2. 夜间不反相的三条依据：反相后暗档浮层比画布更黑，只能靠 1px 描边认边界，与「分离由明度承担、边框阴影退居第二道」冲突；反相要求每条状态类串分日夜写两遍，与 schemes.md 第 24 条「同一条串两档都成立」的成对律意图冲突；暗档投影是黑上加黑，可辨性最差，暗档靠 inset 白亮环补深度（schemes.md 第 15 条）。
3. 夜间的「背景退后」由遮罩承担（Dialog / Drawer / Popover 的宿主压暗），不靠把表面阶梯翻向。
4. 阶梯只管中性档。品牌 `primary` 与语义四族是对比强调，不占阶梯位：亮档 `primary` 近黑、暗档近白，靠自身对比发声。
5. 分级判据（用户定 2026-11-25，取代同日的「两两间距 ≥4 个 L 点」步长判据）：静态档沿 Tailwind 具名色板逐级排布，相邻两档只挪一阶，不跨阶、不自造中间值；彩色方案取本家族同名阶（sky 的 白 / 50 / 100 / 200 / 300），Tailwind 950 以下无具名阶时按同族色相自定义、步长对齐该家族相邻两阶的实测差。层级靠「每档只挪一阶」的秩序感挣，不靠大步长；只求静态三档互不相等、一眼能分（用户定），画布与纯白之间就隔一阶。一阶之差不与边框阴影对冲——明度仍是第一读法，`border-frame` / `shadow-*` 是共担的第二道线。

## 静态阶梯（由低到高）

1. `--color-well` — 井底层（最深一档）：输入井面、值区、多行域、Segment 井道，与轨道族——Slider 槽、Progress / Meter / MeterGroup 未填充底、Toast 倒计时条、SegmentedProgress 底、Chart 轨道线。永远比它自己的宿主低一档：字段壳在凸起层、轨道在画布或壳层之上。`--shadow-well` 内阴影是第二道，不替明度差代劳。
2. `surface` — 凹槽层：壳层 bar（顶栏 / 侧栏 / 底栏）、rail、目录栏、表头、斑马纹行、轻量分区带。职责是隐退与承重，不承载阅读内容。
3. `background` — 画布层：主内容区、页面底、正文列、示例舞台。比凹槽亮一档，读作从壳层镂出的洞；亮档让出最亮中性位给凸起层，是否带色由各案自答——中性案答家族 50 档（minimal neutral-50 98.5、flat-minimal sky-50 97.7），带色方案跟随本方案表面色族的 50 档，暗档答凹槽与凸起之间的具名档（neutral-900 20.5）。
4. `surface-raised` — 凸起层（亮档锚纯白、暗档锚家族 800 档，是阶梯顶端）：控件静置面（按钮 / 字段壳 / 选择触发件 / 指示框 / 开关拇指 / 滑块拇指 / 切换组 / 步进钮）、卡片、浮层（Dialog / Drawer / Popover / Menu / Tooltip / Toast / 命令面板 / 浮层内嵌列表视口）、Chip、示例框。
5. `--paper-surface` — 纸白：只归 Paper 与打印车道（schemes.md 第 13 条），不进 UI 阶梯。
6. 文字配对沿用 schemes.md 第 19 条：凹槽层读 `surface-fg`，画布读 `foreground`，凸起层读 `surface-raised-fg`；井底与轨道是图形位，按方向律第 5 条分级判据与其上文字无关。皮肤换档必同步换配对前景档。
7. 具名阶映射（neutral 家族，minimal 实测值；彩案按本家族同名阶）：亮档自上而下一阶一阶——凸起 = 纯白 100、画布 = 50 档 98.5、凹槽 = 100 档 97.0、井底 = 200 档 92.2、悬停 / 选中 = 300 档 87；暗档——悬停 / 选中 = 700 档 37.1、凸起 = 800 档 26.9、画布 = 900 档 20.5、凹槽与井底 = 950 档 14.5。同一条阶梯，凸起在顶、悬停在底，静态三档只占中间连续三阶。

## 交互档方向

1. `accent` 是悬停 / 选中 / 占位档，取值方向为「对宿主对比最大」：亮档沉到静态档之下（接触即沉，取井底再下一阶——neutral 300 档 / sky-300），暗档浮到 `surface-raised` 之上（取凸起再上一阶——neutral 700 档 / sky 同族 37.9）；两档都由 schemes.md 第 24 条车道可辨律兜底（中性案 ≥8 个 L 点，彩色案 ΔE ≥0.08）。一阶律下实测最小道距为亮档 10.0 点 / 暗档 8.6 点（flat-minimal 暗档对凸起）、彩案 ΔE 0.093，全部达标——`scripts/check-color-pairs.mjs` 里 minimal 与 flat-minimal 的 `accent×surface` 相邻档豁免登记本轮撤销。
2. 凸起层控件的悬停首选位移与阴影升档（`lift` / `shadow-block-hover`），`accent` 换色是第二道反馈；轨道与斑马行只有换色一道。
3. 按压 `--elevation-pressed` / `crush` 永远向内凹，与档位高低无关。

## 归属判据

1. 逐处三分：这块是凹槽、平面还是凸起——承载输入的空腔与轨道是凹槽（`bg-well`），页面底是平面，可点内容与浮起面板是凸起；按判据选档，不按视觉习惯。
2. Chip 判为凸起层：它是内容令牌又是可点 / 可移除件，宿主跨画布与壳层两种档，只有凸起档在两种宿主上都成立；同族的 FilterCombobox 选值件已在凸起档，两处归一。
3. Badge、Avatar 留凹槽层：标记与占位底板不是动作件，贴在凸起件角上时靠凹槽色与宿主拉开。
4. Table 是凸起层的容器装凹槽层的表头与斑马行——面板浮起、行槽沉下，两者同屏成立。
5. Collapse / Details 的根是凸起层（承载阅读内容）；SwipeActions 的行体是轨道面，读井底层。

## 逐案取值

1. minimal 亮档（neutral 家族一阶一阶，配对与步长为本仓库脚本实测，示例值待观感复核）：`surface` 100 档 97.0 → `background` 50 档 98.5 → `surface-raised` 纯白 100，步长 1.5 / 1.5——画布与纯白只隔一阶（用户定），层级由秩序而非对比承担，`border-frame` 与发丝边作第二道共担。`--color-well` 答 200 档 92.2（现 `surface` 值下移一阶改挂井底），对凹槽 4.8 点、对凸起壳面 7.8 点；「同色井承凹」的本案身份改由「井与轨道同占 200 档」承担，井的下沉仍由 `--shadow-well` 双向内阴影补（schemes.md 第 9 条）。`accent` 87（300 档）不动：`surface` 抬到 97.0 后对凹槽拉开 10.0 个 L 点，schemes.md 第 24 条车道律自然达标，原「亮档悬停取相邻档」豁免登记随本轮撤销。配对 foreground 14.5 / 18.96、surface-fg 26.9 / 13.86、surface-raised-fg 14.5 / 19.79、accent-fg 37.1 / 7.01、`disabled` 取 100 档同 `surface` + `disabled-fg` 26.9 / 13.86，全过 AA。亮档 `[data-surface]` 八条按同名阶重排（凹槽 100 / 画布 50 / 凸起白 / 井 200 / 悬停 300），逐档实测后回梯。
2. minimal 暗档（阶梯与配对为本仓库脚本实测）：`surface` 950 档 14.5 → `background` 900 档 20.5 → `surface-raised` 800 档 26.9 → `accent` 700 档 37.1，步长 6.0 / 6.4（暗档尾端每阶实测就是六点上下，仍是一档一阶）；`--color-well` 随 `surface` 同值（同色井）。现值 `--surface-raised: var(--surface)` 使凸起档消失、阶梯方向与亮档相反，改挂独立 800 档。`disabled` 取 14.5 + `disabled-fg` 92.2 / 15.72。配对 foreground 97.0 / 16.42、surface-fg 92.2 / 15.72、surface-raised-fg 97.0 / 13.86、accent-fg 87.0 / 7.01；accent 对三档静态背景 +22.6 / +16.6 / +10.2，全过 AA 与车道律。
3. minimal 暗档的 `[data-surface]` 八条按同族色相沉到画布之下（950 档一带），逐档实测 `surface-fg` ≥4.5:1 后才回梯；亮档八条现值 92.8–93 对新画布 98.5 已有 5.5–5.7 个 L 点，维持画布之下现状只补实测记录。
4. flat-minimal 亮档（sky 家族同名阶，阶梯为示例值，配对与步长为本仓库脚本实测）：`surface` sky-100 95.1 → `background` sky-50 97.7 → `surface-raised` 纯白 100，步长 2.6 / 2.3；`--color-well` 答 sky-200 90.1（对凹槽 5.0 点）；`accent` 悬停档答 sky-300 82.8，对三档静态背景 −12.3 / −14.9 / −17.2、ΔE 0.143 / 0.17 / 0.194，车道律自然达标，原相邻档豁免登记随本轮撤销。配对 foreground 17.5 / 17.75、surface-fg 29.4 / 12.04、surface-raised-fg 17.5 / 18.94、accent-fg 29.4 / 8.33，全过 AA。发丝边与零阴影仍是本案身份；现值画布近白 99.2 让给凸起位、画布取 sky-50——层级由明度承担优先于「画布恒冷白」。原读 `accent`（sky-200）的骨架屏与占位档改读哪一阶见文末待定项。
5. flat-minimal 暗档（同上标注）：`surface` 16.5（同族色相 243，Tailwind 950 以下无具名阶，步长对齐 sky 家族相邻阶实测值）→ `background` 21.5 → `surface-raised` sky-950 29.3 → `accent` 37.9，步长 5.0 / 7.8；`--color-well` 随 `surface` 同值；`disabled` 16.5 + `disabled-fg` sky-100 / 16.73。配对 foreground sky-50 / 16.38、surface-fg sky-100 / 16.73、surface-raised-fg sky-50 / 13.03、accent-fg sky-50 / 9.32；accent 明度步 +21.4 / +16.4 / +8.6、ΔE 0.22 / 0.169 / 0.093，全过 AA 与车道律。
6. neo-brutalist 只核中性不变量，一阶律的约束对象是 minimal / flat-minimal 两套冷白中性案，本案明度阶参与身份表达、按 schemes.md 第 21 条下沿例外保留现值：`surface-raised` 比 `background` 亮一档（日纯白 100 vs 暖纸 96、夜 20.5 vs 纯黑，成立）且由 2px 纯黑描边兜底；`surface` 是身份色（日酸橙绿 lime-300 / 夜粉 pink-700），不参与中性阶梯排序，取值归 schemes.md 第 20 / 23 条；井底答 `surface`（用户定 2026-11-25，覆盖同日「答 `background` 即关井」的写法）——本案没有比画布更深的中性档，关井写法让轨道与示例舞台同色即消失，井底与凹槽同占身份色一档，井面与轨道靠对画布的色相差自辨。
7. neon-gradient 已摘发布位（schemes.md 待定项），只跟角色归属改派，不参与本轮阶梯取值修订；井底亮档读 `surface`（淡紫 `#e9d5ff`，井上白字实测 12.11:1），暗档自答深紫 `#3b2457`（与本案 `disabled` 同值、比画布 `oklch(25% 0.07 262)` 沉一阶，井上白字实测 13.33:1）——暗档若同读 `surface` 得饱和紫 `#a855f7`，既比画布更亮（反方向律第 1 条「井比宿主低一档」），又把井上白字压到 4.17:1（占位符 3.96:1）破 AA 下限，故暗档单独答值（用户定 2026-11-25）。

## 验收

1. 令牌层：不新增颜色令牌——24 枚色板 + `surface-raised` / `surface-raised-fg` 成对机制槽 + `--color-well` 不变；轨道族与输入井同挂 `bg-well`，皮肤串内不再出现轨道读 `bg-surface`。
2. 阶梯：静态档沿 Tailwind 具名阶一阶一阶排布（不跨阶、不自造中间值），亮暗两档各自的静态三档互不相等、递增方向一致；实测 L 值与步长写进各案 design.md 的 Colors，并标证据强度。
3. 门禁：`pnpm types:check` 零警告（含 check-color-pairs / check-ui-css / check-blueprint-sync），`check-color-pairs` 的 minimal / flat-minimal `accent×surface` 豁免登记已按新阶梯删除并复核通过（flat-minimal `primary×primary-accent` 深化档豁免保留）。
4. 观感：dev 站四案 × 亮暗两档 × 首页 / 文档页 / 示例墙逐页核对——井、凹槽、画布、控件四层按阶递进；亮档阶差只有 1.5–2.6 个 L 点，发丝边与内阴影承担第二道线，二者合看须让人不读描边也知道谁压着谁；夜间浮层压上画布时不需读描边就知道它浮着。观感若判「分不出」，整条阶梯仍按具名阶整体下移（凸起锚纯白 / 800 档不动，凹槽退 200 档、井退 300 档、悬停档随之再下移一阶），照样一阶一阶挪，不造中间步长。

## 已定

1. 轨道族归凹陷层、挂 `bg-well`（用户定 2026-11-25）：井与轨道同属凹陷，`site/shell/contrast.md` 第 9 条的「轨道、进度底挂 `bg-well`」是正本表述；schemes.md 第 9 条「条状件轨道一律读 `surface`」随之改读 `bg-well`，各案 design.md 轨道族「未填充底 surface」措辞同步。
2. 亮档静态三档必须可辨（用户定 2026-11-25）：flat-minimal 不再套「明度阶近乎为零」的例外，按方向律第 5 条分级判据取 sky 家族同名阶重排。
3. 一档一阶（用户定 2026-11-25，覆盖同日早先的「静态三档两两 ≥4 个 L 点」判据）：静态档取值直接用 Tailwind 具名色板阶梯，相邻档只差一阶，画布与纯白只差一阶，差异不做大；schemes.md 第 21 条的「抬亮区间 ≥0.04」不再约束静态中性三档，只约束强调层（`accent` 车道、`primary` 与语义块）。
4. 无更深中性档的方案（neo-brutalist / neon-gradient）井底读 `surface` 而非 `background`（用户定 2026-11-25）：轨道族挂 `bg-well` 后，关井写法会让未填充轨道与 `bg-background` 示例舞台同色、亮暗两档皆不可见；`--color-well` 在两案改指 `var(--surface)`，皮肤串不动。neon-gradient 暗档例外自答深紫（见逐案取值第 7 条，破 AA 者不登记例外）。

## 待定项

1. 亮档 `[data-surface]` 八条与 14 条 `[data-brand]` 的联动：表面色板按各自家族取 100 / 50 / 白 / 200 / 300 五阶，需逐族实测（暖族 stone、冷族 sky 的相邻阶步长不同），随 minimal 整体迁移那一批一起做。
2. flat-minimal 亮档 `accent` 由 sky-200 挪到 sky-300 后，原读 `accent` 的骨架屏 / 占位块是否跟着变深（sky-200 与井底同阶，可留作占位档），随皮肤重排逐件定。
3. 一阶律下亮档画布与凸起只差 1.5 个 L 点，是否给凸起层统一补 1px `border-control` 作第二道线（minimal 现有 `shadow-frame`、flat-minimal 有发丝边、neo 有 2px 纯黑），随皮肤重排逐案定。
2. Checkbox / Radio 指示框与 Switch 拇指走 `shadow-unchecked` 双环（环间隙读 `background`）：凸起层改挂 `surface-raised` 后环间隙色是否改读所在容器档，随这两件重构时逐案定。
3. Chart 轨道线（现 `stroke="var(--surface)"`，chart.tsx:486）与 Radar 轴（radar.tsx:13）是 SVG `stroke` 而非背景填充，`bg-well` 吃不到——是否补一枚轨道描边机制值供 SVG 读，随图表迁移那批定。
