import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

// 硬约束：蓝图中提到的组件导出必须与骨架源码同步。
// 对 .agents/blueprints/ui/components/ 下的每份蓝图：
//   1. 源码文件 app/ui/components/<name>.tsx 必须存在；
//   2. 源码的每一个大写导出（组件/常量）都必须在蓝图正文中被点名。
// 没有蓝图的历史组件不在约束范围（补蓝图后自动纳入）。

const componentDir = join(process.cwd(), "app", "ui", "components");
const blueprintDir = join(process.cwd(), ".agents", "blueprints", "ui", "components");

const failures = [];
const report = [];

for (const file of readdirSync(componentDir).filter((f) => f.endsWith(".tsx"))) {
  const name = file.replace(/\.tsx$/u, "");
  const blueprintPath = join(blueprintDir, `${name}.md`);
  if (!existsSync(blueprintPath)) continue;
  const source = readFileSync(join(componentDir, file), "utf8");
  const blueprint = readFileSync(blueprintPath, "utf8");

  const names = new Set();
  for (const match of source.matchAll(/export (?:function|const) ([A-Z][A-Za-z0-9]+)/gu)) {
    names.add(match[1]);
  }
  for (const match of source.matchAll(/export \{ ([^}]+) \}/gu)) {
    for (const raw of match[1].split(",")) {
      const exportName = raw.trim().split(/\s+as\s+/u)[0];
      if (/^[A-Z]/u.test(exportName)) names.add(exportName);
    }
  }

  const missing = [...names].filter((n) => !blueprint.includes(n));
  report.push(`${name}: 导出 ${names.size} 项,蓝图点名 ${names.size - missing.length} 项`);
  if (missing.length) failures.push(`${name}.tsx 的蓝图缺少: ${missing.join(", ")}`);
}

console.log(report.join("\n"));
if (failures.length) {
  console.error("\n✗ 蓝图与源码不同步:\n" + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log("✓ 蓝图与源码同步");
