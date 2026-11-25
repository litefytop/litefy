# cn / mergeSlots class 合并（app/ui/utils/cn.ts）

1. 职责：一个文件共同导出 class 合并工具——`cn`（单元素 class 冲突消解，基于 `cn/config` 注册全库 `@theme` 刻度与 classGroups）、`mergeSlots`（静态槽位映射合并：逐键跑 `cn`、键取并集、丢弃空槽）、`mergeStateSlots`（保留逐项状态类串函数的槽位合并）与 `resolveSlotClassName`（按 `disabled` / `highlighted` / `active` / `outsideMonth` 状态解析槽位类串）。逐项禁用组件的槽位允许 `string | ((state) => string)`；皮肤在禁用状态直接返回完整禁用类串，不叠加正常 hover / active / outsideMonth 类，字符串覆盖仍按 `cn` 合并。
2. 落位：`app/ui/utils/` 只放 `.ts` 工具，`app/ui/skins/` 只放 `.tsx` 组件皮肤；两个工具无注释。
3. 消费方：skins 组件经 `../utils/cn` 引入；`utils/index.ts` 桶导出；`skins/index.ts` 继续 re-export `cn`（`@/ui/skins` 的对外 API 不变，消费方为 demo 与 showcase）。
