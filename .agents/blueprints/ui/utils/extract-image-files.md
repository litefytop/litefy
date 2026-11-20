# extractImageFiles 皮肤（app/ui/utils/extract-image-files.ts）

1. 职责：从剪贴板事件的数据载体中提取图片文件，返回 `{ name, url, file }[]`——`name` 取文件名（无名的粘贴位图回退 `pasted-image`），`url` 为 `URL.createObjectURL(file)` 会话内预览地址，`file` 为原始 `File` 供上传；非图片项一律跳过，`dataTransfer` 为空返回空数组。
2. 纯同步、零副作用（除对象 URL 创建）：生命周期归调用方——预览用毕由调用方 `URL.revokeObjectURL`。
3. 典型用法：输入条 `onPaste` 里调用，命中图片即 `preventDefault` 并把结果并入附件列表。
