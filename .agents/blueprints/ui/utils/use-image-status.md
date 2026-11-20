# useImageStatus 图片探测（app/ui/utils/use-image-status.ts）

1. 职责：图片加载三态探测 hook：`loading` / `success` / `failure`。
2. 行为：内部 `new Image()` 预载（不发真实请求的第二次下载，命中缓存）；`src` 变化回 `loading`；`onload` / `onerror` 经 `startTransition` 落 `success` / `failure`（不阻塞交互渲染）；卸载置失活标记，迟到回调被忽略；`src` 为空直接 `failure`。
3. 服务端快照与初始态一致（有 `src` 即 `loading`），无水合分叉。
4. 消费方：Avatar（三态机）、Image（渐进淡入）；安装与 API 正本为 `content/docs/utils/use-image-status.zh.mdx`。
