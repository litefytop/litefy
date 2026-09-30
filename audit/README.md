# Audit — Litefy 库级基准与维护工具

针对 **litefy 库本身**的基准测试、回归扫描和审计报告。不是业务代码的设计检查——那是 `pnpm lint:design`（`.agents/skills/litefy-design/scripts/design-detect.mjs`）的职责。

## Quality & Benchmarks

Browser-based regression tooling that guards the component library itself:

- **`leak-scan.mjs`** — memory-leak regression. Each demo is cycled (click / Escape / outside-mousedown, up to 1000 iterations for overlay-heavy components) inside a fresh browser context, then GC is forced and three signals are sampled: two-segment JS heap growth (separates warmup plateau from linear leak), detached DOM tracked via WeakRefs, and live ResizeObserver / MutationObserver counts plus net event-listener drift. A FinalizationRegistry canary tells real retention apart from pending WeakRef cleanup before any leak verdict is issued.
- **`scan-docs.mjs`** — route-level axe-core accessibility + longtask scan of the docs site, driven by `routes.json`.
- **`sizes.mjs` / `sizes-isolated.mjs`** — per-component bundle size (gzip), app-bundled vs isolated build.
- **`full-bundle.mjs`** — whole-library bundle cost as a historical baseline (litefy ≈ 58.4K gzip vs antd ≈ 476K).

Usage: start the shared harness server first, then run any scanner.

```bash
node audit/harness-server.mjs
node audit/leak-scan.mjs [component ...]
```

Internal audit reports (`demo-audit.md`, `source-audit-parts/`) are working notes and intentionally excluded from the public repo.

## Demo 审计报告

- `demo-audit.md` — 全量 demo 审计报告（182 个 demo 逐组件核对 + HeroUI 化粒度定案），行动项均已执行，留档备查

## 基准 / 回归（依赖 harness）

浏览器类脚本先起 harness（共享 Vite server，按真实 aliases + Tailwind 挂载 demos——不带插件时工具类不生成，尺寸/可见性测量全是垃圾值）：

```bash
node audit/harness-server.mjs
node audit/leak-scan.mjs          # 内存泄漏：反复 open/close + mount，强制 GC，堆增长 + 泄漏信号
node audit/sizes.mjs              # 单组件 gzip 体积
node audit/sizes-isolated.mjs     # 隔离构建的单组件体积
node audit/full-bundle.mjs        # 全量打包成本（历史对比基线：results/full-*.json，litefy 全量 ≈58.4K gzip vs antd ≈476K）
```

harness 应用本体在 `harness/`（`index.html` + `main.tsx`），demos 路由清单在 `routes.json`（`scan-docs.mjs` 消费）。

## 文档站扫描

- `scan-docs.mjs` — 文档站路由级 axe 无障碍 + longtask 扫描（BASE 为本地 dev server，routes.json 驱动）

## 已知坑

- **hydration 完成前的点击会静默丢失**——浏览器脚本先等 hydration 再交互
- **axe 与 HMR 有竞态**——报错重试即可，不是真问题

## 历史

原位于 `.agent/audit/`（含待发布破坏性变更清单），后移出至仓库根 `audit/`。已清理：一次性调查探针（table-atoms / commit-probe / gutter-probe，硬编码旧 `.agent/audit` 路径）、wdyr-scan（WDYR 不兼容 React 19）、已执行完毕的 codemod（codemod-imports / repair-typevalue / copy-registry-dryrun）。
