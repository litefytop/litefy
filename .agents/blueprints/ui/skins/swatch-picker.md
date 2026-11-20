# SwatchPicker 皮肤（app/ui/skins/swatch-picker.tsx）

1. 二次封装：骨架复用 `SegmentGroup`（不另立骨架文件）——radiogroup 语义、roving 方向键、受控/非受控全部继承；导出一个成品 `SwatchPicker`。
2. 选项通道：消费方传 `{ value, label, color, disabled }`（`color` 为 CSS 颜色字面值，运行期数据）；皮肤映射为 Segment 选项——`style` 携带内联 `--swatch-color`，并以内联覆盖 `--shadow-checked` 注入同色外环（运行期值必须内联的例外——嵌套 `var()` 在声明元素作用域解析，元素级换环色只能覆盖令牌本身），`label` 保留为无障碍名、经 `text-transparent` 隐去字形。
3. 色样：24px 色块（`size-6`）+ `rounded-md` 方圆角档（方案圆角命名空间自答——固定色方案转直角，不在皮肤写死 `rounded-pill`），填充读 `--swatch-color`，发丝描边防浅色融底；间距用外边距（`m-1`），组换行流式。
4. 选中：共享 `shadow-checked` 双层环（画布色间隙 + 环色外环），与 Checkbox / Radio 的选中光环同一角色（见 `ui/schemes.md` 第 9 条），环色经上述内联覆盖为色样同色；`aria-checked` 变体挂接——Segment 骨架发 `aria-checked` 不发 data-*。
5. 无 hover 态——色样填充即状态本身，选中环是唯一强调反馈，悬停不升档阴影、不做位移（位移类 hover 会把色样移出停在边缘的指针反复抖动，位移只留给按压）；禁用 50% 折显（原生 `disabled` 变体）；焦点环显式挂 `focus-visible:focus-ring`。
6. 专属令牌：无——颜色全部来自运行期数据。
（neo 阴影）承载面挂 shadow-frame——可交互件必有阴影（neo design.md 阴影律），minimal 无此工具类不渲染、零回归。
