# usePagination 页码状态机（app/ui/utils/use-pagination.ts）

1. 职责：1 基页码状态机——钳位/循环归一、导航派生与变更回调，泛用于分页与步进场景；零 DOM。
2. 参数：`total` 必传（数字或取数函数）、`base`（起始页，默认 1）、`loop`（默认 false）；内部以 0 基索引存，对外全按 `base` 制页码。
3. 归一：`total <= 0` 恒 0；`loop` 取模回环，否则钳 `[0, total-1]`；effect 监听归一参数变化，回写越界页并补发一次 `onChange`。
4. 导出：`index` / `total` / `setIndex`（支持函数式更新）/ `goTo` / `next` / `previous` / `toFirst` / `toEnd` / `isFirst` / `isEnd`（仅非循环态有意义）；页码不变不回调。
5. 消费方：公开 hook，分页类消费方自行采用（Pagination 组件自管状态，不经它）；安装与 API 正本为 `content/docs/utils/use-pagination.zh.mdx`。
