#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// design-detect: heuristic lint for Litefy design-spec violations in business code.
// Rules:
//   hardcoded-color        (error) palette/hex/rgb/hsl/oklch colors instead of semantic tokens
//   arbitrary-shadow       (error) shadow-[...] — only the four semantic levels are allowed
//   handwritten-focus      (error, only when interactive.css is present) focus*/disabled: utilities
//   deep-same-tag          (warn)  the same intrinsic tag nested >= 3 levels in a row
// Exit code: 1 if any error, else 0. Warns never fail the run.

let ts = null;
try {
  const mod = await import("typescript");
  ts = mod.default ?? mod;
  if (typeof ts.isJSXElement !== "function") ts = null;
} catch {
  // nesting rule is skipped without the typescript package
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const ROOT = path.resolve(args.find((a) => !a.startsWith("--")) ?? path.join(__dirname, "../app"));

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
const RE_HEX = /#[0-9a-fA-F]{3,8}\b/;
const RE_COLOR_FN = /\b(?:rgba?|hsla?|oklch)\(/;
const RE_ARBITRARY_COLOR = /\[(?:#[0-9a-fA-F]{3,8}|(?:rgba?|hsla?|oklch)\()[^\]]*\]/;
const RE_ARBITRARY_SHADOW = /\bshadow-\[[^\]]+\]/;
const RE_FOCUS_DISABLED =
  /\b(?:group-|peer-)?(?:focus(?:-visible|-within)?|disabled):[a-z0-9[\]().,:#%/_-]+/gi;

const findings = [];

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index; i++) if (source[i] === "\n") line += 1;
  return line;
}

function push(rule, severity, file, line, message) {
  findings.push({ rule, severity, file, line, message });
}

function scanStrings(rule, severity, file, source, test, describe) {
  const stringRe = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = stringRe.exec(source))) {
    const literal = m[1] ?? m[2] ?? m[3] ?? "";
    test.lastIndex = 0;
    let hit;
    while ((hit = test.exec(literal))) {
      push(rule, severity, file, lineOf(source, m.index), describe(hit[0], literal));
    }
  }
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

function scanNesting(file, source) {
  if (!ts) return;
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const visit = (node, chain) => {
    if (ts.isJSXElement(node)) {
      const name = intrinsicTagName(node.openingElement?.tagName);
      const next = name ? [...chain, name] : [];

      if (name) {
        let depth = 0;
        for (let i = next.length - 1; i >= 0 && next[i] === name; i--) depth += 1;
        const hasSameTagChild = node.children?.some(
          (c) => ts.isJSXElement(c) && intrinsicTagName(c.openingElement?.tagName) === name,
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

  scanStrings("arbitrary-shadow", "error", rel, source, RE_ARBITRARY_SHADOW, (hit) =>
    `"${hit}" — shadows are limited to the four semantic levels (faint/subtle/base/elevated)`,
  );

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

  scanNesting(rel, source);
}

const errors = findings.filter((f) => f.severity === "error");
const warns = findings.filter((f) => f.severity === "warn");

console.log(`design-detect: root=${path.relative(process.cwd(), ROOT) || "."} interactive.css=${interactiveInstalled ? "present" : "absent (focus/disabled rule skipped)"}`);

for (const f of findings) {
  console.log(`${f.severity.toUpperCase().padEnd(5)} ${f.file}:${f.line} [${f.rule}] ${f.message}`);
}
console.log(`— ${errors.length} error(s), ${warns.length} warn(s)`);
process.exit(errors.length ? 1 : 0);
