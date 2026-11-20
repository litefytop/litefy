# useUploadMonitor 上传监视（app/ui/utils/use-upload-monitor.ts）

1. 职责：XHR 上传进度监视 hook——把 Upload 骨架交付的 `{ uid, file, signal }` 接到真实上传，四态进度回写；展示归消费方。
2. 状态：`fileList: UploadMonitorItem[]`（`uid` / `file` / `status: pending | uploading | success | error` / `progress 0–100`）。
3. 行为：`acceptFiles(items)` 逐件建 FormData（字段名 `fieldName` 默认 `file`，附加 `data` 键值）POST 到 `action`，可带 `headers` / `withCredentials`；`onprogress` 回写百分比、2xx 落 success、非 2xx / 网络错 / 中止均落 error；`item.signal` 中止联动 XHR abort。
4. 生命周期：`removeItem(uid)` 单件中止并移除、`clearAll()` 全中止清空、卸载全中止；同 uid 重复受理忽略。
5. 消费方：Upload 的消费方 demo（骨架只发文件与 AbortController，上传本体在此）；安装与 API 正本为 `content/docs/utils/use-upload-monitor.zh.mdx`。
