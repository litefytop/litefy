#!/usr/bin/env node
// app/ui 下 class 串长度检查（>200 警告）+ cn 嵌套检查；报告打 stdout。
// 计量口径：两类单元——cn() 调用、类串常量定义（对象字面量按成员拆）——只数单元内直接书写的
// 类串字面量；被引用的常量在定义处计量一次，引用点记「未计入项」，不重复计数。
// 静态解析：字符串/注释挖空；三元与 || 两侧都算（静态上界），&& 只算末段，+ 按 JS 串接。
// 未知函数调用、动态键访问、模板插值的单元记 SKIP。
import fs from "node:fs";
import path from "node:path";

const SCAN_DIR = "app/ui";
const SKIP_FILES = new Set(["app/ui/utils/cn.ts"]);
const EXT = new Set([".ts", ".tsx"]);
const THRESHOLD = 200;
const KEYWORDS = new Set(["as", "satisfies", "typeof", "void", "new", "await", "yield"]);

// ---------- 结构扫描：字符串/注释挖空，记录字符串原始内容 ----------
function scanStructure(src) {
  const out = src.split("");
  const strings = [];
  const blank = (i, j) => {
    for (let k = i; k < j && k < out.length; k++) out[k] = " ";
  };
  let i = 0;
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (c === "/" && n === "/") {
      const j = src.indexOf("\n", i);
      blank(i, j === -1 ? src.length : j);
      i = j === -1 ? src.length : j;
    } else if (c === "/" && n === "*") {
      const j = src.indexOf("*/", i + 2);
      const end = j === -1 ? src.length : j + 2;
      blank(i, end);
      i = end;
    } else if (c === '"' || c === "'" || c === "`") {
      const q = c, start = i;
      out[i] = " "; i++;
      while (i < src.length) {
        if (src[i] === "\\") { out[i] = out[i + 1] = " "; i += 2; continue; }
        if (q === "`" && src[i] === "$" && src[i + 1] === "{") {
          out[i] = out[i + 1] = " "; i += 2;
          let depth = 1;
          while (i < src.length && depth > 0) {
            const cc = src[i];
            if (cc === "{") depth++;
            else if (cc === "}") { depth--; if (depth === 0) break; }
            else if (cc === '"' || cc === "'" || cc === "`") {
              const q2 = cc;
              out[i] = " "; i++;
              while (i < src.length && src[i] !== q2) {
                if (src[i] === "\\") i++;
                out[i] = " "; i++;
              }
              out[i] = " "; i++;
              continue;
            }
            i++;
          }
          out[i] = " "; i++;
          continue;
        }
        if (src[i] === q) { out[i] = " "; i++; break; }
        out[i] = " "; i++;
      }
      strings.push({ start, end: i - 1, quote: q, raw: src.slice(start + 1, i - 1) });
    } else i++;
  }
  return { code: out.join(""), strings };
}

function stringAt(strings, pos) {
  let lo = 0, hi = strings.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (strings[mid].start === pos) return strings[mid];
    if (strings[mid].start < pos) lo = mid + 1; else hi = mid - 1;
  }
  return null;
}

function matchBracket(code, openPos) {
  const open = code[openPos];
  if (!"([{".includes(open)) return -1;
  let depth = 0;
  for (let i = openPos; i < code.length; i++) {
    const c = code[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

// 表达式终点：深度 0 的 `;`，或 ASI 换行（下一行以语句关键字开头）
function stmtEnd(code, from) {
  let depth = 0;
  for (let i = from; i < code.length; i++) {
    const c = code[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0 && c === ";") return i;
    else if (depth === 0 && c === "\n") {
      const rest = code.slice(i + 1).replace(/^\s+/, "");
      if (/^(?:export\s+)?(?:const|let|var|function|return|import|type|interface|enum|class)\b/.test(rest)) return i;
    }
  }
  return code.length;
}

// 顶层分隔切分（深度 0 处按 sep 切）
function splitTop(code, s, e, sep) {
  const parts = [];
  let depth = 0, last = s;
  for (let i = s; i < e; i++) {
    const c = code[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0 && c === sep) { parts.push([last, i]); last = i + 1; }
  }
  parts.push([last, e]);
  return parts;
}

// 顶层运算符查找：深度 0 处首个匹配位置
function findTopOp(code, s, e, re) {
  let depth = 0;
  for (let i = s; i < e; i++) {
    const c = code[i];
    if (c === "(" || c === "[" || c === "{") depth++;
    else if (c === ")" || c === "]" || c === "}") depth--;
    else if (depth === 0) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i) return i;
    }
  }
  return -1;
}

// ---------- 模块载入 ----------
const mods = new Map();

function resolveSpec(fromFile, spec) {
  const root = process.cwd();
  const base = spec.startsWith("@/")
    ? path.join(root, "app", spec.slice(2))
    : path.resolve(path.dirname(fromFile), spec);
  if (!base.startsWith(path.join(root, "app"))) return null;
  for (const cand of [base + ".ts", base + ".tsx", path.join(base, "index.ts"), path.join(base, "index.tsx")]) {
    if (fs.existsSync(cand) && fs.statSync(cand).isFile()) return cand;
  }
  return null;
}

function loadMod(abs) {
  if (mods.has(abs)) return mods.get(abs);
  const src = fs.readFileSync(abs, "utf8");
  const { code, strings } = scanStructure(src);
  // 导入声明用原始源码解析（mask 会挖空引号，spec 读不出来）；两者位置一一对应
  const mod = { abs, code, strings, table: buildTable(code), imports: parseImports(src) };
  mod.joiners = new Set();
  for (const [local, b] of mod.imports.entries()) if (b.name === "cn") mod.joiners.add(local);
  mods.set(abs, mod);
  return mod;
}

function parseImports(src) {
  const imports = new Map(); // localName -> { spec, name }
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*(?:"([^"]+)"|'([^']+)')/g)) {
    const spec = m[2] ?? m[3];
    for (const part of m[1].split(",")) {
      const t = part.trim().replace(/^type\s+/, "");
      if (!t) continue;
      const alias = t.match(/^([\w$]+)\s+as\s+([\w$]+)$/);
      if (alias) imports.set(alias[2], { spec, name: alias[1] });
      else imports.set(t, { spec, name: t });
    }
  }
  return imports;
}

// ---------- 文件级常量表 ----------
function buildTable(code) {
  const table = new Map();
  // 等号后不吞空白：mask 把字符串挖成空格，`\s*` 会一路吃到 `;` 或运算符
  const re = /\b(?:export\s+)?(?:const|let|var)\s+([\w$]+)\s*(?::[^=\n]+?)?\s*=/g;
  let m;
  while ((m = re.exec(code))) {
    const eq = m.index + m[0].length;
    table.set(m[1], { s: eq, e: stmtEnd(code, eq) });
  }
  return table;
}

function lineOf(code, pos) { return code.slice(0, pos).split("\n").length; }

function labelOf(code, open) {
  const before = code.slice(0, open);
  let m = before.match(/([\w$]+(?:\.[\w$]+)*)\s*=\s*$/);
  if (m) return m[1];
  m = before.match(/([\w$]+)\s*:\s*$/);
  if (m) {
    const re = /\b(?:export\s+)?const\s+([\w$]+)\s*=\s*\{/g;
    let r, best = null;
    while ((r = re.exec(before))) {
      const close = matchBracket(code, r.index + r[0].length - 1);
      if (close !== -1 && close > open) best = r[1];
    }
    return best ? `${best}.${m[1]}` : m[1];
  }
  return "(literal)";
}

// ---------- 结果合并 ----------
function mergeResults(parts, sep) {
  const refs = [];
  let text = "", miss = null;
  for (const p of parts) {
    if (!p) continue;
    if (p.miss) { miss = p.miss; continue; }
    refs.push(...(p.refs ?? []));
    if (!text) text = p.text;
    else if (p.text) text = text + sep + p.text;
  }
  if (miss) return { miss };
  return { text, refs };
}

// ---------- 直接书写字面量收集 ----------
// 只收集单元范围内直接书写的类串字面量；标识符/成员访问一律记引用（不解析、不内联）。
// 返回 { text, refs } 或 { miss }
function collectOwn(mod, s, e, depth = 0) {
  const { code, strings } = mod;
  if (depth > 24) return { miss: "<解析深度超限>" };
  let i = s;
  while (i < e && !stringAt(strings, i) && /\s/.test(code[i])) i++;
  if (i >= e) return { text: "", refs: [] };
  s = i;

  // 字符串字面量开头：整个范围就是它则直接返回；否则作为最左操作数进入运算符分支
  let left = null;
  const tok = stringAt(strings, s);
  if (tok) {
    if (/\$\{/.test(tok.raw)) return { miss: "`${…}` 插值" };
    left = tok.raw;
    s = tok.end + 1;
    let j = s;
    while (j < e && !stringAt(strings, j) && /\s/.test(code[j])) j++;
    if (j >= e) return { text: left, refs: [] };
  }

  const merge = (parts, sep) => mergeResults(parts, sep);
  const rest = (from) => collectOwn(mod, from, e, depth + 1);

  // 顶层运算符分派（按优先级从低到高）
  const nullish = findTopOp(code, s, e, /\?\?/g);
  if (nullish !== -1) {
    return merge([left != null ? { text: left, refs: [] } : null, collectOwn(mod, s, nullish, depth + 1), rest(nullish + 2)], " ");
  }
  const q = findTopOp(code, s, e, /\?(?![?.])/g);
  if (q !== -1) {
    const colon = findTopOp(code, q + 1, e, /:/g);
    if (colon !== -1) {
      // 条件不计入；两分支并入（静态上界）
      return merge([collectOwn(mod, q + 1, colon, depth + 1), rest(colon + 1)], " ");
    }
  }
  const andOp = findTopOp(code, s, e, /&&/g);
  if (andOp !== -1) {
    // 只算末段（前面全是测试条件）
    let d = 0, last = s;
    for (let k = s; k < e - 1; k++) {
      const c = code[k];
      if (c === "(" || c === "[" || c === "{") d++;
      else if (c === ")" || c === "]" || c === "}") d--;
      else if (d === 0 && c === "&" && code[k + 1] === "&" && code[k - 1] !== "&" && code[k + 2] !== "&") last = k + 2;
    }
    return rest(last);
  }
  const orOp = findTopOp(code, s, e, /\|\|/g);
  if (orOp !== -1) {
    return merge([left != null ? { text: left, refs: [] } : null, collectOwn(mod, s, orOp, depth + 1), rest(orOp + 2)], " ");
  }
  const plus = findTopOp(code, s, e, /\+(?![+=])/g);
  if (plus !== -1) {
    return merge([left != null ? { text: left, refs: [] } : null, collectOwn(mod, s, plus, depth + 1), rest(plus + 1)], "");
  }

  // 叶子形态
  if (code[s] === "(") {
    const close = matchBracket(code, s);
    if (close !== -1 && close < e) return merge([collectOwn(mod, s + 1, close, depth + 1), rest(close + 1)], " ");
  }
  if (code[s] === "{") {
    const close = matchBracket(code, s);
    if (close !== -1 && close < e) {
      // clsx 式对象：键计入，值走分支（静态上界）
      const parts = [left != null ? { text: left, refs: [] } : null];
      for (const [a, b] of splitTop(code, s + 1, close, ",")) {
        let t = a;
        while (t < b && !stringAt(strings, t) && /\s/.test(code[t])) t++;
        if (t >= b) continue;
        const keyTok = stringAt(strings, t);
        const colon = findTopOp(code, t, b, /:/g);
        if (keyTok) {
          if (/\$\{/.test(keyTok.raw)) return { miss: "`${…}` 插值" };
          parts.push({ text: keyTok.raw, refs: [] });
          if (colon !== -1) parts.push(collectOwn(mod, colon + 1, b, depth + 1));
        } else if (colon !== -1) {
          const key = code.slice(t, colon).trim();
          if (!/^[\w$]+$/.test(key)) return { miss: "动态键" };
          parts.push({ text: key, refs: [] });
          parts.push(collectOwn(mod, colon + 1, b, depth + 1));
        } else {
          // 简写成员 { foo }：foo 即类名
          const key = code.slice(t, b).trim();
          if (!/^[\w$.]+$/.test(key)) return { miss: key.split("(")[0] + "(…)" };
          parts.push({ text: key, refs: [] });
        }
      }
      parts.push(rest(close + 1));
      return merge(parts, " ");
    }
  }
  if (code[s] === "[") {
    const close = matchBracket(code, s);
    if (close !== -1 && close < e) {
      const parts = [left != null ? { text: left, refs: [] } : null];
      for (const [a, b] of splitTop(code, s + 1, close, ",")) {
        if (a >= b) continue;
        parts.push(collectOwn(mod, a, b, depth + 1));
      }
      parts.push(rest(close + 1));
      return merge(parts, " ");
    }
  }
  if (/^\.\.\./.test(code.slice(s, s + 3))) return rest(s + 3);

  const text = code.slice(s, e).trim();
  if (/^[\w$.]+\[/.test(text)) return { miss: text.split("[")[0] + "[…]" };
  if (/^[\w$.]+\(/.test(text)) return { miss: text.split("(")[0] + "(…)" };
  if (left != null) return { text: left, refs: [] }; // 前缀串后跟不可识别尾段：按纯串计
  if (/^[\w$]+(\??\.[\w$]+)+$/.test(text)) return { text: "", refs: [text] };
  if (/^[\w$]+$/.test(text)) {
    if (KEYWORDS.has(text)) return { text: "", refs: [] };
    return { text: "", refs: [text] };
  }
  if (/^\d+$/.test(text)) return { text: "", refs: [] };
  return { miss: text.slice(0, 60) };
}

// 初始化器顶层是否 joiner 调用（该单元已由调用单元覆盖）
function isTopJoiner(mod, s, e) {
  const text = mod.code.slice(s, e).trim();
  const m = /^([\w$]+)\s*\(/.exec(text);
  return m ? mod.joiners.has(m[1]) : false;
}

function pushUnit(units, file, line, label, r) {
  if (r.miss) units.push({ file, line, label, skip: r.miss });
  else if (r.text) {
    const refs = [...new Set(r.refs)];
    units.push({ file, line, label, text: r.text, len: r.text.length, refs });
  }
}

// ---------- 逐文件检查 ----------
function checkFile(file) {
  const mod = loadMod(path.resolve(file));
  const { code } = mod;
  if (!mod.joiners.size) return { units: [], nested: [] };

  // 全部 cn( 调用（记 open paren 位置）
  const calls = [];
  for (const m of code.matchAll(new RegExp(`\\b(${[...mod.joiners].join("|")})\\s*\\(`, "g"))) {
    calls.push({ open: m.index + m[0].length - 1 });
  }

  const units = [], nested = [];
  for (const call of calls) {
    const close = matchBracket(code, call.open);
    if (close === -1) continue;

    // 嵌套：参数范围内再出现 joiner 调用
    for (const other of calls) {
      if (other.open > call.open && other.open < close) {
        nested.push({
          file,
          outerLine: lineOf(code, call.open),
          innerLine: lineOf(code, other.open),
          label: labelOf(code, call.open),
        });
        break;
      }
    }

    const label = labelOf(code, call.open);
    const line = lineOf(code, call.open);
    // cn 语义：参数按逗号拆分后空格并接
    const args = splitTop(code, call.open + 1, close, ",").map(([a, b]) => collectOwn(mod, a, b, 1));
    pushUnit(units, file, line, label, mergeResults(args, " "));
  }

  // 常量定义单元：初始化器顶层是 joiner 调用的跳过（调用单元已计）；对象字面量按成员拆
  for (const [name, entry] of mod.table) {
    let s = entry.s;
    while (s < entry.e && !stringAt(mod.strings, s) && /\s/.test(mod.code[s])) s++;
    if (s >= entry.e) continue;
    const e = entry.e;
    if (isTopJoiner(mod, s, e)) continue;
    if (code[s] === "<") continue; // JSX 初始化器
    if (code[s] === "{") {
      const close = matchBracket(code, s);
      if (close === -1 || close >= e) continue;
      for (const [a, b] of splitTop(code, s + 1, close, ",")) {
        let t = a;
        while (t < b && !stringAt(mod.strings, t) && /\s/.test(mod.code[t])) t++;
        if (t >= b) continue;
        const keyTok = stringAt(mod.strings, t);
        const colon = findTopOp(code, t, b, /:/g);
        let key, vs, ve;
        if (keyTok) {
          key = keyTok.raw;
          if (colon !== -1) { vs = colon + 1; ve = b; } else { vs = t; ve = b; }
        } else if (colon !== -1) {
          key = code.slice(t, colon).trim();
          if (!/^[\w$]+$/.test(key)) continue; // 计算键不查
          vs = colon + 1; ve = b;
        } else continue; // 简写成员：值即标识符，无自有字面量
        let vs2 = vs;
        while (vs2 < ve && !stringAt(mod.strings, vs2) && /\s/.test(mod.code[vs2])) vs2++;
        if (vs2 >= ve) continue;
        if (isTopJoiner(mod, vs2, ve)) continue;
        if (findTopOp(code, vs2, ve, /=>/g) !== -1) continue; // 函数成员
        pushUnit(units, file, lineOf(code, vs2), `${name}.${key}`, collectOwn(mod, vs2, ve));
      }
      continue;
    }
    if (findTopOp(code, s, e, /=>/g) !== -1) continue; // 函数初始化器
    if (/^(?:async\s+)?function\b/.test(code.slice(s, e).trim())) continue;
    pushUnit(units, file, lineOf(code, s), name, collectOwn(mod, s, e));
  }
  return { units, nested };
}

// ---------- 主流程 ----------
const root = process.cwd();
const files = [];
(function walk(d) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (EXT.has(path.extname(p)) && !SKIP_FILES.has(p.split(path.sep).join("/"))) files.push(p);
  }
})(path.join(root, SCAN_DIR));

const allUnits = [], allNested = [];
for (const f of files) {
  const { units, nested } = checkFile(f);
  allUnits.push(...units);
  allNested.push(...nested);
}

const warns = allUnits.filter((u) => !u.skip && u.len > THRESHOLD).sort((a, b) => b.len - a.len);
const skips = allUnits.filter((u) => u.skip);
const showAll = process.argv.includes("--all");
const rel = (p) => path.relative(root, p).split(path.sep).join("/");

console.log(`# class-length 检查 — ${SCAN_DIR}（阈值 >${THRESHOLD}）`);
console.log(`units: ${allUnits.length} | WARN: ${warns.length} | NESTED: ${allNested.length} | SKIP: ${skips.length}`);
console.log("");

if (showAll) {
  for (const u of allUnits.filter((x) => !x.skip).sort((a, b) => b.len - a.len)) {
    const tag = u.refs.length ? `  [未计入: ${u.refs.join(", ")}]` : "";
    console.log(`### ${u.len}  ${rel(u.file)}:${u.line}  ${u.label}${tag}`);
    console.log(u.text || "(空)");
    console.log("");
  }
}

for (const u of warns) {
  const tag = u.refs.length ? `  [未计入: ${u.refs.join(", ")}]` : "";
  console.log(`### WARN ${u.len}  ${rel(u.file)}:${u.line}  ${u.label}${tag}`);
  console.log(u.text);
  console.log("");
}
for (const n of allNested) {
  console.log(`### NESTED  ${rel(n.file)}  外层:${n.outerLine}  内层:${n.innerLine}  ${n.label}`);
}
if (allNested.length) console.log("");
for (const s of skips) {
  console.log(`### SKIP  ${rel(s.file)}:${s.line}  ${s.label}  不可静态解析: ${s.skip}`);
}

process.exit(warns.length || allNested.length ? 1 : 0);
