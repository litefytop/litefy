---
name: disabled-components
description: 新增或修改任何禁用态组件、禁用 demo 或禁用样式时使用。区分单容器与双容器，按状态替换类串，禁止额外 DOM、包裹层和排除式 hover。
---

# 禁用态组件

1. 先判断交互件是单容器还是双容器，再按对应规则实现；现有组件蓝图与本技能冲突时先裁决。
2. 单容器组件（Button 等）：
   1. 基础类串只保留布局、尺寸、圆角、边框、阴影等恒常结构。
   2. 正常态与禁用态分别定义完整类串；禁用态使用 `bg-disabled`、`text-disabled-fg`、`cursor-not-allowed` 和对应禁用阴影。
   3. 禁用时只选择禁用类串，不挂载正常态的 hover、active、focus 或按压变体。
   4. 原生按钮使用原生 `disabled`；不使用 `pointer-events-none`、`inert`、`dim` 或 `hover:not-disabled:` 兜底。
3. 双容器组件（Input 等）：
   1. 外层 group 承载禁用背景色、文字色、边框、阴影与 `cursor-not-allowed`，不保留正常态焦点和 hover 类。
   2. 内层真正的原生 input 保留原生 `disabled`，并挂 `pointer-events-none` 阻止指针进入输入层。
   3. 禁用时同时替换外层与内层类串，不在正常类串上叠加 `disabled:` 覆盖。
4. 两类组件都只切换类串，不新增包裹层、副本节点或仅用于禁用的 HTML；`aria-disabled` 不能替代原生 `disabled` 的交互阻断。
5. 定制交互条目使用 `data-disabled` / `aria-disabled` 配合 JavaScript 阻断点击、键盘和导航；不把 `pointer-events-none` 当作通用禁用方案。
6. 验收时确认禁用态背景色、文字色与光标正确，正常态变体未残留，且 DOM 节点数量不因禁用态增加。

最小示例：

```tsx
const classes = disabled ? disabledClasses : normalClasses;
return <button disabled={disabled} className={classes}>{children}</button>;
```
