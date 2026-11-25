# Accordion 皮肤（app/ui/skins/accordion.tsx）

1. 复用 collapse 皮肤类串：外根引用 `collapseRootClasses`（带面层阴影），条目引用 `collapseFrameClasses` + `collapseItemClasses`（不挂阴影），触发行/chevron/面板/内容体四槽引用 `collapsePartClasses`，不另起串。
2. 条目：每项叠加 `collapseItemClasses`——框归外根（条目 `rounded-none border-0`），条目间 `not-last:border-b-hair` 下分隔，末项无线；整组的投影只由外根承担，条目不各自带面层阴影。
3. 禁用态：整组禁用时外根使用禁用背景色与禁用文字色，阴影保持外根原有的 `shadow-surface`，不新增禁用阴影；所有 trigger / body 使用禁用文字色；单项禁用时对应条目使用禁用背景色，其 trigger 显示禁止光标且 body 使用禁用文字色。禁用态不保留 hover / focus-visible 染色。
4. 专属令牌：无。
