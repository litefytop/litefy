// 双语同步闸门（prebuild 最后一步）：
// content/docs/sync.json 白名单记录"中英已同步"的 slug。
// 白名单外存在 *.zh.mdx 文档 → fail；白名单内缺任一语言文件 → fail。
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const root = "content/docs";

function listZhDocs(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listZhDocs(p));
    else if (entry.name.endsWith(".zh.mdx"))
      out.push(relative(root, p).replaceAll("\\", "/").slice(0, -".zh.mdx".length));
  }
  return out;
}

const zhSlugs = listZhDocs(root);
const { synced } = JSON.parse(readFileSync(join(root, "sync.json"), "utf8").replace(/^\uFEFF/u, ""));
const whitelist = new Set(synced);

const unsynced = zhSlugs.filter((slug) => !whitelist.has(slug));
const stale = synced.filter(
  (slug) =>
    !existsSync(join(root, `${slug}.zh.mdx`)) || !existsSync(join(root, `${slug}.mdx`)),
);

if (unsynced.length || stale.length) {
  for (const slug of unsynced)
    console.error(`✗ 未同步双语: ${slug} — 补齐另一语言后登记进 content/docs/sync.json`);
  for (const slug of stale)
    console.error(`✗ 白名单残留: ${slug} — 文件缺失或已删除，从 sync.json 移除`);
  process.exit(1);
}
console.log(`i18n sync ok: ${zhSlugs.length} docs all synced`);
