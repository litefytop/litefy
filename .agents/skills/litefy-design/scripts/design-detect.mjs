#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// design-detect: heuristic lint for Litefy design-spec violations in business code.
// Rules:
//   hardcoded-color        (error) palette/hex/rgb/hsl/oklch colors instead of semantic tokens
//                                  (hex inside URL-ish attributes like href/id is skipped)
//   arbitrary-shadow       (error) shadow-[...] incl. inset — only the four semantic levels are allowed
//   legacy-shadow-name     (warn)  default scale names (shadow-sm/md/...) — mapped onto semantic levels,
//                                  legal for existing code but new code should use semantic names
//   handwritten-focus      (error, only when interactive.css is present) focus*/disabled: utilities
//   deep-same-tag          (warn)  the same intrinsic tag nested >= 3 levels in a row
//   tabs-manual-panels     (warn)  <Tabs> triggers while panels are hand-toggled with hidden classes —
//                                  triggers' aria-controls points at an empty node; panels must be
//                                  TabsContent or role="tabpanel" containers with aligned ids
//   nested-scroll          (warn)  overflow-* element nested inside another scroll context, or wrapping
//                                  a component with built-in scroll (Table) — double scrollbars and
//                                  broken height; wrapper padding is the sanctioned spacing tool
//   nested-tabs            (warn)  <Tabs> inside <Tabs> — nested tab bars break aria ownership and
//                                  keyboard navigation; split into pages or Segmented/Chip controls
// Boundary: design-detect owns DESIGN-LANGUAGE rules only. Accessibility semantics belong to the
// standard toolchain (eslint-plugin-jsx-a11y static, axe-core on rendered pages) — do not add
// generic a11y rules here, they would signal coverage that the standard tools actually own.
// Exit code: 1 if any error, else 0. Warns never fail the run.
// Suppress: `design-detect-disable-file <rules|*>` anywhere in a file (for theme-definition code);
// `// design-detect-disable-line[: <rules>]` on the finding's line, or `// design-detect-disable-next-line[: <rules>]` above it.

let ts = null;
try {
  const mod = await import("typescript");
  ts = mod.default ?? mod;
  if (typeof ts.isJsxAttribute !== "function") ts = null;
} catch {
  // nesting rule is skipped without the typescript package
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);

// Default scan root works from both install positions:
//   <repo>/scripts/design-detect.mjs              → <repo>/app
//   <repo>/.agents/skills/litefy-design/scripts/… → <repo>/app or <repo>/src/app
// falling back to the process working directory.
const ROOT_CANDIDATES = [
  path.join(__dirname, "../app"),
  path.join(__dirname, "../../../app"),
  path.join(__dirname, "../../../src/app"),
  path.join(__dirname, "../../../../app"),
  path.join(__dirname, "../../../../src/app"),
  process.cwd(),
];
const ROOT = path.resolve(
  args.find((a) => !a.startsWith("--")) ??
    ROOT_CANDIDATES.find((candidate) => fs.existsSync(candidate)) ??
    process.cwd(),
);

const EXCLUDED_DIRS = new Set(["ui", "generated", "node_modules", "dist", "build"]);
const EXTENSIONS = new Set([".tsx", ".ts"]);

const INTERACTIVE_CANDIDATES = [
  "ui/styles/interactive.css",
  "ui/litefy/styles/interactive.css",
  "styles/interactive.css",
];

const PALETTE_NAMES =
  "black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const COLOR_UTILS =
  "text|bg|border|ring|fill|stroke|from|via|to|outline|decoration|divide|accent|caret|shadow";
const RE_PALETTE_CLASS = new RegExp(
  `\\b(?:${COLOR_UTILS})-(?:(?:${PALETTE_NAMES})-\\d{2,3}|black|white)(?:\\/\\d{1,3})?\\b`,
  "g",
);
const RE_HEX = /#[0-9a-fA-F]{3,8}\b/g;
const RE_COLOR_FN = /\b(?:rgba?|hsla?|oklch)\(/g;
const RE_ARBITRARY_COLOR = /\[(?:#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch)\()[^\]]*\]/g;
const RE_ARBITRARY_SHADOW = /(?<![-\w])shadow-\[[^\]]+\]/g;
const RE_LEGACY_SHADOW = /(?<![-\w])shadow-(2xs|xs|sm|md|lg|xl|2xl)\b/g;
const LEGACY_TO_SEMANTIC = {
  "2xs": "faint",
  xs: "faint",
  sm: "subtle",
  md: "base",
  lg: "elevated",
  xl: "elevated",
  "2xl": "elevated",
};
// Attributes whose string values are URLs or anchors — "#ddd" there is a fragment, not a color
const URL_ATTRS = new Set([
  "href", "src", "srcset", "to", "action", "cite", "poster", "usemap", "longdesc",
  "icon", "manifest", "ping", "formaction", "xlink:href", "id", "name", "for", "htmlfor", "key",
]);
const RE_FOCUS_DISABLED =
  /\b(?:group-|peer-)?(?:focus(?:-visible|-within)?|disabled):[a-z0-9[\]().,:#%/_-]+/gi;
const RE_TABS_COMPONENT = /<Tabs\b/;
const RE_TABS_HIDDEN_PANEL = /className=\{[^}]*"hidden"/;
const RE_TABS_PANEL_OK = /TabsContent|role="tabpanel"/;
const RE_SCROLL_CLASS = /\boverflow-(?:x-|y-)?(?:auto|scroll)\b/;
// 自带内部滚动容器的成品组件:外层再包 overflow-* 会双滚动/高度异常
const SCROLL_COMPONENTS = new Set(["Table"]);

const findings = [];

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (source[i] === "\n") line += 1;
  return line;
}

function push(rule, severity, file, line, message) {
  if (disableCtx.fileDisabled.has("*") || disableCtx.fileDisabled.has(rule)) return;
  const lineRules = disableCtx.lineDisabled.get(line) ?? [];
  if (lineRules.includes("*") || lineRules.includes(rule)) return;
  findings.push({ rule, severity, file, line, message });
}

// Parse `design-detect-disable-file <rules|*>` (anywhere) and
// `// design-detect-disable-line[: rules|*]` / preceding-line `// design-detect-disable-next-line[: rules|*]`.
function buildDisableCtx(source) {
  const fileDisabled = new Set();
  const lineDisabled = new Map();
  const parseRules = (rest) => {
    const rules = (rest ?? "").trim().split(/[\s,]+/).filter(Boolean);
    return rules.length ? rules : ["*"];
  };
  const lines = source.split("\n");
  lines.forEach((text, i) => {
    const fileMarker = text.match(/design-detect-disable-file\s+([\w,\s-]+)/);
    if (fileMarker) parseRules(fileMarker[1].replace(/[,]/g, " ")).forEach((r) => fileDisabled.add(r));

    const lineMarker = text.match(/design-detect-disable-line\b\s*([\w,\s-]*)/);
    if (lineMarker) lineDisabled.set(i + 1, parseRules(lineMarker[1]));

    const nextMarker = text.match(/design-detect-disable-next-line\b\s*([\w,\s-]*)/);
    if (nextMarker) lineDisabled.set(i + 2, parseRules(nextMarker[1]));
  });
  return { fileDisabled, lineDisabled };
}

let disableCtx = { fileDisabled: new Set(), lineDisabled: new Map() };

function bracketSpans(text) {
  const spans = [];
  let start = -1;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "[") start = i;
    else if (text[i] === "]" && start !== -1) {
      spans.push([start, i]);
      start = -1;
    }
  }
  return spans;
}

function scanStrings(rule, severity, file, source, test, describe, opts = {}) {
  const stringRe = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = stringRe.exec(source))) {
    const literal = m[1] ?? m[2] ?? m[3] ?? "";
    const contentBase = m.index + 1;
    const skip = [];
    // colors inside [...] are reported by the arbitrary-color/shadow rules instead — avoid doubles
    if (opts.skipBrackets) for (const [s, e] of bracketSpans(literal)) skip.push([s, e]);
    if (opts.skipSourceSpans) {
      for (const [s, e] of opts.skipSourceSpans) {
        const lo = Math.max(s, contentBase);
        const hi = Math.min(e, contentBase + literal.length);
        if (lo < hi) skip.push([lo - contentBase, hi - contentBase]);
      }
    }
    test.lastIndex = 0;
    let hit;
    while ((hit = test.exec(literal))) {
      if (skip.some(([s, e]) => hit.index >= s && hit.index < e)) continue;
      push(rule, severity, file, lineOf(source, m.index), describe(hit[0], literal));
    }
  }
}

function collectUrlSpans(sf) {
  if (!sf) return [];
  const spans = [];
  const visit = (node) => {
    if (ts.isJsxAttribute(node)) {
      const attrName = String(node.name?.escapedText ?? node.name?.text ?? "").toLowerCase();
      const init = node.initializer;
      if (URL_ATTRS.has(attrName) && init && ts.isStringLiteral(init)) {
        const start = init.getStart(sf) + 1; // skip opening quote
        spans.push([start, start + init.text.length]);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return spans;
}

function isExemptFromFocusCheck(token, literal) {
  if (token.includes("danger") || token.includes("invalid")) return true;
  if (token.includes("has-") && token.includes("focus")) return true;
  // reveal-on-focus (e.g. focus-visible:opacity-100) controls visibility, not the focus indicator
  if (/^focus(?:-visible|-with)?:opacity-/.test(token)) return true;
  if (literal.includes("danger") || literal.includes("invalid")) return true;
  return false;
}

function intrinsicTagName(tagNode) {
  if (tagNode && ts && ts.isIdentifier(tagNode) && /^[a-z]/.test(tagNode.escapedText ?? tagNode.text)) {
    return String(tagNode.escapedText ?? tagNode.text);
  }
  return null;
}

function scanNesting(file, source, sf) {
  if (!ts) return;

  const visit = (node, chain) => {
    if (ts.isJsxElement(node)) {
      const name = intrinsicTagName(node.openingElement?.tagName);
      const next = name ? [...chain, name] : [];

      if (name) {
        let depth = 0;
        for (let i = next.length - 1; i >= 0 && next[i] === name; i--) depth += 1;
        const hasSameTagChild = node.children?.some(
          (c) => ts.isJsxElement(c) && intrinsicTagName(c.openingElement?.tagName) === name,
        );
        if (depth >= 3 && !hasSameTagChild) {
          const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
          push(
            "deep-same-tag",
            "warn",
            file,
            line + 1,
            `<${name}> nested ${depth} consecutive levels — scroll/animation wrappers rarely need >=3 same-tag layers`,
          );
        }
      }

      for (const child of node.children ?? []) visit(child, next);
      return;
    }
    ts.forEachChild(node, (child) => visit(child, chain));
  };

  visit(sf, []);
}

function scanTabs(file, source) {
  if (RE_TABS_PANEL_OK.test(source)) return;
  const componentMatch = source.match(RE_TABS_COMPONENT);
  if (!componentMatch) return;
  if (!RE_TABS_HIDDEN_PANEL.test(source)) return;
  push(
    "tabs-manual-panels",
    "warn",
    file,
    lineOf(source, componentMatch.index),
    `<Tabs> triggers render their own tabpanel via options[].content; hand-toggled hidden panels leave aria-controls pointing at an empty node — pass options[].content (unmountOnHide={false} to keep panels mounted), or use TabsContent / role="tabpanel" containers with aligned ids`,
  );
}

function jsxElementName(node) {
  const tag = ts.isJsxElement(node) ? node.openingElement?.tagName : node.tagName;
  if (tag && ts.isIdentifier(tag)) return String(tag.escapedText ?? tag.text);
  return null;
}

function jsxClassNameText(node, sf) {
  const open = ts.isJsxElement(node) ? node.openingElement : node;
  let text = "";
  for (const attr of open?.attributes?.properties ?? []) {
    if (
      ts.isJsxAttribute(attr) &&
      String(attr.name?.escapedText ?? attr.name?.text ?? "").toLowerCase() === "classname" &&
      attr.initializer
    ) {
      text += attr.initializer.getFullText(sf);
    }
  }
  return text;
}

/** 盒中盒的可靠信号:滚动上下文嵌套。装饰 div(动画/定位用)不计入,2 层 wrapper 合法。 */
/** Tabs 嵌套:Tabs 面板里再放 Tabs——aria 归属与键盘路径混乱,内层分组应改分段控件或拆页面 */
function scanNestedTabs(file, source, sf) {
  if (!ts) return;

  const visit = (node, tabsDepth) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const isTabs = jsxElementName(node) === "Tabs";
      if (tabsDepth > 0 && isTabs) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        push(
          "nested-tabs",
          "warn",
          file,
          line + 1,
          "<Tabs> inside <Tabs> — nested tab bars break aria ownership and keyboard navigation; use Chip/Segmented controls for the inner grouping, or split into separate pages",
        );
      }
      const next = tabsDepth + (isTabs ? 1 : 0);
      ts.forEachChild(node, (child) => visit(child, next));
      return;
    }
    ts.forEachChild(node, (child) => visit(child, tabsDepth));
  };

  visit(sf, 0);
}

function scanNestedScroll(file, source, sf) {
  if (!ts) return;

  const visit = (node, scrollDepth) => {
    if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = jsxElementName(node);
      const scrolls = RE_SCROLL_CLASS.test(jsxClassNameText(node, sf));
      const builtInScroll = name != null && SCROLL_COMPONENTS.has(name);
      if (scrollDepth > 0 && (scrolls || builtInScroll)) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        push(
          "nested-scroll",
          "warn",
          file,
          line + 1,
          builtInScroll
            ? `<${name}> has a built-in scroll container — wrapping it in overflow-* double-scrolls and breaks height; place it directly (padding for spacing, flex for sizing)`
            : "outer element already scrolls — nested overflow-* creates double scrollbars; remove the inner overflow (padding for spacing)",
        );
      }
      const next = scrollDepth + (scrolls ? 1 : 0) + (builtInScroll ? 1 : 0);
      ts.forEachChild(node, (child) => visit(child, next));
      return;
    }
    ts.forEachChild(node, (child) => visit(child, scrollDepth));
  };

  visit(sf, 0);
}

function collectFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) out.push(...collectFiles(full));
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

if (!fs.existsSync(ROOT)) {
  console.error(`design-detect: root not found: ${ROOT}`);
  process.exit(2);
}

const interactiveInstalled = INTERACTIVE_CANDIDATES.some((p) =>
  fs.existsSync(path.join(ROOT, p)),
);

for (const abs of collectFiles(ROOT)) {
  const rel = path.relative(process.cwd(), abs).replaceAll("\\", "/");
  const source = fs.readFileSync(abs, "utf8");
  disableCtx = buildDisableCtx(source);
  const sf = ts
    ? ts.createSourceFile(abs, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    : null;
  const urlSpans = collectUrlSpans(sf);

  scanStrings("hardcoded-color", "error", rel, source, RE_PALETTE_CLASS, (hit) =>
    `palette class "${hit}" — use semantic tokens (bg-background, text-muted-foreground, bg-primary...)`,
  );

  scanStrings(
    "hardcoded-color",
    "error",
    rel,
    source,
    RE_ARBITRARY_COLOR,
    (hit) => `arbitrary color value "${hit}" — use semantic tokens`,
  );

  scanStrings(
    "hardcoded-color",
    "error",
    rel,
    source,
    RE_HEX,
    (hit) => `hex color "${hit}" — use semantic tokens`,
    { skipBrackets: true, skipSourceSpans: urlSpans },
  );

  scanStrings(
    "hardcoded-color",
    "error",
    rel,
    source,
    RE_COLOR_FN,
    (hit) => `color function "${hit}...)" — use semantic tokens`,
    { skipBrackets: true },
  );

  scanStrings("arbitrary-shadow", "error", rel, source, RE_ARBITRARY_SHADOW, (hit) =>
    `"${hit}" — shadows are limited to the four semantic levels (faint/subtle/base/elevated)`,
  );

  scanStrings("legacy-shadow-name", "warn", rel, source, RE_LEGACY_SHADOW, (hit) => {
    const name = hit.replace("shadow-", "");
    return `"${hit}" maps to semantic "shadow-${LEGACY_TO_SEMANTIC[name]}" — prefer semantic names in new code`;
  });

  if (interactiveInstalled) {
    const stringRe = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'/g;
    let m;
    while ((m = stringRe.exec(source))) {
      const literal = m[1] ?? m[2] ?? "";
      RE_FOCUS_DISABLED.lastIndex = 0;
      let hit;
      while ((hit = RE_FOCUS_DISABLED.exec(literal))) {
        if (isExemptFromFocusCheck(hit[0], literal)) continue;
        push(
          "handwritten-focus",
          "error",
          rel,
          lineOf(source, m.index),
          `"${hit[0]}" — focus/disabled styles belong to interactive.css; danger/invalid focus styles are the sanctioned exception`,
        );
      }
    }
  }

  scanNesting(rel, source, sf);
  scanTabs(rel, source);
  scanNestedScroll(rel, source, sf);
  scanNestedTabs(rel, source, sf);
}

const errors = findings.filter((f) => f.severity === "error");
const warns = findings.filter((f) => f.severity === "warn");

console.log(`design-detect: root=${path.relative(process.cwd(), ROOT) || "."} interactive.css=${interactiveInstalled ? "present" : "absent (focus/disabled rule skipped)"}`);

for (const f of findings) {
  console.log(`${f.severity.toUpperCase().padEnd(5)} ${f.file}:${f.line} [${f.rule}] ${f.message}`);
}
console.log(`— ${errors.length} error(s), ${warns.length} warn(s)`);
process.exit(errors.length ? 1 : 0);
