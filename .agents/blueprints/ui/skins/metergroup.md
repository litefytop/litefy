# MeterGroup 皮肤（app/ui/skins/metergroup.tsx）

- 定位：分组占比条（PrimeVue MeterGroup 形态参考），横向单形态。
- 构建：四层律（blueprint.md 第 8 条）——原子皮肤逐节点出类常量，组合皮肤组装并承担根容器；禁从根用后代选择器给骨架自有节点定样式。
- 导出 `metergroupPartClasses`（原子皮肤）与封装组件 `MeterGroup`（组合皮肤，`mergeSlots` 把原子皮肤逐槽并入骨架 classNames 槽）：

1. 根（组合皮肤）：`flex w-full flex-col gap-2`
2. `track`：`flex h-2 w-full rounded-pill bg-well`——井底档（轨道族同挂井底，见 schemes.md 规则 9）；不设 overflow-hidden（hover 提示要逃出轨道），段端圆角由段按位置答
3. `segment`：`group/meter relative h-full transition-[width] duration-md ease-out` + 端角 `first-of-type:rounded-l-pill` / `last-of-type:rounded-r-pill`（中段直角相连，末段圆角即填充收尾——Progress 填充先例）；`tip` 是段内独立提示 span，使用 `pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap rounded-md border-frame border-border bg-surface-raised px-2 py-0.5 text-xs text-foreground`，`opacity-0` → `group-hover/meter:opacity-100`，`transition-opacity duration-sm`
4. `legend`：`flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground`
5. `legendItem`：`inline-flex items-center gap-1`
6. `swatch`：`size-1.5 rounded-pill`
7. `percent`：`font-label tracking-label`；`label` span 无样式，不出常量
8. 颜色通道：段色与色点全部 inline（运行期色值，外观通道例外已注明），皮肤不干预；段色保持纯色——色值与图表共用一套 palette，图表填充不接渐变，故本件不接 `--fill-*` 填充契约（用户定 2026-11-22）
9. 专属令牌：无
