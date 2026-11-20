# Image 骨架（app/ui/components/image.tsx）

- 职责：先预加载探测再渲染的图片：占位保持挂载，大图叠层淡入，渐进呈现。

## 行为 / 状态

- 导出 `ImageRoot` / `ImageImage` / 组合 `Image`；`ImageImage` 固定 `loading="lazy"` 与 `decoding="async"`
- `Image` 经 `useImageStatus(src)`（utils/use-image-status）探测：内部 `new Image()` 加载，`src` 变化回到 `loading`，卸载后忽略迟到的 onload/onerror
- 渐进渲染：`failure` → `fallback`；`loading` 与 `success` 都保持 `loadingNode` 挂载（撑盒责任在占位或调用方尺寸）——`success` 时 `ImageImage` 绝对叠层盖在占位上并发射 `data-revealed`（挂载后下一帧置真，驱动皮肤淡入）；`src` 为空时直接判定 `failure`
- 只有 `success` 才输出 `<img>`，`alt` 与其余 img 属性原样透传到该节点
- 根 div 的 className 为 `classNames.root + className`（拼接为空则不输出），`style` 落在根
- 无 ARIA 角色、无重试、无骨架尺寸占位；占位与兜底节点完全由调用方提供
- 槽位：`classNames: root / image`；`styles: image`
