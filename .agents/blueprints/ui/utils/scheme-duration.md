# scheme-duration 时长读取（app/ui/utils/scheme-duration.ts）

1. 职责：把方案令牌的实际计算值读成毫秒数，供骨架做动画时序判定；唯二导出皆纯读、零写入。
2. `getSchemeDurationMs(el, token)`：读元素上的自定义属性计算值，`ms` / `s` 自适应换算，解析失败回 0。
3. `getTransitionDurationMs(el)`：读 `transitionDuration` 逗号列表取最大值，失败回 0。
4. 不在 utils 桶导出（骨架内部件，非公开 API）。
5. 消费方：Drawer（关壳动画延时）、Toast（退场动画时长）、Pager（滑动时长，兜底 200ms）。
