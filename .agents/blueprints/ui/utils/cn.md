# cn / mergeSlots class 合并（app/ui/utils/cn.ts）

1. 职责：一个文件共同导出两个 class 合并工具——`cn`（单元素 class 冲突消解，基于 `cn/config` 注册全库 `@theme` 刻度与 classGroups）与 `mergeSlots`（槽位映射合并：逐键跑 `cn`、键取并集、丢弃空槽）。
2. 落位：`app/ui/utils/` 只放 `.ts` 工具，`app/ui/skins/` 只放 `.tsx` 组件皮肤；两个工具无注释。
3. 消费方：skins 组件经 `../utils/cn` 引入；`utils/index.ts` 桶导出；`skins/index.ts` 继续 re-export `cn`（`@/ui/skins` 的对外 API 不变，消费方为 demo 与 showcase）。
