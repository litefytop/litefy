import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

const CONTENT_ROOT = resolve(process.cwd(), "content/docs");
const OUTPUT_PATH = resolve(process.cwd(), "app/generated/page-trees.ts");
const DOCS_BASE_URL = "/docs";
const LANGUAGES = ["en", "zh"];
const DEFAULT_LANGUAGE = "en";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---/;
const META_DISPLAY_RE =
  /displayName:\s*\{\s*en:\s*"([^"]+)"(?:\s*,\s*zh:\s*"([^"]+)")?\s*,?\s*\}/;
const META_NAME_RE = /name:\s*"([^"]+)"/;

function parseFrontmatter(content) {
  const match = content.match(FRONTMATTER_RE);
  if (!match) return {};
  const body = match[1];
  const title = body
    .match(/^title:\s*(.+?)\s*$/m)?.[1]
    ?.replace(/^["']|["']$/g, "");
  const description = body
    .match(/^description:\s*(.+?)\s*$/m)?.[1]
    ?.replace(/^["']|["']$/g, "");
  return { title, description };
}

function parseMetaFile(path) {
  const content = readFileSync(path, "utf8");
  const result = {};
  const lines = content.split(/\r?\n/);
  let currentKey = null;
  let currentEntry = {};
  let entryStart = 0;

  const finalizeCurrent = (endIdx) => {
    if (!currentKey) return;
    const slice = lines.slice(entryStart, endIdx + 1).join("\n");
    const displayMatch = slice.match(META_DISPLAY_RE);
    if (displayMatch) {
      const en = displayMatch[1];
      const zh = displayMatch[2];
      currentEntry.displayName = { en, ...(zh ? { zh } : {}) };
    }
    result[currentKey] = currentEntry;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const keyMatch = line.match(/^\s{2}["']?([\w-]+)["']?:\s*\{?\s*$/);
    if (keyMatch && !line.includes("displayName")) {
      if (currentKey) finalizeCurrent(i - 1);
      currentKey = keyMatch[1];
      currentEntry = {};
      entryStart = i;
      continue;
    }
    if (currentKey) {
      const typeMatch = line.match(/type:\s*"(\w+)"/);
      if (typeMatch) currentEntry.type = typeMatch[1];

      const nameMatch = line.match(META_NAME_RE);
      if (nameMatch) currentEntry.name = nameMatch[1];

      if (
        (line.includes("},") || (line.includes("}") && line.trim() === "},")) &&
        !line.match(/^\s{4}["']?[\w-]+["']?:\s*\{/)
      ) {
        finalizeCurrent(i);
        currentKey = null;
        currentEntry = {};
      }
    }
  }
  if (currentKey) finalizeCurrent(lines.length - 1);
  return result;
}

function stripLocale(slug) {
  for (const lang of LANGUAGES) {
    if (lang === DEFAULT_LANGUAGE) continue;
    if (slug === lang || slug.endsWith(`.${lang}`)) {
      return { locale: lang, baseSlug: slug.replace(`.${lang}`, "") };
    }
  }
  return { locale: DEFAULT_LANGUAGE, baseSlug: slug };
}

function localizeName(entry, locale) {
  if (!entry) return "";
  if (typeof entry.displayName === "string") return entry.displayName;
  if (entry.displayName && typeof entry.displayName === "object") {
    if (entry.displayName[locale]) return entry.displayName[locale];
  }
  return entry.name || "";
}

function buildPageUrl(relativePath, locale) {
  const cleanPath = relativePath.replace(/\.mdx?$/, "");
  if (cleanPath === "index") return `/${locale}${DOCS_BASE_URL}`;
  return `/${locale}${DOCS_BASE_URL}/${cleanPath}`;
}

function collectMdxFiles(dir, base = dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...collectMdxFiles(full, base));
    } else if (extname(name) === ".mdx") {
      out.push(relative(base, full));
    }
  }
  return out;
}

function buildTree(locale) {
  const allMdx = collectMdxFiles(CONTENT_ROOT);
  const pagesByDir = new Map();

  for (const rel of allMdx) {
    const { baseSlug, locale: fileLocale } = stripLocale(
      rel.replace(/\.mdx$/, ""),
    );
    if (fileLocale !== locale) continue;

    const dir = dirname(rel);
    const fileName = basename(baseSlug);
    const fullPath = join(CONTENT_ROOT, rel);
    const fm = parseFrontmatter(readFileSync(fullPath, "utf8"));

    if (!pagesByDir.has(dir)) pagesByDir.set(dir, new Map());
    pagesByDir.get(dir).set(fileName, {
      title: fm.title || fileName,
      description: fm.description,
      path: rel,
    });
  }

  function buildDir(dir) {
    const metaPath = join(CONTENT_ROOT, dir, "_meta.ts");
    let meta = {};
    try {
      meta = parseMetaFile(metaPath);
    } catch {}

    const pages = pagesByDir.get(dir) || new Map();
    const out = [];
    const keys = new Set([...Object.keys(meta), ...pages.keys()]);

    for (const key of keys) {
      const entry = meta[key];
      const page = pages.get(key);

      if (page) {
        const name =
          (entry?.displayName &&
            typeof entry.displayName === "object" &&
            entry.displayName[locale]) ||
          entry?.name ||
          page.title;
        const node = {
          type: "page",
          name,
          url: buildPageUrl(join(dir, key).replace(/\\/g, "/"), locale),
        };
        if (page.description || entry?.description) {
          node.description = page.description || entry.description;
        }
        out.push(node);
      } else if (entry && entry.type === "folder") {
        const childDir = join(dir, key);
        const children = buildDir(childDir);
        if (children.length === 0) continue;
        out.push({
          type: "folder",
          name: localizeName(entry, locale) || key,
          children,
        });
      }
    }

    return out;
  }

  return {
    name: "Docs",
    children: buildDir("."),
  };
}

const trees = {};
for (const locale of LANGUAGES) {
  trees[locale] = {
    $fumadocs_loader: "page-tree",
    data: buildTree(locale),
  };
}

const code = `/* eslint-disable */\nexport const pageTrees = ${JSON.stringify(trees)} as const;\n`;

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
writeFileSync(OUTPUT_PATH, code);
console.log(`[build-page-trees] wrote ${OUTPUT_PATH}`);
