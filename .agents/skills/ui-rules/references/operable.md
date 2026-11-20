# 可操作（WCAG 2.1 / 2.2 / 2.4 / 2.5）

1. 键盘全通路：指针能做的动作键盘必须能做，`onClick` 与 `onKeyDown` 成对出现；只挂 pointer 事件的件一律算缺陷
2. 原生激活优先：`<button>` 自带 Enter / Space，不再自己接 keydown；`role="button"` 的非按钮元素必须自己补这两键
3. 无键盘陷阱：模态件内 Tab 循环用 `trap-tab-key`（`dialog`、`drawer` 已接）；非模态浮层禁止锁 Tab
4. 焦点顺序 = DOM 顺序 = 视觉顺序：禁止 `tabIndex` 取正值重排，要改顺序就改 DOM
5. 焦点可见：只在 `focus-visible` 出环；方案不设全局 `:focus-visible` 兜底，每个可聚焦件由皮肤显式挂 `focus-visible:focus-ring`（danger 件挂 `focus-ring-danger`，外壳洪泛 / `focus-within` 自答亦可）——内层件不挂即无环，无需压制，也禁止裸 `outline: none`
6. 危险件换危险环：用 `data-danger` 这类语义属性捕捉，不在皮肤里写死红环颜色
7. 焦点不被遮挡：sticky 头部与工具条不许盖住当前焦点件（`docs-shell.tsx` 的 sticky 头部就是遮挡源）；给可聚焦容器配 `scroll-mt`，滚动后实测焦点件完整可见
8. 命中区下限：可独立点击的目标按 44×44（`var(--height-control)`；2.5.5 Target Size Enhanced，AAA）执行；硬底线 24×24（2.5.8 Target Size Minimum，AA），标准设五类豁免（间距 / 等价控件 / 行内 / 用户代理 / 必要），本库只认行内与等价两条（见 10、11、23），其余三类不作为缩水理由。命中档位的具体取值属尺寸法（`ui/schemes.md` 第 11 条与 skins/button.md），不在本文件答值
9. 行控件整行不小于 44，用 `padding-block: calc((var(--height-control) - 行高) / 2)` 反解，不写死 `height`
10. 画到 44 会毁密度的件（拇指、图标、角标）用伪元素外扩：`content: ""; position: absolute; inset: calc(50% - var(--height-control) / 2)`；相邻目标净间距小于 12px 时外扩互压，此路失效，退回真实尺寸
11. Checkbox / Radio / Switch 的热区由 label 行盒承担，禁止把隐藏 input 放大到 44
12. 按钮命中即盒子（`min-h-control min-w-control`），不设外边距，命中下限照第 8 条核；档位取值走尺寸法（skins/button.md），纯图标钮的热区外扩伪元素读 `--inset-hit`（方案自答）。控件内图标随控件文字（`size-[1em]`），与方案无关，图标不许把盒子撑大
13. 指针手势要有单点替代：双指缩放、长按、描摹轨迹都要给键盘或按钮等价物；`use-drag` 的拖拽必须配方向键移动或上/下移按钮
14. 按下不触发：动作在 `pointerup` 完成；`onPointerDown` 只用于开始拖拽、滑块跟手这类连续件（`slider.tsx`、`drawer.tsx` 属此类）
15. 指针可取消：拖拽、滑块、涂写类动作在指针滑出边界或按 Esc 后要撤回原值，不许把越界当提交
16. 悬停内容三条件：可关闭（Esc 或焦点移开即关）、可悬停（指针能从触发件走到浮层不消失）、持久（移开触发件后留时间再收，`tooltip` 的 `delay = 100` 只满足第三条）；长内容浮层（Popover / PreviewCard）三条全要
17. hover 不许是唯一入口：悬停才出现的件（行内操作、revealed 按钮、仅在 hover 显示的箭头与卡片）必须同时有点击或聚焦的触发路径——触屏没有 hover，`onPointerEnter` 之后那次 `onClick` 也要能完成同一动作；键盘端的等价车道是 `group-focus-visible`，两条都要接，只接一条等于另一半设备没有
18. 内容不因超时消失：倒计时、会话过期要能延长，至少先警告；不许静默丢掉已填内容
19. 滚动锁定克制：模态锁滚由全视口滚动壳承载（Dialog/Drawer 骨架自带，`overscroll-behavior: contain` + ≥1px 可滚区间，见各自蓝图），非模态浮层不许锁页面滚动
20. 绕过重复区块：文档站要有 skip link 指向主区（`docs-shell.tsx` 已接：网格根首子节点 `<a href="#main-content">`，`sr-only focus:not-sr-only` 聚焦浮出，`main` 挂 `id` 与 `tabIndex=-1` 作落点）
21. 单字符快捷键：本库不发单字符键绑定；文档站若发，必须可关闭或重映射，且不聚焦输入框时才生效
22. 键盘交互要写进文档：新增键位同步 `content/docs/**` 的「键盘交互」表，没写的键视为不存在
23. 行内车道豁免：正文链接、Tooltip 触发词、目录 / 面包屑链接不撑高（2.5.8 行内例外）——撑高会把行距撕裂
24. 连体组 / 连体壳内层让位给壳：`min-height: 0` + `align-self: stretch`，内层重复下限会把整条顶高
25. 输入类热区即自身：`min-height: var(--height-field)` 写在带边框的壳上，内容更高自然长高；字段下方状态提示同取该下限，替换描述文字时行节奏不跳
