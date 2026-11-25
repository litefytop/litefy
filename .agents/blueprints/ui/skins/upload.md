# Upload 皮肤（app/ui/skins/upload.tsx）

1. 壳：纯定位盒（`relative`）；隐藏 input 是被投放区点击的真 `type=file`（off-screen 车道：裁切隐藏）。
2. 投放区：边框盒形态——`rounded-md border-solid border-frame border-border bg-surface-raised` 底配 `text-surface-raised-fg`（与 input / select 同例：控件静置面一律归凸起档，见 `ui/schemes/elevation.md`），`py-8 px-6` 居中排 + `gap-1.5`，`text-sm`；hover 与拖拽悬停（`data-[dragging=true]`）吃 `accent` 背景档（并写它的配对前景 `accent-fg`）；键盘焦点（`focus-visible`）挂方案环；禁用按 `data-[disabled=true]` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / dragging 类；动作由原生 disabled 阻断。文件列表归 demo 拼装（无框行：上传中铺 Progress、完成后文件名点击经 blob URL 新窗口预览、删除为 X 图标钮），不进本件。
3. label 行：`text-sm` + `control-label`；hint 行：`text-xs` + `font-field` + `foreground`；dropzone 的 hover 与拖入态只铺 `bg-accent` 背景档（文字色保持 `foreground`），禁用态仍用独立禁用类串。
4. 专属令牌：无。
（neo 阴影）投放区盒挂 shadow-frame——可交互件必有阴影，minimal 无此工具类不渲染。
