# Litefy Preset — 皮肤方案包契约

组件源码里的**零件（parts）是无皮肤的裸结构**：只输出 DOM、逻辑、ARIA，不带任何 class，也不带组件身份属性。
**成品（finished components）带语义 class**，外观与布局结构全部由本目录的方案包 CSS 提供，
**整包分发，不随单组件下载**。不存在 `data-litefy` 这类自造身份属性——class 与 data-x 就是语言。

## 加载顺序

- `preset/index.css` 在 `@import "tailwindcss"` 之后导入（见 `app/ui/styles/index.css`）。
- 所有规则写在 `@layer components`：低于 Tailwind `utilities`（业务用工具类即可覆盖），高于 `base`。
- 颜色/阴影/圆角只引用 `theme.css` 的语义 token（`var(--background)`、`var(--elevation-base)`、`var(--radius-md)`…），换肤 = 只换 token 块。

## 选择器契约

- 成品根元素：class `litefy-<name>`（如 `.litefy-button`、`.litefy-select`、`dialog.litefy-dialog`）。
- 外观变体：class `litefy-<name>-<variant>`（如 `.litefy-button-primary`、`.litefy-button-outline`）。
- 零件槽位：`data-slot="<name>-<part>"`（如 `[data-slot="dialog-content"]`、`[data-slot="select-panel"]`）。
- 状态：data-x 属性（下表），皮肤用 `[data-x="true"]` / 枚举值选择。
- 定位引擎属性（`data-anchor-name` / `data-float-*`）属于骨架行为，皮肤不依赖。
- 交互状态（focus / disabled / active 按压）由 base 层 `interactive.css` 统一托管，皮肤只补组件特有形态。

给非组件元素套成品外观 = 直接挂成品 class：

```tsx
<Link to="/docs" className="litefy-button litefy-button-primary">阅读文档</Link>
```

## 状态属性字典（data-x）

| 属性 | 取值 | 含义 |
|------|------|------|
| `data-state` | `open` \| `closed` \| `steady` | 互斥开合/滑动状态 |
| `data-open` | `"true"` | 浮层/面板打开 |
| `data-checked` | `"true"` | 选中/勾选 |
| `data-disabled` | `"true"` | 禁用（基础层 `:disabled` 仍兜底） |
| `data-invalid` | `"true"` | 校验失败 |
| `data-highlighted` | `"true"` | 键盘高亮项 |
| `data-selected` | `"true"` | 已选中项 |
| `data-active` | `"true"` | 当前项（页码/页签/步骤） |
| `data-placeholder-shown` | `"true"` | 未选值、显示占位 |
| `data-pure-icon` | `"true"` | 仅图标内容 |
| `data-inline` | `"true"` | 零件进入行内布局（如 Dialog 标题行关闭钮） |

布尔态只写 `="true"` 或省略（选择器用 `[data-x="true"]`）；枚举态写枚举值。变体不是状态，走 class。

## 迁移中的试点

| 组件 | 成品 class | 零件 data-slot |
|------|-----------|----------------|
| Button | `litefy-button` + `litefy-button-{primary\|danger\|outline\|text}` | — |
| Select | `litefy-select` | `select-value` `select-chevron` `select-panel` `select-option` `select-group-label` `select-empty` |
| Dialog（成品） | `litefy-dialog`（挂在 `<dialog>` 根） | `dialog-content` `dialog-header` `dialog-title` `dialog-close` `dialog-title-icon` |
| Popover（零件） | —（trigger 裸 button，样式经 `classNames.trigger` 挂成品 class） | `popover-content` |
| DropdownMenu / MultiSelect / Command（成品） | trigger 复用 `litefy-button litefy-button-primary` | — |
