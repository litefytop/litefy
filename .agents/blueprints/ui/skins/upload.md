# Upload 皮肤（app/ui/skins/upload.tsx）

1. 壳：纯定位盒（`relative`）；隐藏 input 是被投放区点击的真 `type=file`（off-screen 车道：裁切隐藏）。
2. 投放区：边框盒形态——`rounded-md border-dashed border-frame border-border bg-background` 底（与 input / select 同例：输入件一律背景色填充，投放区读起来只剩虚线 outline），`py-8 px-6` 居中排 + `gap-1.5`，`text-sm`；虚线框是投放区语义（区别于 List 的实线框）；hover（非禁用）与拖拽悬停（`data-[dragging=true]`）换 `accent` 对；键盘焦点（`focus-visible`）挂方案环；禁用禁指针 + 压暗。文件列表归 demo 拼装（无框行：上传中铺 Progress、完成后文件名点击经 blob URL 新窗口预览、删除为 X 图标钮），不进本件。
3. label 行：`text-sm` + `font-label` 档 + label 两项；hint 行：`text-xs` + `font-field` + `surface-fg`。
4. 专属令牌：无。
（neo 阴影）投放区盒挂 shadow-frame——可交互件必有阴影，minimal 无此工具类不渲染。
