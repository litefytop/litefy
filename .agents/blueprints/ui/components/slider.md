# Slider 骨架（app/ui/components/slider.tsx）

- 职责：单值滑块，指针拖拽与键盘调节，支持横 / 纵两向；可见标签可选，值文本常显、`hideValue` 显式隐藏。

## 结构 / 槽位

- 导出 `Slider` 与基础件 `SliderRoot`（div）/ `SliderTrack`（div）/ `SliderFill`（div，`aria-hidden`）/ `SliderThumb`（`button[type=button]`，内含增量气泡 span）/ `SliderLabel`（`label`）/ `SliderValue`（`span`）
- `classNames` / `styles` 槽位：`track / fill / thumb / label / value / bubble`
- 根节点渲染序：`SliderLabel`（传 `label` 时）、`SliderTrack`（内含 `SliderFill` 与 `SliderThumb`）、`SliderValue`（未传 `hideValue` 时）三者平级——标签与值文本在轨道外流内排布，行 / 列方向由皮肤解释；`SliderLabel` `htmlFor` 指向 thumb id
- `SliderValue` 常显当前对齐值，`aria-hidden`，语义值由 `aria-valuenow` 承担
- thumb id 取 `props.id ?? React.useId()`；传 `label` 时 thumb 发 `aria-labelledby` 指向 label 节点，未传 `label` 时用 `aria-label`（二者互斥，文档注明）
- 根节点透传 `data-variant`（外观钩子，取值语义由皮肤解释，骨架不解读）；方向只由 prop 与 thumb 的 `aria-orientation` 表达，方向外观由皮肤按 orientation prop 选串解析，骨架不发方向标记

## 行为 / 状态

- 默认 `min=0`、`max=100`、`step=1`、`defaultValue=0`、`orientation=horizontal`、`disabled=false`、`hideValue=false`；`value` 受控，否则内部状态
- `hideValue`：布尔开关，默认关闭（值文本显示）；开启时不渲染 `SliderValue`
- `alignStep`：`(num - min) / step` 四舍五入后乘回并加 `min`，clamp 到 min/max，按 `step` 小数位数 `toFixed` 消浮点误差
- 百分比取当前值在 `[min,max]` 的占比并 clamp 0–100；fill 与 thumb 位置为内联样式（纵向时 fill 自底、thumb 按底部比例定位），再合并 `styles.fill` / `styles.thumb`
- 轨道 `pointerdown`：非禁用时按指针位置算值、写值并聚焦 thumb（label / value 在轨道外，天然不命中轨道）
- thumb `pointerdown`：仅主键；`preventDefault` + `setPointerCapture`，记录拖拽起始值，`pointermove` / `pointerup` / `keydown` 挂 document 并按 `pointerId` 过滤；拖拽中按 Esc 恢复起始值并结束拖拽（指针可取消），焦点保持在 thumb；抬起时释放捕获并解绑；`pointercancel` 按 Esc 路径恢复起始值并结束拖拽；卸载时兜底解绑已挂的 document 监听
- 增量气泡：thumb 内渲染 `<span aria-hidden data-show>`，仅指针拖拽期间渲染本次增量文本（`当前值 − 拖拽起始值`，正数带 `+` 号，按步长小数位 `toFixed`；增量为 0 时不渲染内容、不发 `data-show`）；键盘调节不弹气泡（常显值已覆盖）；语义值由 `aria-valuenow` 承载，气泡不进无障碍树
- 键盘：←/↓ 减 `step`、→/↑ 加 `step`、PageUp / PageDown 加减大步长（`step × max(1, round((max-min)/10/step))`）、Home → min、End → max，命中即 `preventDefault`；禁用时不响应
- thumb：`role="slider"`、`aria-valuemin|max|now`、`aria-orientation`、`aria-disabled`，`tabIndex` 非禁用 0 / 禁用 -1 且带 `disabled`
- 根禁用时输出 `data-disabled` / `aria-disabled`，不挂 inert；thumb 原生 disabled、`tabIndex=-1`，值变更、轨道 pointerdown、thumb pointerdown 与键盘处理均由 JS 阻断；传 `name` 时输出隐藏 input 承载当前值
- `classNames.track/fill/thumb/label/value` 为 `SlotClassName`（string 或 `(state: SlotState) => string | undefined`），bubble 为 string；`mergeStateSlots` 对 string/string 静态 `cn`，含 function 时返回状态函数，双方按同一状态求值后 `cn`
- 禁用遵循 `ui/schemes.md` 第 8 条：皮肤完整替换 thumb/label/value 正常类串，track/fill 背景改用禁用色，保留几何并显式禁用色与 `cursor-not-allowed`
