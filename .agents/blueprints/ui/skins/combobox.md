# Combobox 皮肤（app/ui/skins/combobox.tsx）

1. 组合：内部装配 Picker（字段组 + 面板）与 List。容器吃 `fieldGroupClasses`（input 皮肤同源单一正本，与 FilterCombobox 输入条同源）+ `relative cursor-text`——字段框外观（框线、高度、无效态、focus-within 焦点环）全在容器，根不再用 `pickerClasses.root`；前后缀槽自带间距，容器不再加 `gap-x-2`。
2. 裸输入框（`input`）：`min-w-0 grow basis-0 self-stretch border-0 bg-transparent p-0 outline-none font-field text-sm text-foreground placeholder:text-surface-fg`，有 trailing 时 `data-[trailing=true]:pr-9` 给右端钉住的后缀留位；装饰不内嵌，光标态随容器 `cursor-text`。
3. 前缀（`leading`）：控制档槽位 `inline-flex w-control shrink-0 self-stretch items-center justify-center`——44×44 整槽、图标居中（视觉内缩不贴边），骨架缺省 `Search` 图标。
4. 后缀（`trailing`）：控制档槽位钉在容器右端 `pointer-events-none absolute inset-y-0 right-0 inline-flex w-control items-center justify-center`——44×44 整槽、图标居中（视觉内缩不贴边）；有 trailing 时输入框 `data-[trailing=true]:pr-9` 给图标让位。
5. 面板：`pickerClasses.content` + 圆角补偿带 `panelPadClass`（律见 `ui/schemes.md` 第 12 条），锚定字段组容器、宽度锁容器。
6. 面板内视口：`listViewportClasses` + `max-h-64` 上限——去 List 自己的框（`border-0`）且不设自身圆角（圆角归面板，行 hover 由补偿带兜住）；行吃 `listClasses.item`。
7. 专属令牌：无。
