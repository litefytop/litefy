# 性能审计 + QueryBuilder 改版 — 进度存档

> 更新时间：2026-09-13 晚（暂停点）。晚上继续时从「未完成」小节接着做。

## 一、已完成并有结论的部分（无需重做）

### 维度① 渲染性能（wdyr-scan.mjs）✅
- 最终数据：69 demo，65 个挂载恰好 1 次提交；4 个测量类组件挂载 2~3 次
  （chip-group=2、toast=2、masonry=3、scroll-shadow=3），均在"测量类允许多一两次"门槛内。
- WDYL 不必要重渲染警告：0。
- **已修复**：`app/ui/components/masonry.tsx` 挂载 4 次提交 → 批处理化（measureRef 模式，
  宽度+分配一次 layout effect 批处理，ResizeObserver 常驻一次订阅）。
- 结果 JSON：`results/wdyr.json`（新基线）。

### 维度② 运行时（scan-docs.mjs）✅
- 68 路由全部覆盖（0 跳过），234 次真实交互：Long Task(>50ms) = 0，axe 违规 = 0。
- **已修复脚本**：加了导航重试（dev server 按需编译会 ERR_ABORTED）；
  交互计时口径修正（click 不再把后面的 waitForTimeout(140/160) 计入）。
- 结果：`results/docs-summary.json` + `results/docs-*.json`（新基线）。

### 维度③ 体积 ✅
- **重要结论（用户口径更正）**：uplot / react-querybuilder 是历史依赖（70bbc50 引入，
  c8ef20f/350ee8e 移除），现已无 import、不在任何 package.json。旧基线 59.7K external
  掉了这两个大依赖（低估旧真实体积），当前 61.78K gzip 是纯自研真实体积——**实际大幅缩小**。
- 单组件隔离体积：69 个 0 错误，最重 query-builder 19.3K / chart 15.3K gzip
  （`results/sizes-isolated.json`，首次落盘的组件级基线）。
- 依赖闭包：仅 tailwind-merge 一个 npm 依赖，无意外拖拽。
- **脚本**：三个测量脚本（sizes.mjs / sizes-isolated.mjs / full-bundle.mjs）已删除
  失效的 uplot/rqb external，今后误引入重依赖会被体积指标捕获。
- **新增** `full-bundle.mjs`（补回缺失的 compare/full-bundle.mjs），
  输出 icons-external 61.78K / batteries 63.50K 两个口径。

### QueryBuilder 树形列表改版 ✅
- `app/ui/components/query-builder.tsx`：字段行末尾 `+`、规则行 `├/└` 引导线
  （纯 border 绘制，TreeGuide 组件）+ 行末删除键、无子项不渲染、select 选项常驻
  子行（All + 选项，勾选即增删，保持单条 IN 合并）、嵌套 and/or 组保留。
- API / QueryGroup 数据模型不变。tsc 无错误。截图验证过布局与查询输出
  （D:/tmp/qb-initial.png、qb-filled.png、qb-rules.png）。
- 文档已同步：content/docs/component/query-builder.mdx + .zh.mdx + AGENTS.md。
- commit-probe：挂载 1 次提交，健康。

### 其他修复（同批未提交改动里）
- `packages/cli` uninstall 残留目录问题（更早会话）：utils/barrel.ts 抽出
  UI_BARREL_INDEX_SOURCE 常量；uninstall.ts 清理顶层 barrel + ui/litefy 整体删除
  （ui/litefy 形状守卫 + 残留文件二次确认默认 No + 空目录向上回收不越 cwd）。
- `.agent/audit/` 6 个脚本硬编码旧路径 `D:/Documents/code/...` → import.meta 推导。

## 二、未完成：维度④ 内存/泄漏（leak-scan.mjs）——卡在一个测量悖论上

### 现状
- `leak-scan.mjs` 已写好并跑完全量：69 demo，8 个被标记
  （calendar、date-picker、pager、progress、query-builder、steps、toast、wizard）。
- 信号体系：强制 GC 后堆分段采样（区分预热/线性）、detached DOM（createElement 全量
  WeakRef 注册）、RO/MO 实例净增、事件监听器净增。已加导航重试、双次 GC、
  泄漏节点签名诊断（flagged 时自动存 leakedNodes 到 results/leak-*.json）。

### 核心悖论（接手者从这里开始）
- **leak-scan 进程里**：calendar（200 iters，注意 calendar 不在 RISK 集合，只跑 200 次）
  refs1=1301，detached1=1274 —— 几乎所有创建过的元素（每个代际的日历格子/网格子树）
  在多次 full GC 后依然存活。泄漏签名：button.inline-flex.h-8 ×1046（日历格）、
  div.grid.* 月/年网格碎片。date-picker/query-builder/toast/wizard 同样模式
  （qb 还有 listeners +1256 漂移；wizard +690 detached +160 listeners 完全确定性复现）。
- **三个独立脚本**（leak-probe.mjs、leak-probe2.mjs、gc-test.mjs，与 scan 逐行等价的
  初始化/循环/采样）跑同样 demo 同样迭代数：detached 恒为 1，GC 后全部收集干净。
- 已排除：GC 次数不够（双次 GC 无效）；迭代数差异（200 vs 1000 都测过）；
  迭代内 outsideDown/Escape 顺序（已对齐）；脚本逻辑差异（机械 diff 过，只有排版差异）；
  组件代码（calendar.tsx 无缓存无 observer 无监听器，干净）；
  vite reload 污染（refs1 相同证明没有跨文档重置）。
- **下一步建议**（按性价比排序）：
  1. 最省事：接受"scan 进程环境伪影"结论——用独立进程逐 demo 测量（每 demo 新开
     browser context 或新进程，probe2 模式），把 leak-scan 改成 per-demo 隔离模式重跑
     全量，以隔离模式的结果为准出报告。改动小：把现有循环体包进 per-demo fresh context。
  2. 若想深挖 scan 伪影根因：怀疑方向是长寿命 page + CDP session 下 V8 的
     WeakRef/epione 清理调度差异，或 playwright 页面级引用（page 对象缓存 evaluate
     结果？）。可用 CDP HeapProfiler.takeHeapSnapshot 抓 scan 进程里的快照，
     解析 .heapsnapshot 找 detached button 的 retainer 链（格式可解析）。
  3. toast（+95~555，随采样波动）和 wizard（+690 确定性）值得在隔离模式下复查，
     若隔离模式下仍复现才是真泄漏；wizard 疑点在 Pager/Steps 组合（单独 pager/steps
     基本干净），.listeners +160 指向某处 addEventListener 没清。
- 临时脚本（确认无泄漏后可删）：leak-probe.mjs、leak-probe2.mjs、gc-test.mjs。

## 三、环境备注
- audit 依赖已装：`.agent/audit/node_modules`（playwright/axe/wdyr，npm install）。
- 浏览器走系统 Edge：`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`。
- harness：`harness-server.mjs`（共享 Vite 配置，**必须带 @tailwindcss/vite 插件**，
  否则工具类不生成、测量全废——skeleton 误报的根因）。
- 端口约定：wdyr-scan 5188、leak-scan 5193、commit-probe 5190、探针 5194-5196。
- 已确认无残留监听进程（5199 docs server 已杀）。

## 四、未提交改动清单（全部在工作区，未 commit）
- packages/cli/src/commands/uninstall.ts、packages/cli/src/utils/barrel.ts、
  packages/cli/src/commands/init.ts（CLI uninstall 修复）
- app/ui/components/masonry.tsx（渲染修复）、app/ui/components/query-builder.tsx（改版）
- content/docs/component/query-builder.mdx、.zh.mdx、AGENTS.md
- .agent/audit/：脚本修复+新增（harness-server/commit-probe/full-bundle/leak-scan）+
  results/ 基线刷新 + stubs/ 生成物
- 用户尚未要求 commit；之前会话提过"需要的话我来 commit"，继续时先问一句。
