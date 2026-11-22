#!/usr/bin/env node
// UI 库 CSS 冗余门禁：扫描 app/ui/**/*.{ts,tsx}
// 规则 1：同一 class 字符串内出现重复工具类 token → 报错
// 规则 2：relative 在本文件及其 app/ui 相对导入闭包（含骨架↔皮肤同名镜像）内
//         无 absolute/fixed/sticky/JS position 消费者 → 报错
// 规则 3：浏览器默认 display 冗余——裸 block 落在块级/替换元素（Tailwind preflight 已将
//         img/svg/canvas/video/audio/iframe/embed/object 设为 block）、裸 inline 落在行内元素、
//         裸 inline-block 落在 button/textarea → 报错；落点判定三路：
//         3a 皮肤/骨架文件内原生标签 JSX（同文件常量解析）
//         3b 皮肤根 className → headless 镜像根元素
//         3c classNames/fieldClassNames 槽位常量 → headless 内同名槽位元素（多落点须全部命中才报）
// 规则 4：无意义 cn 拆分——非导出、模块顶层的 class 字符串常量，全文件仅被另一常量的
//         cn/拼接实参引用一次 → 报「应并入」（函数内局部变量与数值/非 class 串不参与）；
//         引用方并入该常量后合并串长 >200（class-length 阈值）的拆分是长度门禁强制的，放行
// 静态无法证明但确有语义的，用下面三个名单登记，一行一条带原因。

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = join(fileURLToPath(new URL(".", import.meta.url)), "..", "app", "ui");

// relative 确有语义但闭包内找不到定位消费者的文件（相对 app/ui 的 posix 路径）
const RELATIVE_JUSTIFIED = new Map([
  // skins/number.tsx 壳 relative 锚定骨架渲染的聚焦提示卡——absolute 在共享 fieldHintClasses（skins/input.tsx），闭包静态扫不到
  ["skins/number.tsx", ["relative"]],
]);
// 规则 3 确有语义的豁免（相对 app/ui 的 posix 路径 → 工具类 token 数组）
const DISPLAY_JUSTIFIED = new Map([]);
// 规则 4 确有语义的豁免（相对 app/ui 的 posix 路径 → 常量名数组）
const MERGE_JUSTIFIED = new Map([]);

const SCAN_EXT = new Set([".ts", ".tsx"]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (SCAN_EXT.has(name.slice(name.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const rel = (f) => relative(ROOT, f).replaceAll("\\", "/");
const byPath = new Map(files.map((f) => [rel(f), f]));

// ---------- 规则 1 / 2：字符串扫描 ----------

// 去注释后再取字符串，避免注释文本被当作 class 串
function stripComments(text) {
  return text.replaceAll(/\/\*[\s\S]*?\*\//gu, " ").replaceAll(/\/\/[^\n]*/gu, " ");
}

// 提取字符串字面量与模板串静态块，返回 { text, index }（index 相对去注释文本，仅用于定位近似行号）
function collectChunks(text) {
  const chunks = [];
  const push = (raw, index) => {
    if (raw === undefined) return;
    for (const part of raw.split(/\$\{[^}]*\}/u)) {
      if (part) chunks.push({ text: part, index });
    }
  };
  const strRe = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/gu;
  let m;
  while ((m = strRe.exec(text))) push(m[1] ?? m[2], m.index);
  const tplRe = /`((?:[^`\\]|\\.)*)`/gu;
  while ((m = tplRe.exec(text))) push(m[1], m.index);
  return chunks;
}

function classlike(token) {
  if (!token || /^\d/u.test(token)) return false; // 1fr、100% 这类样式值
  if (/[=;"'`{};]/u.test(token)) return false; // 选择器、样式值、代码
  return /^[\w@:[\].\-/#%!&>*+~,$]+$/u.test(token);
}

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

// 相对导入闭包（仅 app/ui 内部 ./ ../ 引用，@/ 别名指向 barrel 不追）；
// 骨架与皮肤按同名镜像互连：components/x.tsx ↔ skins/x.tsx——定位消费者常在镜像一侧
function closureOf(relPath) {
  const seen = new Set([relPath]);
  const queue = [];
  const mirrorOf = (p) =>
    p.startsWith("skins/") ? `components/${p.slice(6)}` : p.startsWith("components/") ? `skins/${p.slice(11)}` : null;
  const add = (p) => {
    if (byPath.has(p) && !seen.has(p)) {
      seen.add(p);
      queue.push(stripComments(readFileSync(byPath.get(p), "utf8")));
      const mir = mirrorOf(p);
      if (mir) add(mir);
    }
  };
  add(relPath);
  const mir = mirrorOf(relPath);
  if (mir) add(mir);
  while (queue.length) {
    const body = queue.pop();
    const impRe = /(?:from\s*|import\s*)["'](\.{1,2}\/[^"']+)["']/gu;
    let m;
    while ((m = impRe.exec(body))) {
      const base = join(dirname(relPath), m[1]).replaceAll("\\", "/");
      for (const cand of [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`]) {
        add(cand);
      }
    }
  }
  return seen;
}

function hasPositionConsumer(closure) {
  for (const p of closure) {
    const text = stripComments(readFileSync(byPath.get(p), "utf8"));
    if (/\b(absolute|fixed|sticky)\b/u.test(text)) return true;
    if (/\bposition\b\s*[:=]|\.style\.position/u.test(text)) return true;
  }
  return false;
}

// ---------- 规则 3 / 4：TS AST 分析 ----------

// 浏览器默认 display 表
const BLOCK_DEFAULT = new Set([
  "address", "article", "aside", "blockquote", "details", "dialog", "dd", "div", "dl", "dt",
  "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6",
  "header", "hgroup", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "summary", "table", "ul",
]);
// Tailwind preflight 已设为 block 的替换元素
const REPLACED_BLOCK = new Set(["img", "svg", "video", "canvas", "audio", "iframe", "embed", "object"]);
const INLINE_DEFAULT = new Set([
  "a", "abbr", "b", "bdi", "bdo", "cite", "code", "data", "dfn", "em", "i", "kbd", "label",
  "mark", "q", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr",
]);
const INLINEBLOCK_DEFAULT = new Set(["button", "textarea"]);

function displayRedundant(tag, token) {
  if ((BLOCK_DEFAULT.has(tag) || REPLACED_BLOCK.has(tag)) && token === "block") {
    return `${tag} 默认即 block（preflight 对替换元素同样生效）`;
  }
  if (INLINE_DEFAULT.has(tag) && token === "inline") return `${tag} 默认即 inline`;
  if (INLINEBLOCK_DEFAULT.has(tag) && token === "inline-block") return `${tag} 默认即 inline-block`;
  return null;
}

const parsed = new Map();
function getParsed(relPath) {
  if (!parsed.has(relPath)) {
    const text = readFileSync(byPath.get(relPath), "utf8");
    const sf = ts.createSourceFile(relPath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    parsed.set(relPath, { sf, text });
  }
  return parsed.get(relPath);
}

function lineAt(sf, node) {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

// 声明是否位于函数体内（祖先链出现函数体即为局部）
function isFnLocal(node) {

  for (let p = node.parent; p && !ts.isSourceFile(p); p = p.parent) {
    if (
      ts.isFunctionDeclaration(p) || ts.isFunctionExpression(p) || ts.isArrowFunction(p) ||
      ts.isMethodDeclaration(p) || ts.isGetAccessorDeclaration(p) || ts.isSetAccessorDeclaration(p) ||
      ts.isConstructorDeclaration(p)
    ) {
      return true;
    }
  }
  return false;
}

// 引用点所在顶层常量（"名字" 或 "名字.成员名"），供规则 4 查引用方的合并长度
function ownerOf(node) {
  let member = null;
  let top = null;
  for (let p = node.parent; p; p = p.parent) {
    if (member === null && ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
      member = p.name.text;
    }
    if (p.parent && ts.isSourceFile(p.parent)) top = p;
  }
  if (top && ts.isVariableStatement(top)) {
    const d = top.declarationList.declarations[0];
    if (d && ts.isIdentifier(d.name)) {
      return member && member !== d.name.text ? `${d.name.text}.${member}` : d.name.text;
    }
  }
  return null;
}

// 单文件静态画像：常量表、引用计数、槽位落点
function analyze(relPath) {
  const { sf } = getParsed(relPath);
  const consts = new Map(); // name → { kind: "string"|"object"|null, tokens?: Set, props?: Map<string,Set>, exported: bool, node }
  const refs = new Map(); // name → ctx[] ("const-init"|"jsx"|"other")
  const refParents = new Map(); // name → Set("常量名" | "常量名.成员名")——引用点所在顶层常量
  const slots = new Map(); // "classNames.image" → Set(tag)（本文件内原生标签落点）
  const functions = new Map(); // 组件名 → 声明节点（供根映射跳转）
  let stmtExported = false; // 当前 VariableStatement 是否带 export（先于其声明被访问）

  function visit(node, ctx) {
    // 引用上下文推进：jsx 粘性 > cn 实参 > 常量初始化 > 其他
    let childCtx = ctx;
    if (ts.isJsxAttribute(node) || ts.isJsxSpreadAttribute(node)) {
      childCtx = "jsx";
    } else if (ctx !== "jsx") {
      if (ts.isVariableDeclaration(node) && node.initializer) childCtx = "const-init";
      else if (
        (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "cn") ||
        (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) ||
        ts.isTemplateSpan(node)
      ) {
        childCtx = "cn-arg";
      }
    }

    // 常量声明（顶层与函数内都收，规则 4 只用顶层那部分）
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const name = node.name.text;
      const entry = classifyInit(node.initializer);
      entry.fnLocal = isFnLocal(node);
      consts.set(name, { ...entry, exported: stmtExported, node });
    }
    if (ts.isVariableStatement(node)) {
      stmtExported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
    }
    if (ts.isFunctionDeclaration(node) && node.name && (node.body || node.name.text)) {
      functions.set(node.name.text, node);
    }
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer &&
        (ts.isArrowFunction(node.initializer) || ts.isFunctionExpression(node.initializer))) {
      functions.set(node.name.text, node.initializer);
    }

    // 引用计数
    if (ts.isIdentifier(node)) {
      const p = node.parent;
      const isDecl =
        (ts.isVariableDeclaration(p) && p.name === node) ||
        (ts.isFunctionDeclaration(p) && p.name === node) ||
        (ts.isParameter(p) && p.name === node) ||
        (ts.isBindingElement(p) && p.name === node) ||
        (ts.isPropertyAssignment(p) && p.name === node && p.initializer !== node) ||
        (ts.isPropertySignature(p) && p.name === node) ||
        (ts.isMethodDeclaration(p) && p.name === node) ||
        (ts.isImportSpecifier(p) && p.name === node) ||
        ((ts.isPropertyAccessExpression(p) || ts.isQualifiedName(p)) && p.name === node) ||
        (ts.isJsxAttribute(p) && p.name === node) ||
        (ts.isJsxNamespacedName(p));
      if (!isDecl) {
        const list = refs.get(node.text) ?? [];
        list.push(ctx);
        refs.set(node.text, list);
        const owner = ownerOf(node);
        if (owner) {
          const parents = refParents.get(node.text) ?? new Set();
          parents.add(owner);
          refParents.set(node.text, parents);
        }
      }
      if (ts.isShorthandPropertyAssignment(p) && p.name === node) {
        const list = refs.get(node.text) ?? [];
        list.push("const-init");
        refs.set(node.text, list);
      }
    }

    // 槽位落点：原生标签 className 内的 X?.slot / X.slot
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const open = ts.isJsxSelfClosingElement(node) ? node : node.openingElement;
      const tagName = open.tagName;
      if (ts.isIdentifier(tagName) && /^[a-z][\w-]*$/u.test(tagName.text)) {
        for (const attr of open.attributes.properties) {
          if (ts.isJsxAttribute(attr) && ts.isIdentifier(attr.name) && attr.name.text === "className" && attr.initializer) {
            for (const slotKey of collectSlotKeys(attr.initializer.expression ?? attr.initializer)) {
              const set = slots.get(slotKey) ?? new Set();
              set.add(tagName.text);
              slots.set(slotKey, set);
            }
          }
        }
      }
    }

    ts.forEachChild(node, (c) => visit(c, childCtx));
  }
  visit(sf, "other");

  // 常量合并长度：并入后必然超 class-length 阈值的拆分由规则 4 放行（两道门禁合成一意）
  const computing = new Set();
  function lenOf(expr, depth = 0) {
    if (!expr || depth > 8) return undefined;
    if (ts.isJsxExpression(expr)) return lenOf(expr.expression, depth + 1);
    if (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr) || ts.isNonNullExpression(expr)) {
      return lenOf(expr.expression, depth + 1);
    }
    if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return expr.text.length;
    if (ts.isTemplateExpression(expr)) {
      return expr.getText().replaceAll(/^`|`$/gu, "").replaceAll(/\$\{[^}]*\}/gu, " ").length;
    }
    if (ts.isIdentifier(expr)) {
      const name = expr.text;
      const e = consts.get(name);
      if (!e || !e.node?.initializer) return Infinity; // 跨文件导入等不可解析：按超阈放行
      if (e.len !== undefined) return e.len;
      if (computing.has(name)) return undefined;
      computing.add(name);
      const l = lenOf(e.node.initializer, depth + 1);
      computing.delete(name);
      if (l !== undefined) e.len = l;
      return l;
    }
    if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
      const a = lenOf(expr.left, depth + 1);
      const b = lenOf(expr.right, depth + 1);
      return a !== undefined && b !== undefined ? a + b : undefined;
    }
    if (ts.isConditionalExpression(expr)) {
      const a = lenOf(expr.whenTrue, depth + 1);
      const b = lenOf(expr.whenFalse, depth + 1);
      return a !== undefined && b !== undefined ? Math.max(a, b) : undefined;
    }
    if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression) && expr.expression.text === "cn") {
      let total = 0;
      for (const a of expr.arguments) {
        const l = lenOf(a, depth + 1);
        if (l === undefined) return undefined;
        total += l;
      }
      return total + Math.max(0, expr.arguments.length - 1);
    }
    if (ts.isPropertyAccessExpression(expr)) {
      const base = consts.get(expr.expression.getText());
      if (!base) return Infinity; // 跨文件导入的对象：按超阈放行
      return base.memberLens?.get(expr.name.text);
    }
    return undefined;
  }
  for (const entry of consts.values()) {
    if (entry.kind === "string" && entry.node?.initializer) entry.len = lenOf(entry.node.initializer);
    else if (entry.kind === "object" && entry.node?.initializer) {
      entry.memberLens = new Map();
      for (const p of entry.node.initializer.properties) {
        if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
          entry.memberLens.set(p.name.text, lenOf(p.initializer));
        }
      }
    }
  }

  return { sf, consts, refs, refParents, slots, functions };
}

function classifyInit(init) {
  if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) {
    return { kind: "string", tokens: tokenSet(init.text) };
  }
  if (ts.isTemplateExpression(init)) {
    const raw = init.getText().replaceAll(/^`|`$/gu, "").replaceAll(/\$\{[^}]*\}/gu, " ");
    const tokens = tokenSet(raw);
    return tokens.size ? { kind: "string", tokens } : { kind: null };
  }
  if (ts.isObjectLiteralExpression(init)) {
    const props = new Map();
    for (const p of init.properties) {
      if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
        props.set(p.name.text, resolvePresence(p.initializer, null, 0));
      }
    }
    return { kind: "object", props };
  }
  if (ts.isCallExpression(init) && ts.isIdentifier(init.expression) && init.expression.text === "cn") {
    const tokens = new Set();
    for (const a of init.arguments) {
      const t = resolvePresence(a, null, 0);
      for (const x of t ?? []) tokens.add(x);
    }
    return { kind: "string", tokens };
  }
  if (ts.isConditionalExpression(init)) {
    const tokens = new Set([...(resolvePresence(init.whenTrue, null, 0) ?? []), ...(resolvePresence(init.whenFalse, null, 0) ?? [])]);
    return tokens.size ? { kind: "string", tokens } : { kind: null };
  }
  return { kind: null };
}

function tokenSet(text) {
  return new Set(text.trim().split(/\s+/u).filter(Boolean));
}

// 解析表达式里「确定出现」的 token 集合：只做存在性断言，无法解析的部分贡献空集（可断言有、不断言无）
function resolvePresence(expr, env, depth) {
  const empty = new Set();
  if (!expr || depth > 8) return empty;
  if (ts.isJsxExpression(expr)) return resolvePresence(expr.expression, env, depth + 1);
  if (ts.isParenthesizedExpression(expr) || ts.isAsExpression(expr) || ts.isNonNullExpression(expr)) {
    return resolvePresence(expr.expression, env, depth + 1);
  }
  if (ts.isStringLiteral(expr) || ts.isNoSubstitutionTemplateLiteral(expr)) return tokenSet(expr.text);
  if (ts.isTemplateExpression(expr)) {
    const raw = expr.getText().replaceAll(/^`|`$/gu, "").replaceAll(/\$\{[^}]*\}/gu, " ");
    return tokenSet(raw);
  }
  if (ts.isIdentifier(expr)) {
    const e = env?.get(expr.text);
    return e && e.kind === "string" ? (e.tokens ?? empty) : empty;
  }
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return unionPresence(resolvePresence(expr.left, env, depth + 1), resolvePresence(expr.right, env, depth + 1));
  }
  if (ts.isConditionalExpression(expr)) {
    return unionPresence(resolvePresence(expr.whenTrue, env, depth + 1), resolvePresence(expr.whenFalse, env, depth + 1));
  }
  if (ts.isCallExpression(expr) && ts.isIdentifier(expr.expression) && expr.expression.text === "cn") {
    let tokens = new Set();
    for (const a of expr.arguments) {
      tokens = unionPresence(tokens, resolvePresence(a, env, depth + 1));
    }
    return tokens;
  }
  if (ts.isPropertyAccessExpression(expr)) {
    const base = env?.get(expr.expression.getText());
    return base?.kind === "object" ? (base.props.get(expr.name.text) ?? empty) : empty;
  }
  return empty;
}

function unionPresence(a, b) {
  return new Set([...a, ...b]);
}

// JSX className 表达式里出现的 X?.slot / X.slot 键
function collectSlotKeys(expr, depth = 0) {
  const keys = [];
  if (!expr || depth > 12) return keys;
  function scan(node) {
    if (!node) return;
    if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression) && ts.isIdentifier(node.name)) {
      keys.push(`${node.expression.text}.${node.name.text}`);
    }
    ts.forEachChild(node, scan);
  }
  scan(expr);
  return keys;
}

// 皮肤根元素上 classNames / fieldClassNames 属性 → { key → tokenSet }
function resolveSlotAttrs(rootJsx, env) {
  const out = new Map();
  if (!rootJsx) return out;
  const open = ts.isJsxSelfClosingElement(rootJsx) ? rootJsx : rootJsx.openingElement;
  for (const attr of open.attributes.properties) {
    if (!ts.isJsxAttribute(attr) || !ts.isIdentifier(attr.name)) continue;
    const ns = attr.name.text;
    if (ns !== "classNames" && ns !== "fieldClassNames") continue;
    const props = resolveObjectProps(attr.initializer?.expression ?? attr.initializer, env, 0);
    for (const [k, v] of props) out.set(`${ns}.${k}`, v);
  }
  return out;
}

function resolveObjectProps(expr, env, depth) {
  const props = new Map();
  if (!expr || depth > 6) return props;
  const inner = ts.isJsxExpression(expr) ? expr.expression : expr;
  if (!inner) return props;
  if (ts.isObjectLiteralExpression(inner)) {
    for (const p of inner.properties) {
      if (ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name))) {
        props.set(p.name.text, resolvePresence(p.initializer, env, depth + 1));
      } else if (ts.isSpreadAssignment(p)) {
        const spread = resolveObjectProps(p.expression, env, depth + 1);
        for (const [k, v] of spread) props.set(k, v);
      }
    }
  } else if (ts.isCallExpression(inner) && ts.isIdentifier(inner.expression) &&
             ["mergeSlots", "cn"].includes(inner.expression.text)) {
    for (const a of inner.arguments) {
      for (const [k, v] of resolveObjectProps(a, env, depth + 1)) props.set(k, v);
    }
  } else if (ts.isIdentifier(inner)) {
    const e = env?.get(inner.text);
    if (e && e.kind === "object") for (const [k, v] of e.props) props.set(k, v);
  } else if (ts.isConditionalExpression(inner)) {
    for (const [k, v] of resolveObjectProps(inner.whenTrue, env, depth + 1)) props.set(k, v);
    for (const [k, v] of resolveObjectProps(inner.whenFalse, env, depth + 1)) props.set(k, v);
  }
  return props;
}

// 皮肤文件里导出组件的根 JSX 元素；baseName 是文件名小写词干（chart → Chart / Segment → SegmentGroup）
function findSkinRootJsx(info, baseName) {
  const stem = baseName[0].toUpperCase() + baseName.slice(1);
  const matches = [...info.functions.keys()].filter((name) => {
    if (!name.toLowerCase().startsWith(stem.toLowerCase())) return false;
    return name.length === stem.length || /^[A-Z]/u.test(name[stem.length]);
  });
  matches.sort((a, b) => (a === stem ? -1 : b === stem ? 1 : a.length - b.length));
  const fn = matches.length ? info.functions.get(matches[0]) : null;
  if (!fn) return null;
  // 根 JSX = 函数体内首个 return 的 JSX（hint 之类提前出现的局部 JSX 不算）
  let returned = null;
  let first = null;
  function findReturnedJsx(node) {
    if (returned) return;
    if (ts.isReturnStatement(node) && node.expression) {
      const expr = node.expression;
      if (ts.isJsxElement(expr) || ts.isJsxSelfClosingElement(expr) ||
          (ts.isParenthesizedExpression(expr) && (ts.isJsxElement(expr.expression) || ts.isJsxSelfClosingElement(expr.expression)))) {
        returned = ts.isParenthesizedExpression(expr) ? expr.expression : expr;
        return;
      }
    }
    if (!first && (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node))) first = node;
    ts.forEachChild(node, findReturnedJsx);
  }
  findReturnedJsx(fn.body ?? fn);
  return returned ?? first;
}

// headless 文件里组件渲染树上 className 透传最终落点的原生标签
function findLandingTag(info, compName, hops = 0) {
  const fn = info.functions.get(compName);
  if (!fn || hops > 5) return null;
  const { sf } = info;
  let landing = null;
  function findLanding(node) {
    if (landing || !ts.isJsxElement(node) && !ts.isJsxSelfClosingElement(node)) {
      if (!landing) ts.forEachChild(node, findLanding);
      return;
    }
    const open = ts.isJsxSelfClosingElement(node) ? node : node.openingElement;
    const tag = open.tagName;
    const native = ts.isIdentifier(tag) && /^[a-z][\w-]*$/u.test(tag.text);
    if (native) {
      let hasSpreadProps = false;
      let refsClassName = false;
      for (const attr of open.attributes.properties) {
        if (ts.isJsxSpreadAttribute(attr) && ts.isIdentifier(attr.expression) && attr.expression.text === "props") {
          hasSpreadProps = true;
        }
        if (ts.isJsxAttribute(attr) && attr.name.text === "className" && attr.initializer) {
          const found = { hit: false };
          const probe = (n) => {
            if (found.hit) return;
            if (ts.isIdentifier(n) && n.text === "className") found.hit = true;
            if (ts.isPropertyAccessExpression(n) && n.name.text === "className") found.hit = true;
            ts.forEachChild(n, probe);
          };
          probe(attr.initializer.expression ?? attr.initializer);
          if (found.hit) refsClassName = true;
        }
      }
      if (refsClassName || (hasSpreadProps && !open.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.text === "className"))) {
        landing = tag.text;
      }
      if (!landing) ts.forEachChild(node, findLanding);
      return;
    }
    if (ts.isIdentifier(tag) && info.functions.has(tag.text)) {
      findLanding(info.functions.get(tag.text).body ?? info.functions.get(tag.text));
      return;
    }
    ts.forEachChild(node, findLanding);
  }
  findLanding(fn.body ?? fn);
  void sf;
  return landing;
}

// ---------- 主流程 ----------

const problems = [];

const infos = new Map();
function infoOf(relPath) {
  if (!infos.has(relPath)) infos.set(relPath, analyze(relPath));
  return infos.get(relPath);
}

// 规则 1 / 2：字符串扫描
for (const file of files) {
  const relPath = rel(file);
  const raw = readFileSync(file, "utf8");
  const text = stripComments(raw);
  let closureSet = null;

  for (const { text: chunk, index } of collectChunks(text)) {
    const tokens = chunk.trim().split(/\s+/u).filter(Boolean);
    if (tokens.length < 1 || !tokens.every((token) => classlike(token))) continue;

    // 规则 1：重复 token（含括号的任意值/函数记法不参与，避免 CSS 模板串误报）
    const seen = new Set();
    for (const t of tokens) {
      if (t.includes("(")) continue;
      if (seen.has(t)) {
        problems.push(`${relPath}:${lineOf(raw, index)} 规则1 重复工具类 "${t}"`);
        break;
      }
      seen.add(t);
    }

    // 规则 2：无消费者的 relative
    if (tokens.includes("relative")) {
      if (!closureSet) closureSet = closureOf(relPath);
      if (!hasPositionConsumer(closureSet) && !RELATIVE_JUSTIFIED.get(relPath)) {
        problems.push(`${relPath}:${lineOf(raw, index)} 规则2 relative 无定位消费者（absolute/fixed/sticky/JS position 均未出现）`);
      }
    }
  }
}

const mirrorOf = (p) =>
  p.startsWith("skins/") ? `components/${p.slice(6)}` : p.startsWith("components/") ? `skins/${p.slice(11)}` : null;

for (const relPath of byPath.keys()) {
  const info = infoOf(relPath);
  const displayAllowed = DISPLAY_JUSTIFIED.get(relPath) ?? [];
  const mergeAllowed = MERGE_JUSTIFIED.get(relPath) ?? [];

  // 规则 4：无意义 cn 拆分（顶层非导出 class 串常量，单引用且引用点是另一常量的 cn/拼接实参）；
  // 引用方并入该常量后必然超 class-length 阈值（>200）的拆分是长度门禁强制的，放行
  for (const [name, entry] of info.consts) {
    if (entry.exported || entry.fnLocal || entry.kind !== "string" || !entry.tokens?.size) continue;
    const rs = info.refs.get(name) ?? [];
    if (rs.length === 1 && rs[0] === "cn-arg" && !mergeAllowed.includes(name)) {
      const parent = (info.refParents.get(name) ?? []).values().next().value;
      let parentLen;
      if (parent) {
        const dot = parent.indexOf(".");
        if (dot === -1) parentLen = info.consts.get(parent)?.len;
        else parentLen = info.consts.get(parent.slice(0, dot))?.memberLens?.get(parent.slice(dot + 1));
      }
      if (parentLen !== undefined && parentLen > 200) continue;
      problems.push(`${relPath}:${lineAt(info.sf, entry.node)} 规则4 常量 "${name}" 仅被另一常量的 cn/拼接实参引用一次，应并入`);
    }
  }

  // 规则 3a：本文件原生标签 JSX——同一 token 的全部落点都冗余才报
  // （如 cardClasses 同时落在 div（冗余）与 button/a（必要）上，则整体必要）
  const landings = new Map(); // token → { tags: Set, node: 首个落点元素 }
  const walkJsx = (node) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const open = ts.isJsxSelfClosingElement(node) ? node : node.openingElement;
      if (ts.isIdentifier(open.tagName) && /^[a-z][\w-]*$/u.test(open.tagName.text)) {
        for (const attr of open.attributes.properties) {
          if (ts.isJsxAttribute(attr) && attr.name.text === "className" && attr.initializer) {
            const tokens = resolvePresence(attr.initializer.expression ?? attr.initializer, info.consts, 0);
            if (tokens) {
              for (const t of tokens) {
                const landing = landings.get(t) ?? { tags: new Set(), node: open.tagName };
                landing.tags.add(open.tagName.text);
                landings.set(t, landing);
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, walkJsx);
  };
  walkJsx(info.sf);
  for (const [t, { tags, node }] of landings) {
    if (displayAllowed.includes(t)) continue;
    const verdicts = [...tags].map((tag) => displayRedundant(tag, t));
    if (verdicts.every((v) => v !== null)) {
      problems.push(`${relPath}:${lineAt(info.sf, node)} 规则3 <${[...tags].join(",")}> 上 "${t}" 冗余：${verdicts[0]}`);
    }
  }

  // 规则 3b / 3c：仅皮肤文件做跨文件映射
  const mir = mirrorOf(relPath);
  if (mir && byPath.has(mir)) {
    const mirror = infoOf(mir);
    const compName = relPath.slice(relPath.lastIndexOf("/") + 1).replace(/\.(ts|tsx)$/u, "");
    const rootJsx = findSkinRootJsx(info, compName);
    if (rootJsx) {
      // 3b：根 className → headless 根元素
      const open = ts.isJsxSelfClosingElement(rootJsx) ? rootJsx : rootJsx.openingElement;
      for (const attr of open.attributes.properties) {
        if (ts.isJsxAttribute(attr) && attr.name.text === "className" && attr.initializer) {
          const tokens = resolvePresence(attr.initializer.expression ?? attr.initializer, info.consts, 0);
          const headlessName = resolveHeadlessName(info, open.tagName);
          if (tokens && headlessName) {
            const tag = findLandingTag(mirror, headlessName);
            if (tag) {
              for (const t of tokens) {
                const why = displayRedundant(tag, t);
                if (why && !displayAllowed.includes(t)) {
                  problems.push(`${relPath}:${lineAt(info.sf, open.tagName)} 规则3 根 class 落在 headless <${tag}> 上 "${t}" 冗余：${why}`);
                }
              }
            }
          }
        }
      }
      // 3c：classNames / fieldClassNames 槽位 → headless 槽位元素
      const slotTokens = resolveSlotAttrs(rootJsx, info.consts);
      for (const [key, tokens] of slotTokens) {
        if (!tokens) continue;
        const tags = mirror.slots.get(key);
        if (!tags || tags.size === 0) continue;
        for (const t of tokens) {
          const verdicts = [...tags].map((tag) => displayRedundant(tag, t));
          if (verdicts.every((v) => v !== null) && !displayAllowed.includes(t)) {
            problems.push(`${relPath}:${lineAt(info.sf, open.tagName)} 规则3 槽位 ${key} 落在 <${[...tags].join(",")}> 上 "${t}" 冗余：${verdicts[0]}`);
          }
        }
      }
    }
  }
}

// 皮肤根 JSX 标签 → headless 组件原名（@/ui barrel → components/<basename>.tsx，或相对导入直取）
function resolveHeadlessName(info, tagName) {
  if (!ts.isIdentifier(tagName)) return null;
  const { sf } = info;
  let name = null;
  function findImportAlias(node) {
    if (name) return;
    if (ts.isImportDeclaration(node) && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
      for (const spec of node.importClause.namedBindings.elements) {
        if (spec.name.text === tagName.text && spec.propertyName) name = spec.propertyName.text;
        else if (spec.name.text === tagName.text) name = spec.name.text;
      }
    }
    ts.forEachChild(node, findImportAlias);
  }
  findImportAlias(sf);
  return name;
}

if (problems.length) {
  console.error(`✗ UI CSS 冗余门禁：${problems.length} 处`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log("✓ UI CSS 冗余门禁：无重复工具类，relative 与默认 display 均有依据，无无意义 cn 拆分");
