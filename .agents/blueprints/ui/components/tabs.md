# Tabs 骨架（app/ui/components/tabs.tsx）

- 职责：标签页，支持横向滚动、纵向排布、常驻更多菜单与 roving 焦点。

## 行为 / 状态

- 导出 `TabsList` / `TabsTrigger` / `TabsContent` / 组合 `Tabs`；`Tabs` 收 `options[{ value, label, content?, disabled? }]`
- 受控 / 非受控：`value` 存在即受控，否则内部取 `defaultValue ?? options[0]?.value ?? ""`；切换统一走 `handleValueChange`（非受控同时 setState）并回调 `onValueChange`
- id 作用域：`uid` 由 `useId` 净化（去非字母数字/下划线/连字符）后拼成 `tabs-<uid>-trigger-<value>` 与 `tabs-<uid>-panel-<value>`
- `TabsTrigger`：`role="tab"` + `aria-selected` + `aria-controls` 指向对应 panel + `data-value` + `data-state`（active / inactive），内联 `flexShrink: 0`；disabled 时点击与 Enter / Space 都不触发切换
- 键盘为手动激活：ArrowRight（纵向追加 ArrowDown）、ArrowLeft（纵向追加 ArrowUp）在 `[role="tablist"]` 内非 disabled tab 间循环移动焦点，Home / End 到首尾，Enter / Space 选中当前焦点项；焦点移动不改变选中值
- `TabsList` 横向：外层 div 内为 prev / next 滚动按钮（`data-direction`、`aria-label` 取 `prevLabel` / `nextLabel`，缺省 "Scroll tabs left" / "Scroll tabs right"）与 `role="tablist"` 的滚动容器；按钮禁用态由 3px 阈值的 `scrollLeft` / `scrollWidth` 边界推导，点击滚动 `0.8 × clientWidth`
- 溢出探测：`ResizeObserver` + scroll 监听更新 `{ overflow, start, end }`，overflow 时根加 `data-overflow="true"`；`activeValue` 变化时把 `[data-state="active"]` 以 `inline: "nearest"` 语义滚入视野——实现上直接调滚动容器自身的 `scrollLeft`（rect 相对差值，不用 `scrollIntoView`），滚动只落在标签滚动容器内，纵向祖先（页面滚动容器/window）不动；纵向不渲染滚动按钮，根自身即 `role="tablist"`
- `TabsContent`：非激活且 `unmountOnHide`（默认 true）返回 null；否则 `role="tabpanel"` + `aria-labelledby` + `hidden`，非激活时再叠内联 `display: none`
- 根带 `data-orientation`
- 槽位：`classNames: root / list / scroll / scroller / trigger / content`；`className` 拼到根，`panelClassName` 与 `classNames.content` 拼到每个 tabpanel
