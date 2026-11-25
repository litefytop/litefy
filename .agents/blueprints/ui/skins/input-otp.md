# InputOtp 皮肤（app/ui/skins/input-otp.tsx）

1. 组：一排单字符输入，`flex w-full items-center justify-center` + `gap-x-2`；`w-full` 让组在窄容器（移动端）里随父收缩不超宽，`justify-center` 在宽容器把顶到 44px 上限的格子组居中（窄容器收缩填满时无剩余空间，不受影响）。
2. 槽位：与 Input 字段同框——高 `h-control` 恒 44px、宽目标 `max-w-[var(--width-control)]`（44px）+ `flex-1 min-w-0`（容器足够时每格 44px 方格，不足时按份均分收缩，高度不变）、`rounded-md` 圆角、`border-hair` 描边、底色方案自答 + `shadow-frame` 浮起，`text-label` + 最重字重、居中，`motion-frame` 过渡束。
3. 焦点：槽自带读法（边 + 底 + 文字色 + 影一起换，方案自答）——一边答描边 + 阴影、一边答整格换底色；不挂 focus-ring。
4. 无效态：`aria-invalid` 逐槽由骨架发——边与危险环挂 `field-invalid` 角色类（aria hook 纳入，定义见 `ui/schemes.md` 第 9 条），文字转 `danger` 单轴自挂。
5. 禁用观感：槽按 `disabled` 选择独立禁用类串，使用禁用色与 `cursor-not-allowed`，不挂 hover / active。
6. 专属令牌：无——焦点与无效读法为共享字段档。
