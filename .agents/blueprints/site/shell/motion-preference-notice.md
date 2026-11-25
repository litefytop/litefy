# 动画偏好提示（app/components/motion-preference-notice.tsx）

- 复用公开 `useMotionPreference()`；有效值为 `reduce` 时在文档页顶部显示整条横幅，不弹窗、不修改系统偏好；应用动效设为完整时即使系统要求减少也不显示。
- 由 `DocsShell` 挂在共享 topbar 网格区（`grid-area: topbar`），进入文档流——出现与关闭只改变自动行高；横幅显示时通过 `onVisibilityChange` 通知壳层隐藏浮动 topbar，当前业务按互斥组合；无 JS 测高或高度变量。
- 模态打开期间整条隐藏：横幅监听任意 `dialog[open]`（MutationObserver），存在即挂 `data-modal-open` 并转 `visibility: hidden`（盒子保留、行高不变）——横幅绝不与模态同屏、绝不透出其后文字，模态关闭立即恢复，内容不跳。
- 层级：横幅在文档流内，不再参与 fixed 叠层竞争；所有对话框（原生 `<dialog>` showModal）与弹层（原生 popover）走 top layer，恒在横幅之上。
- 左侧内容区与壳层同宽（全宽、同水平内边距，无页面域最大宽度）；右侧关闭按钮保持整高，命中区不小于 44×44。
- 文案区分来源：应用内设为减少时说按应用内动效设置暂停，跟随系统且系统要求减少时说按系统设置暂停；链接当前皮肤前缀下的 `motion` 纯文档页。
- 右侧关闭按钮卸载横幅，共享行让位给浮动 topbar；两者都无内容时网格行塌缩归零；`motion` 纯文档页自身不显示。
- 关闭状态按标签页会话记录（`sessionStorage`），同一会话内导航或重载不再出现；关闭只影响提示，不改变应用或系统偏好。
- 目标语言页面存在时链当前语言；否则链中文正本并在链接文字标明中文。
- 横幅铺 `bg-surface`，根与内容继承 `text-surface-fg`；关闭钮复用 text 按钮时显式覆盖为 `text-surface-fg`，不让按钮默认 `foreground` 落在霓虹表面渐变上。
