# NumberField / NumberInput 皮肤（app/ui/skins/number.tsx）

1. 双形态一枚内核：`NumberField` 自带步进壳（框、焦点与无效读法、↑↓ 提示都在壳上）；`NumberInput` 是 Input 组壳——整包复用共享字段框（`fieldGroupClasses`），只有自己的零件（suffix、↑↓ 指示）带数字专属工具类。
2. NumberField 壳：`w-fit max-w-full` + 框距 `p-well`（方案井框距 `--padding-well`，替代旧 1px 内间距）——最小高在 `height-field` 基础上补 2px，外廓随框距整体增大；总宽名义 3 格加框距与边框（两侧步进钮与值区各 1 格，`w-control` 基准），窄容器随 `max-w-full` 让位；`rounded-md` + `border-frame` 描边 + 底色方案自答 + `shadow-base` 浮起；焦点 `focus-within` 读法方案自答；无效（`data-[invalid=true]`）边转 `danger-fg`，聚焦叠加危险底色（方案自答），未聚焦时值文字也转 `danger-fg`。
3. 步进钮：两端 `w-control` 竖条（`--width-control` 派生自 `--height-control`，11 单位两档自答）+ 自带完整描边（`border-control` 宽档方案自答 + `border-border`）+ 透明底（与壳同色，井机制的「前后缀同色」律）配 `foreground` 文字；贴壳侧两角同心圆角（角 = `radius-md` − `padding-well` 框距 − frame 边宽，贴值区一侧直角）；命中区即盒子（紧凑档随令牌收缩）；hover 换 `accent` 对，按下沿共享 `--translate-crush` 压平，禁用压暗；± 字形自带尺寸（`size-4`）。
4. 值区走数字件车道（delivery `references/skin-rules.md` 第 16 条第 3 项）：`w-control` 与步进钮同宽、随令牌缩放——零运行期计算，输入框不随内容生长，超宽内容（千分位、改大的 max）在框内横向滚动；输入无边框，`bg-well` 井底 + `shadow-well` 井内阴影承凹，值区两侧恒贴步进钮（恒为中间件）——四角直角，端帽圆角只属步进钮贴壳侧；开发者改大 `max` 时自行经 `classNames.root` 加宽值区（如 `w-22`）。值文本挂 `tabular-nums`，等宽数字宽度可预期。
5. 共用零件：值输入透明居中（`text-sm` + `font-field`，选区 `primary` 背景色 + `primary-fg` 前景色）；字符串 suffix 由皮肤包进自有 span（`text-sm` + `font-field` + `surface-fg`），自定义节点直通；↑↓ 指示 `surface-fg`，双 chevron 负边距叠成一枚字形（`first:-mb-0.5`）；Input 组 trailing 插件槽有 cue 时补间距；浮动提示接共享 `fieldHintClasses`。
6. NumberInput 壳：`data-[invalid=true]` 时未聚焦的值文字转 `danger-fg`（壳级补刀，Input 基框不重复此读法）；宽度走宿主车道（缺省 `w-55`，消费方 `w-full` 接管）。
7. 专属令牌：无。
