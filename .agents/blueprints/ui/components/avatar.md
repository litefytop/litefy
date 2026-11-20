# Avatar 骨架（app/ui/components/avatar.tsx）

- 职责：头像的三态结构与状态机。

## 行为 / 状态

- `useImageStatus(src)` 驱动三态：loading 直接渲染 skeleton 节点本身、failure 直接渲染 fallback 节点本身（两者均为调用方节点，骨架不做任何包装）、success 渲染 img（`loading="lazy"` + `decoding="async"`）
- 槽位元素全部由调用方或皮肤提供：`classNames` / `styles` 仅 `image` 一槽（挂 img 元素本身）；skeleton / fallback 不设 classNames 键——要定制外观就传自带样式的节点
- skeleton / fallback 缺省时不渲染任何占位（默认占位由皮肤层提供）
- AvatarRoot / AvatarImage 单独导出，供不加载图片的组合场景
