# Wizard 骨架（app/ui/components/wizard.tsx）

- 职责：分步向导：Steps 指示 + Pager 步内容 + 前进/后退脚注，另含竖向内联向导与导航 hook。

## 行为 / 状态

- 导出 `Wizard`、`InlineWizard` 与 `useWizardNavigation({ count, defaultIndex = 0, index?, maxIndex?, onIndexChange? })`；返回 `index`、`maxVisited`、`maxReachable = min(maxIndex ?? count − 1, count − 1)`、`isFirst`、`isLast`、`isReachable(target)`、`go(next)`
- `go`：clamp 到 `[0, count − 1]`，超出 `maxReachable` 直接忽略；`index` 双模（非受控才写内部值），只推进 `maxVisited`，始终回调 `onIndexChange`
- `Wizard`：`Steps`（`index` 受控、`maxIndex = maxVisited` 使已访问步可点；`orientation` 不传——随容器宽度自动横竖）+ `Pager`（`transition="slide"`、`gesture={false}`，高度由 `classNames.pager` 定，`children` 与 `steps` 按位置对应）+ footer 两个 Button
- `Wizard` 自身 index 不受控（不暴露 index / onIndexChange），从 0 起；默认标签 Next / Back / Submit，首步 Back 禁用，末步渲染 Submit 并回调 `onFinish`，其余步 Next 前进；`stepsClassNames` / `stepsStyles` 直通 Steps
- `InlineWizard`：竖向 `Steps`，仅当前步渲染 content + footer；首步无 Back，末步 Submit（`onFinish` 存在时追加 Check 图标），前进按钮带 ChevronRight；默认标签 Continue / Back / Finish
- `InlineWizard` 的 index 双模，`disabled` 时按钮与步骤点击都不导航
- 槽位：`Wizard` 为 `classNames.steps/pager/footer/button/primaryButton`；`InlineWizard` 为 `StepsClassNames` + `content/footer/button/primaryButton` 与 `styles.content`
