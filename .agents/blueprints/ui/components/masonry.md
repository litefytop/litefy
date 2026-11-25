# Masonry 骨架（app/ui/components/masonry.tsx）

- 职责：瀑布流提供逐列高度均衡与浏览器静态多列两种布局。

## 行为 / 状态

- 导出泛型 `Masonry`、`MasonryColumn`（列容器）、`MasonryItem`（条目壳）；`items` + `renderItem(item, index)` + `getKey`（缺省 index）
- `columns` 为数字或 `{ base?, sm?, md?, lg?, xl?, 2xl? }`，断点 640 / 768 / 1024 / 1280 / 1536px，按容器 `clientWidth` 取最深命中，数字等价 `{ base: n }`；缺省 `{ base: 1, sm: 2, lg: 3, xl: 4 }`；取整且下限 1
- `layout="balanced"`（缺省）：逐项放当前最矮列，高度取条目实测 `offsetHeight`，未测或为 0 记 1；结果与上次相同则保留原引用；条目带 `data-masonry-key` 与 `data-masonry-index`，每次渲染后重测，ResizeObserver 观察根容器；列数与上次分配表不符时先按空高度均分占位
- `layout="static"`：使用 CSS `column-count` / `column-gap` 与 `break-inside: avoid`，按文档顺序先填满一列再进入下一列；不读取条目高度、不计算列分配、不观察条目尺寸；仅根容器 ResizeObserver 解析响应式列数
- 嵌套：Context 深度 > 0 时始终降级为静态多列，不参与配平；仅 balanced 嵌套在开发环境每进程警告一次
- 槽位：根 `className` / `style`，`classNames.column/item` 与同名 `styles`；根两种布局均默认 `width: 100%`，`style` 可覆盖；static 模式的 column 槽作用于 CSS 多列容器，item 槽作用于每个防断行条目壳
