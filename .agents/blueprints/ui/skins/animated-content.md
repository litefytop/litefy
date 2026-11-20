# AnimatedContent 皮肤（app/ui/skins/animated-content.tsx）

1. 根（消费者 `className` 通道）：纯过渡容器，不加盒模型、背景色、文字色与定位类；观感全由 children 自带。
2. 过渡束：`transition-[translate,opacity] ease-frame duration-lg`（Tailwind v4 的 `translate-*` 工具类发 `translate` 属性而非 `transform`，过渡属性必须点名 `translate` 位移才参与过渡），时长档经 `data-duration` 分支——`data-[duration=sm]:duration-sm`、`data-[duration=md]:duration-md`（`lg` 即缺省档）；时长与缓动全走令牌，减动效由令牌清零与骨架判读双路兜底。
3. 隐藏态：`data-[state=out]:opacity-0`；位移按 `data-direction` 四分支读骨架内联的 `--animated-content-distance`——`up` 答 `translate-y-(…)`、`down` 答 `-translate-y-(…)`、`left` 答 `translate-x-(…)`、`right` 答 `-translate-x-(…)`（方向语义为入场运动方向，隐藏态停在反方向起点）。
4. 无状态分支外观：静置即终态，`data-state` 只作过渡钩子；非可聚焦件，不挂焦点环；静态内容不挂 hover。
5. 专属令牌：无。