# demo 格式（app/demos/<name>/）

1. 文件名即 `<ComponentPreview name>` 的取值：`basic.tsx` 主示例、`variants.tsx` 变体合集；禁用态固定使用 `disabled.tsx`，其他开关属性拆出的 demo 以属性命名
2. demo 组件一律默认导出，组件名统一叫 `Demo`（`export default function Demo()`），靠文件名区分

## 容器

1. 内容居中；桌面档舞台比例定窗 `aspect-video`、窄档自然撑高并保留最小高度（机制见 `site/widgets/component-preview.md` 蓝图），demo 以普通组件直接渲染在文档流里，不做档位预览——响应式验证由开发者缩放浏览器窗口完成
2. `overflow: auto` + `min-width/min-height: 0`，避免布局抖动
3. demo 内部无需 div 包裹，直接展示组件

## 内容

1. **一组件一 basic（默认）**：AI 默认只写一个 `basic.tsx`；实现了禁用态的交互组件按内容规则第 3 条配 `disabled.tsx`。其他确需多个 demo（不同形态、不同输入面分开演示等）必须由开发者显式说明后才加，避免规则被滥用；未经开发者说明不得自行拆出第二个 demo 文件。
2. 变体是外观合集（`variants.tsx`）：全部外观变体用一个 demo 展示，不按变体拆文件。
3. 禁用态只渲染一个禁用实例，不与可用态对比，也不堆叠多个实例对比展开与收起状态；条目级禁用组件整组禁用，有组级 `disabled` 时传组级 prop，细则见 `.agents/blueprints/demo/demos.md` 第 2 条
4. 受控演示不配文字说明——「Selected: …」/「Hidden: none」/「Container width: …px」这类回显段落一律不写，控件自身的状态呈现即反馈；回显不再需要驱动状态时，连 state 一起省掉
5. 容器结构收敛：一层能解决的不套两层；组件直挂 `className` / `style` 能表达的不再包 wrapper div；demo 根容器 `flex flex-col` 组织，内容居中用 `items-center` / `mx-auto`，不靠默认拉伸
6. demo 文案一律英文，以组件默认值为准，不写中文——文档站界面是中文，但 demo 展示组件正本形态
7. demo 尺寸收敛：内容不滚动就能表达的，不放大容器、不堆叠列表凑体量；容器大小与功能无关时取小尺寸——示例墙按原尺寸渲染预览，demo 越小预览越清晰
