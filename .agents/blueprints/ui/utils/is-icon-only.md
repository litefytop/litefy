# is-icon-only 纯图标判定（app/ui/utils/is-icon-only.ts）

1. 职责：判定 children 是否为「纯图标」形态的纯函数，零 DOM。
2. 导出：`isIconOnly`（拍平 Fragment 后恰好一个有效元素且其内无任何文本——字符串非空、数字都算有文本）；`textChildren`（抽出带文本的子节点数组）。
3. 消费方：Button（`data-pure-icon` 纯图标形态判定）；无独立文档页（形态随 Button 文档说明）。
