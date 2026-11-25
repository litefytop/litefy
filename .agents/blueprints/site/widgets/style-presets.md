# 风格预设卡（app/components/style-presets.tsx · 嵌 `/:lang/styles` 正文）

- 职责：把「运行期换色」收编成可命名的预设——一张卡 = 一组属性组合（`data-brand` + 该方案的第二档 `data-accent` / `data-surface`），不做取色器、不接受任意色值输入；开放调色归待定项，预设是发版最小面。
- 数据源：预设表只登记属性组合名与双语说明，色值一律不复制——色样圆点内联读 `var(--primary)` / `var(--accent)`（与 `PaletteSection.dotVar` 同法，随日夜档重绘），避免与方案 `index.css` 的 ramp 正本漂移。
- 归属：预设按方案分组，卡数 = 该方案 `[data-*]` 梯的实际组合数；`STYLE_TEMPLATES[].palettes` 为空的方案（flat-minimal）不渲染该区，也不渲染空壳。
- 交互：点击卡 = 即时预览——走既有 `loadStored` / `applyAttr`（site/shell/root.md 的 RampSync 同一套存储键），写 localStorage 并同步根元素属性，整页重绘；无路由跳转、无二次确认。当前生效组合高亮，判据是各档存储值与卡上组合一致。
- 导出两枚按钮，卡内并排：
  1. 属性串——复制 `<html lang="zh" data-brand="lime" data-accent="amber">`，这是方案的正式接法（ramp 正本已在 `index.css` 里，属性是唯一入口）；
  2. CSS 变量块——复制 `:root { … }` + `.dark { … }` 两段实值，值经遍历 `document.styleSheets` 命中该组合的 ramp 规则后 `getPropertyValue` 读出（实测值，非誊写）；跨域样式表读不到 `cssRules` 时该按钮禁用并提示改用属性接法，不静默输出半截块。
- 文案双语内置组件内（同 showcase 页做法），不进 `content/docs/`；正文说明归 `content/guide.md` 第 4 节。
- 无障碍：卡是 `button`，预览结果由 `aria-pressed` 表达；复制成功用既有 clipboard 反馈，不新增 toast 依赖；纯图标按钮经 `data-pure-icon` 契约；对比与命中区按 `ui-rules` 四车道验收，色样圆点属装饰（`aria-hidden`），色名以文字给出，不单靠颜色传达。
- 外壳：复用 `Card`（内容容器，铺 `bg-surface-raised`）与 `buttonVariants` 既有形态，禁手写按钮串。
