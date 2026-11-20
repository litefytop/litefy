# SwipeActions 骨架（app/ui/components/swipe-actions.tsx）

- 职责：行内操作滑动件——所有指针（触屏与鼠标）统一物理滑动：拖动行露出动作抽屉，快滑按速度定向，拖越提交点全滑提交——danger 主动作块跃迁铺满整行后行体折叠收起。动作轨收起时 `inert` + `aria-hidden`，键盘与读屏走切换钮开合；内容层动作侧端点渲染一枚滑动提示箭头（`ArrowLeft`，`direction=right` 镜像为 `ArrowRight`，`aria-hidden`），开态与拖拽中隐藏。
- 语义槽位：动作不进数组，按五个语义槽声明——`primary? / info? / success? / warning? / danger?`，各槽一份动作配置（`label`、`icon?`、`onSelect?`、`dismiss?`），每色至多一次由 props 结构锁死；轨道按意图成本排布，浅 → 深 = primary → info → success → warning → danger（danger 最深 = 全滑提交块）。`surface` 不设槽——中性动作落 `info` 或 `primary`。
- 全滑提交固定 danger 槽：跃迁铺满 + `onCommit`（行移除语义）只属于 danger；未填 danger 则无全滑（抽屉到尽头即回弹），`fullSwipe` 不生效。次级槽按下走 `onSelect`（`dismiss` 声明时折叠行）。
- 点按开合：无位移的松手即点按行体——闭态展开、开态收拢，作为滑动领悟的低成本台阶（先看见抽屉滑出，再学会拖）；闭态展开走弹簧滑动（与拖拽松手同一套吸附动画），键盘开合仍瞬时直达；落点在可交互子件（`a`/`button`/表单控件等）上时不劫持，交还子件点击。
- 行体长出：`enter` prop 让挂载首帧停在 `entering` 相位（高度外边距透明度全 0），rAF 后翻回 `idle`，行体从 0 长出——时长与缓动同折叠（`--swipe-collapse` + `ease-frame`，方案自答），供重新插入行等场景使用。
- 选区抑制：拖拽确认（越过迟滞）时清一次浏览器选区（`Selection.removeAllRanges`），配合皮肤的拖拽期 `select-none`——手势不圈选既有文本；行在静止态保持可选中可复制，不做常驻禁选。
- 动作装载：槽位结构上限 5；挂载量宽时抽屉总宽（槽数 × actionWidth）超出行宽即 dev 警告一次（模块级去重，Masonry 嵌套警告先例）——超宽的尾部动作永远露不出来，是可用性约束。

## 行为 / 状态

- 结构：根 `div[role="group"][data-direction][data-open][data-phase][data-disabled]`（`data-phase`：`"idle"`、`"entering"`（长出中）、`"committing"`（跃迁中）、`"collapsing"`（折叠中））> 行体（方角轨道面，不用圆角）> 动作轨（absolute 铺满行体；收起态 `inert` + `aria-hidden`）内含次级语义钮（按浅深序绝对定位，`data-tone` 标语义）与 danger 提交块（块内提交钮）> 内容层（children，承接拖拽，尾端含滑动提示箭头）+ 键盘切换钮（视觉隐藏、聚焦显形胶囊）+ `sr-only` live region
- Props：`primary?/info?/success?/warning?/danger?: SwipeActionConfig`、`direction?: "left" | "right"`（默认 `"left"`，动作落行尾，提示箭头与全部偏移随 `data-direction` 镜像）、`height?`（行高 px，默认 64）、`actionWidth?`（单动作宽 px，默认 80）、`snapBounce?`（快滑吸附回弹，默认 0.2）、`resistance?`（阻尼系数，默认 0.55）、`collapseMs?`（折叠时长 ms，默认 200）、`commitAt?`（提交点占行宽比例，默认 0.6）、`fullSwipe?`（默认 true；仅 danger 存在时生效）、`disabled?`、`enter?`（默认 false；true 时挂载首帧停在 `entering` 相位再长出）、`open?`（受控开合）、`onOpenChange?`、`onAction?`（任意动作按下即回调）、`onCommit?`（danger 折叠动作在行关合后回调，消费方在此移除行）、`closeOnAction?`（默认 true，非折叠动作按下后收拢）、`haptic?`（默认 true，仅触屏指针就绪时 `navigator.vibrate(8)`）、`label?`（根 `aria-label`，默认 `"List item"`）、`toggleLabel?`（键盘胶囊文案，默认按动作数生成）、`className`/`style` 透传根；children 即行内容。行体不用圆角（方角轨道面，同 Banner），无圆角 prop
- 拖拽全链（指针无关，鼠标与触屏同链）：10px 迟滞确认横向拖（纵向让位滚动）、`setPointerCapture` 跟手、越界橡皮筋（`resistance`）、速度末四次采样 ≥110px/s 判 flick 按速度定向、惯性投影过半定向、就绪态 `data-dragging`；松手越过提交点 → danger 块跃迁 + 行面滑到全宽 → `data-phase="collapsing"` 折叠，计时到点回调 `onCommit` 与 `onSelect`；震动仅 `pointerType === "touch"`
- 键盘通路：切换钮——Enter/Space 开合、方向键开/关（随 `direction` 镜像）、Escape 关、开态 Delete/Backspace 提交 danger；`aria-expanded` + `aria-controls` + `aria-keyshortcuts`；开合与就绪文案进 `aria-live="polite"`
- 提示箭头：内容层动作侧端点渲染库自有箭头图标（`direction=left` 为 `ArrowLeft`、`direction=right` 为 `ArrowRight`），`aria-hidden`，随 `data-open` / `data-dragging` 隐藏——提示该行可拖动露出动作；箭头带顿挫的缓移（中速起步、中途一顿、尾段近静止，动画走皮肤，减动效档静止）
- 减动效：`useMotionPreference().reduced` 时吸附走 0.2s 缓动直达、跃迁与铺满直接置位
- 位移动画为骨架自有 rAF 弹簧积分器（零依赖，x 通道独立），每帧经 ref 直写 transform，不进 React state；`height`/`actionWidth`/`collapseMs` 为内联几何变量（行为几何例外，蓝图注明）；圆角走方案令牌
- 外观交给皮肤：语义配色、折叠过渡、胶囊样式、提示箭头样式全走 class，按 `data-tone` / `data-open` / `data-dragging` / `data-direction` 键控；骨架零样式 class，只发 `data-*`、内联几何变量与逐帧 transform
