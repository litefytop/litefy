# Combobox 骨架（app/ui/components/combobox.tsx）

- 职责：输入联想选择器，本地静态过滤或远程分页搜索。

## 行为 / 状态

- 数据源二选一：`options`（本地）或 `fetcher`（远程）；未传 fetcher 时使用返回空的 noopFetcher
- 本地过滤：option 与 keyword 均做去空白 + 小写归一化后 `includes` 匹配，空关键字返回全部
- 远程：`useRemotePagination`（utils/use-remote-pagination）按 `{ page, size, keyword }` 拉取 `{ list, total }`；挂载且有 fetcher 时先 `search("")` 拉首屏；List 滚动到底且 `hasMore && !loading` 时 `loadMore()`
- 默认 `pageSize=20`、`debounceMs=300`
- 值受控（`value` + `onValueChange`）或 `defaultValue`（默认 ""）；`commit` 统一写值、触发 `onValueChange` + `onCommit`、关闭面板并 `reset()`
- 输入法保护：组合输入期间仅更新内部值，不触发 `onValueChange` 与搜索；组合结束后用最终文本补偿触发；原生 `onCompositionStart/End` 透传
- 键盘导航与高亮由 `useCombobox`（utils/use-combobox）提供；面板关闭即 `reset()`
- 消费方 `onKeyDown` 先行、`preventDefault` 则跳过列表键（Picker 同款链式）
- 组合 `Picker` + `List`：Picker 管开关与输入框；`trailing` 缺省无——聚焦即弹候选面板，无需图标示意；与 Select（常驻下拉箭头）靠此区分；`invalid` 映射 `aria-invalid`
- `empty` 缺省文案：fetcher 加载中为 "Loading..."，否则 "No data"
- List 的 `getKey` 为 `${item}-${index}`；`classNames.item` 优先于 `classNames.list.item`
- 槽位：`classNames: panel / item / input / trailing / list`（panel 映射 Picker 的 popover）、`styles: panel / item`
