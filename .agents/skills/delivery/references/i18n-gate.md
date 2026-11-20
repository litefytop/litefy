# 双语门禁（白名单）

1. 中文是唯一正本：只改 `content/docs/**/*.zh.mdx`；英文 `*.mdx` 是翻译产物，不直接改
2. 某组件文档的中文被修改 → 英文需与中文同步
3. 白名单 `content/docs/sync.json` 记录"英文已与中文同步"的 slug（如 `component/button`）
4. 改中文 → 把 slug 移出白名单；英文同步齐 → 加回
5. 新文档默认不登记：中文写完先不登记，英文翻译补齐后才登记
6. `scripts/check-i18n-sync.mjs` 挂 prebuild：白名单外存在 zh 文档、或白名单内缺任一语言文件 → `pnpm build` 失败并列清单；dev 不拦
7. 验收只跑 `node scripts/check-i18n-sync.mjs` 即可（秒级），不必整包 build；build 只在发布前跑
8. 攒批原则：改中文只移出白名单不翻译，发布前一次性把英文同步齐再登记——避免每篇都同步、回退双倍 token
9. 判定纪律（历史欠账 vs 当场修的分流、不回退、逐节核对）见 `batching.md`
