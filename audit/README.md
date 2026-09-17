# Audit — Litefy 库级基准与维护工具

针对 **litefy 库本身**的基准测试、回归扫描和一次性维护脚本。不是业务代码的设计检查——那是 `scripts/design-detect.mjs`（`pnpm lint:design`）的职责。

## 基准 / 回归（依赖 harness）

浏览器类脚本先起 harness（共享 Vite server，按真实 aliases + Tailwind 挂载 demos——不带插件时工具类不生成，尺寸/可见性测量全是垃圾值）：

```bash
node audit/harness-server.mjs
node audit/leak-scan.mjs          # 内存泄漏：反复 open/close + mount，强制 GC，堆增长 + 泄漏信号
node audit/sizes.mjs              # 单组件 gzip 体积
node audit/sizes-isolated.mjs     # 隔离构建的单组件体积
node audit/full-bundle.mjs        # 全量打包成本（历史对比基线：results/full-*.json，litefy 全量 ≈58.4K gzip vs antd ≈476K）
node audit/wdyr-scan.mjs          # WhyDidYouRender 重渲染扫描（WDYR 不兼容 React 19，见下）
node audit/commit-probe.mjs       # 可疑 render 次数的 demo 的提交时间线探针
node audit/gutter-probe.mjs       # 布局 gutter / 滚动条探针
node audit/table-atoms.mjs        # Table atoms DOM 结构探针
```

harness 应用本体在 `harness/`（`index.html` + `main.tsx`），demos 路由清单在 `routes.json`。

## 维护 / 一次性脚本

- `codemod-imports.mjs` — 导入路径批量改写
- `copy-registry-dryrun.mjs` — 对目标项目干跑 copy-registry，产物样本在 `registry-dryrun.json`
- `repair-typevalue.mjs` — typevalue 修复
- `scan-docs.mjs` — 文档扫描

## 已知坑

- **WDYR 不兼容 React 19**——wdyr-scan 结果需带此背景解读
- **hydration 完成前的点击会静默丢失**——浏览器脚本先等 hydration 再交互
- **axe 与 HMR 有竞态**——报错重试即可，不是真问题

## 历史

原位于 `.agent/audit/`（含待发布破坏性变更清单），后移出至仓库根 `audit/`。
