# trap-tab-key 焦点循环（app/ui/utils/trap-tab-key.ts）

1. 职责：模态容器内的 Tab 循环，单函数零状态。
2. 行为：`Tab` 之外的键不动；收集容器内可聚焦元素（`button` / `[href]` / `input` / `select` / `textarea` / 非 -1 `[tabindex]`，`offsetParent` 过滤隐藏件）——空集合 `preventDefault` 吞掉 Tab 防焦点逃逸；Shift+Tab 在首元素（或焦点已在容器外）时落到末元素，Tab 在末元素时落回首元素。
3. 焦点顺序 = DOM 顺序：循环次序由 DOM 决定，不重排。
4. 消费方：Dialog、Drawer（`open` 期间的 keydown 委托）；安装与 API 正本为 `content/docs/utils/trap-tab-key.zh.mdx`。
