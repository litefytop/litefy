# MeterGroup 皮肤（app/ui/skins/metergroup.tsx）

- 定位：分组占比条（PrimeVue MeterGroup 形态参考），横向单形态。
- 结构：根 `flex w-full flex-col gap-2`；轨道（`[data-track]`）`h-2 w-full rounded-pill flex` + `bg-surface`（与全库轨道族同源，见 schemes.md 规则 9）——**不设 overflow-hidden**（hover 提示要逃出轨道），段端圆角由皮肤按位置答：首段 `rounded-l-pill`、末段 `rounded-r-pill`（中段直角相连，末段圆角即填充收尾——Progress 填充先例）；段 `h-full` + inline 背景（色板 hook 按序答，色板即语义同款 300 / 200 档、段间色相天然错开；段色对 surface 亮档不足 3:1 是既接受项——量具类不强制 1:3，用户定则）+ 宽度过渡 `duration-md`；hover 提示：段 `relative` + `::after`（`attr(data-tip)` 内容、`bg-surface-raised` + `border-frame border-border` + `text-xs text-foreground`、轨道上方居中、`opacity-0` → 段 hover `opacity-100`）——信息与图例同源，不依赖 hover。
- 图例：`flex flex-wrap gap-x-4 gap-y-1 text-xs text-surface-fg`，每项 `inline-flex items-center gap-1`（色点 `size-1.5 rounded-pill`，inline 背景与对应段同色 + `label` + 百分比 `font-label tracking-label`）。
- 颜色通道：段色全部来自色板 hook（运行期色值 inline 发布，外观通道的已注明例外），消费者显式 `color` 时骨架直通 inline、皮肤不干预。
- 专属令牌：无。
