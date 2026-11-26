# 外观与动效面板（app/components/appearance-panel.tsx）

- 单一 Popover 面板，由页脚/顶栏的 44×44 图标按钮打开；不嵌套二级菜单。
- 风格不进面板：独立 `StyleSelect`（app/components/style-select.tsx，Select 下拉）挂在侧栏页脚与顶栏、`AppearancePanel` 旁——风格会持续新增，下拉是它的容器，也避免浮层内再叠浮层；切换走 `toStylePath` 并保留滚动位置，当前风格即选中值。
- 面板三节，顺序固定：外观、动效、调色板。
- 外观：跟随系统 / 浅色 / 深色，读写 `useTheme()`；保持 `useTheme` 现有默认值，不因面板改变首次访问的主题。
- 调色板：复用 `PaletteSection`，档数与属性名全读 `STYLE_TEMPLATES[].palettes`——面板不认方案名，只认配置里的一档一条（minimal 为品牌 `data-brand` + 表面 `data-surface`，neo-brutalist 为品牌 `data-brand` + 强调 `data-accent`，flat-minimal 无档）。有调色板的皮肤显示色板，没有调色板的皮肤显示只读 `LiveSwatches`，不隐藏整节。色样可视 24×24（HeroUI sm 档），6 列网格、间距用外边距（`m-1`），不撑 44 命中格。色样取固定字面色（`PaletteOption.swatch`，运行时 ramp 值是 color-mix 衍生色不作色样）：品牌行取 Tailwind 500 刻度；minimal 的表面行全是近中性灰——各取自身 ramp 色相与 chroma 提到 500 亮度的字面值，不套彩色档；neo 的强调行取该档 ramp 的字面饱和色（酸绿/亮黄这类高饱和身份色本身就是一档，不做中性化处理）；`default` 读方案自身变量。模仿 ColorSwatchPicker：未选中 hover 放大、选中双环（画布色间隙 + 同色外环）。
- 动效：跟随系统 / 减少动态 / 完整动态，读写 `useMotionPreference()`；无说明文字。
- 每节使用同一分段控件：皮肤 `SegmentGroup`（`useSiteSkin` 注入，默认档），面板只覆盖容器宽度 `w-full` 撑满面板（组件默认 `w-fit`）；容器边框、内格与选中态（`bg-primary text-primary-fg shadow-frame`）全用组件默认，面板不自写分段样式，radiogroup 语义与方向键由组件持有；节标题与分隔线——节标题用方案 label 文字档（`text-label control-label`），与 Field label 同源。
- 面板宽度按最宽行定档取 `w-96`：分段钮文字定宽、不随 `--spacing` 缩放（几何令牌全端恒定，无紧凑档），`w-80` 装不下三枚四字标签——取 16n 档 `w-96`（384px）后最宽行恒有余量；`max-w-[calc(100vw-2rem)]`、`max-h-[min(70vh,40rem)]` 可滚动；面板外壳零内边距，内容区 `p-4` 写在滚动视口内的内容容器上；触发器有 `aria-label`/`title`，Escape 关闭。
- 文案随 `lang`（`zh` / `en`）；不持久化自己的状态，全部落在 `useTheme`、`useMotionPreference`、路由与调色板存储。
