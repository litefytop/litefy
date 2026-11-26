# Password 皮肤（app/ui/skins/password.tsx）

1. 壳：共享字段框（Input 的 `fieldGroupClasses`）+ `relative`——浮动提示的常驻锚点（此组合必有开关，无需条件判断）。
2. 内层输入：字段输入串 + `appearance-none peer`——原生 reveal 消音，提示靠 `peer-focus-visible` 显形。
3. 显隐开关：`rounded-sm` 图标钮 + `px-3` 呼吸 + `foreground`，可见盒 44×44（`size-11 -my-px`，出血到字段壳外缘而不撑高壳），图标居中；hover 吃 `accent` 背景档（并写它的配对前景 `accent-fg`），禁用由壳级独立禁用类串承担，开关继承禁用颜色与 `cursor-not-allowed`，动作由原生 disabled 阻断；一字段一指针目标，可见盒即命中盒，不再依赖伪元素外扩。
4. 开关图标：`size-4` 默认图标档。
5. 浮动提示：定位壳 + 键帽两层——壳只答定位与显隐（`absolute -top-7 right-0 z-10`，整条默认隐藏，仅细指针且非窄屏（`pointer-fine:min-sm`）恢复 `flex` 显形，粗指针与窄屏完全不出现，桌面随输入框聚焦 opacity 显形），不带气泡面；键帽经 `hintKey` 槽引共享 `kbd` 类（`schemes/kbd.md` 律：界面展示键盘按键一律 `kbd`，禁手搓键帽；FilterCombobox `hintKey` 先例）。
6. 组合导出：`passwordShellClasses` / `passwordPartClasses` 供 FormItem 装配。
7. 专属令牌：无。
