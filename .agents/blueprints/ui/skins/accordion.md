# Accordion 皮肤（app/ui/skins/accordion.tsx）

1. 复用 collapse 皮肤类串：根框引用 `collapseRootClasses`，触发行/chevron/面板/内容体四槽引用 `collapsePartClasses`，不另起串。
2. 条目：每项叠加 `collapseItemClasses`——框归外根（条目 `rounded-none border-0`），条目间 `not-last:border-b-hair` 下分隔，末项无线。
3. 专属令牌：无。
