---
name: button-reuse
description: 新增或修改任何按钮前使用。核对成品 Button 的导入路径、text 变体强制复用与无背景 hover 规则。
---

# 按钮复用

1. 新增或修改按钮前，先查 `app/ui/skins/button.tsx` 的 `Button` 与 `buttonVariants`，再查目标组件皮肤是否已有按钮槽位；已有成品或零件时直接复用，禁止另写原生按钮、按钮类串或 hover 状态。
2. 皮肤文件必须从 `./button` 导入成品 `Button`；从 `@/ui` 导入的是无外观骨架，`data-variant` 不会生效。只有骨架文件才从 `./button` 或 `@/ui` 导入原子件。
3. 按钮只有文字，且同行元素也只有文字时，使用 `<Button data-variant="text">`；text 变体不改变背景色、文字色、阴影或图标，hover 只允许文字下划线。
4. 按钮带图标时仍优先使用 `Button`；图标按钮使用 `icon` 槽，需要紧凑尺寸时只覆盖尺寸与定位类，不手写颜色、背景、阴影、边框或 hover 类。
5. `ButtonRoot` 只用于骨架或确实需要任意子内容的无外观按钮；业务层与皮肤不得用它绕过 `Button` 的外观契约。
6. 链接具有按钮观感时引用 `buttonVariants`，禁止在 `Link` 内嵌 `Button`。
7. 复用受阻时先查原因：导入路径、皮肤导出、组件槽位、`classNames` 合并或类型契约；缺槽位就补既有组件的槽位，禁止以“现有组件不合适”为由新建仿按钮。
8. 交付前搜索本次新增文件中的 `<button`、`cursor-pointer`、`hover:` 与按钮状类串，确认没有绕过复用规则。

最小示例：

```tsx
<Button data-variant="text" onClick={onEdit}>编辑</Button>
<Button data-variant="text" icon={<X />} aria-label="移除" onClick={onRemove} />
```
