# Upload 骨架（app/ui/components/upload.tsx）

- 职责：文件选取：点击或拖放取文件，经 accept、maxSize、maxCount 本地校验后交付回调。

## 行为 / 状态

- 导出组合 `Upload` 与原子件 `UploadRoot`、`UploadDropzone`、`UploadHiddenInput`（固定 `type=file`）；类型 `UploadItem { uid, file, signal }`、`UploadReject { file, reason: "accept" | "maxSize" | "maxCount", message }`、`UploadActions { remove, clear }`
- 输入：隐藏 input（`tabIndex=-1`、`aria-hidden`）承接点击，change 读完即清空 `value` 以便同文件重选
- 校验顺序 accept → maxSize → maxCount：accept 按逗号拆分，`.ext` 比文件名后缀、`type/*` 比 MIME 前缀、其余精确比 MIME（均小写）；`maxSize` 仅在 `file.size >` 时拒；剩余名额 = `maxCount − 已持有数`；`multiple=false` 只取首个；通过项各建 `AbortController`，uid 形如 `upload-N`
- 回调：`onFilesAccepted` / `onFilesRejected` 各自仅在非空时调用；`remove(uid)` 中止并回调 `onFileRemove`，`clear()` 中止全部，卸载时同样中止全部
- 拖放：`dragenter` 计数 +1、`dragleave` 计数 −1，归零才清 dragging 并回调 `onDragLeave`；`dragover` / `drop` preventDefault；disabled 时拖放、键盘、input change 与 dropzone 点击均由 JS 阻断，不调用隐藏 input 的 click
- 无障碍：dropzone `role="button"`，`tabIndex` 为 0（disabled 时 −1），`Enter` / `Space` 触发选取；`aria-disabled`、`data-dragging`、`data-disabled`
- 缺省子内容为 label + hint 两行文案，传 `children` 整体替换；动作经 `actionsRef` 暴露
- 槽位：`classNames.dropzone/hiddenInput/label/hint`；`styles.dropzone/hiddenInput`；classNames 全为 string
- 禁用遵循 `ui/schemes.md` 第 8 条：隐藏 input 原生 disabled，dropzone 输出 `aria-disabled` / `data-disabled` 且 `tabIndex=-1`；皮肤用 `mergeSlots` 完整替换 dropzone/hint 正常类串，保留布局并显式禁用色与 `cursor-not-allowed`
