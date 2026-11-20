import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// 硬约束 1：组件文档用法节首个 demo 前只允许一行概括（恰好一个非空段落）。
// 长度限制按语言：中文 ≤ 100 字符，英文 ≤ 200 字符（同等内容英文约为中文两倍）。
// 规则正本：.agents/skills/delivery/references/doc-format.md 第 3 条。
// 中文正本 (*.zh.mdx) 全查；英文 (*.mdx) 只查白名单内（已登记双语同步）的篇目。
// utils 文档暂不门禁：其用法节多为多段说明，属存量欠账，随各自改版收敛。
//
// 硬约束 2：demo 根容器按 references/demo-format.md 容器节组织——
// 根元素为普通 DOM 元素时 className 必须带居中令牌（items-center / justify-center / mx-auto），
// 铺满舞台的根（h-full + w-full）与直接返回组件的 demo 豁免。

const LIMITS = { zh: 100, en: 200 };
const docsDir = join(process.cwd(), "content", "docs");
const whitelist = JSON.parse(readFileSync(join(docsDir, "sync.json"), "utf8")).synced;
const demosDir = join(process.cwd(), "app", "demos");

const failures = [];

function paragraphs(text, lang) {
  const lines = text.split("\n").map((l) => l.replace(/\r$/u, ""));
  const heading = lang === "zh" ? "## 用法" : "## Usage";
  const collected = [];
  let inUsage = false;
  for (const line of lines) {
    if (line.startsWith(heading)) {
      inUsage = true;
      continue;
    }
    if (inUsage && line.startsWith("## ")) break;
    if (inUsage && line.startsWith("### ")) break;
    if (inUsage && line.startsWith("<ComponentPreview")) break;
    if (inUsage && line.trim() && !line.startsWith("<") && !line.startsWith("|")) {
      collected.push(line);
    }
  }
  return collected;
}

function check(file, lang) {
  const text = readFileSync(file, "utf8");
  const paras = paragraphs(text, lang);
  if (paras.length === 0) return;
  const total = [...paras.join("")].length;
  const limit = LIMITS[lang];
  if (paras.length > 1 || total > limit) {
    failures.push(
      `${file}：首个 demo 前 ${paras.length} 段共 ${total} 字（限一段 ≤ ${limit} 字）——demo 已表达的观感与交互不进正文，机制细节归 API 表格`,
    );
  }
}

for (const f of readdirSync(join(docsDir, "component"))) {
  if (f.endsWith(".zh.mdx")) check(join(docsDir, "component", f), "zh");
  else if (f.endsWith(".mdx") && whitelist.includes(`component/${f.replace(/\.mdx$/u, "")}`)) {
    check(join(docsDir, "component", f), "en");
  }
}

// demo 根容器居中检查
for (const dir of readdirSync(demosDir)) {
  for (const f of readdirSync(join(demosDir, dir))) {
    if (!f.endsWith(".tsx")) continue;
    const file = join(demosDir, dir, f);
    const text = readFileSync(file, "utf8");
    const start = text.lastIndexOf("return (");
    const match = /<([A-Za-z][A-Za-z0-9]*)\b/u.exec(text.slice(start));
    if (!match) continue;
    const [, tag] = match;
    if (/^[A-Z]/u.test(tag)) continue;
    const openTag = /^<[^>]*>/u.exec(text.slice(start + match.index))?.[0] ?? "";
    const className = /className="([^"]*)"/u.exec(openTag)?.[1] ?? "";
    if (/h-full/u.test(className) && /w-full/u.test(className)) continue;
    if (/(items-center|justify-center|justify-items-center)/u.test(className)) continue;
    if ((!/w-full/u.test(className) || /max-w-/u.test(className)) && /mx-auto/u.test(className)) continue;
    failures.push(
      `${file}：demo 根容器缺少居中令牌（items-center / justify-center；撑满舞台的 w-full 根 mx-auto 无效）——demo-format.md 容器节`,
    );
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  console.error(`\n✗ 文档格式门禁：${failures.length} 处违规`);
  process.exit(1);
}
console.log("✓ 文档格式门禁：用法节一行概括与 demo 居中全部合规");
