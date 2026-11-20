# Masonry 骨架（app/ui/components/masonry.tsx）

- 职责：瀑布流：按实测条目高度逐项放入当前最矮列。

## 行为 / 状态

- 导出泛型 `Masonry`、`MasonryColumn`（列容器）、`MasonryItem`（条目壳）；`items` + `renderItem(item, index)` + `getKey`（缺省 index）
- `columns` 为数字或 `{ base?, sm?, md?, lg?, xl?, 2xl? }`，断点 640 / 768 / 1024 / 1280 / 1536px，按容器 `clientWidth` 取最深命中，数字等价 `{ base: n }`；缺省 `{ base: 1, sm: 2, lg: 3, xl: 4 }`；取整且下限 1
- 分配 `distribute`：逐项放当前最矮列，高度取条目实测 `offsetHeight`，未测或为 0 记 1；结果与上次相同则保留原引用
- 测量：条目带 `data-masonry-key` 与 `data-masonry-index`；`useLayoutEffect`（无依赖）每次渲染后重测，ResizeObserver 观察根容器；列数与上次分配表不符时先按空高度均分占位
- 嵌套：Context 深度 > 0 时降级为静态多列（`columnCount` + `breakInside: avoid`，列数仍按断点解析），不参与配平；仅开发环境每进程警告一次
- 槽位：`classNames.column/item` 与同名 `styles`
