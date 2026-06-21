# 摆脱 loader：静态 page tree 重构笔记

## 目标

`app/routes/docs.tsx` 原先通过 `loader` 在请求时拉取 page tree，但 loader 的实现链路上 `collections/server` 把 `fumadocs-mdx/dist/runtime/server.js` 拉进了客户端 bundle，触发 `TypeError: path$1.join is not a function`（浏览器没有 `node:path`）。重构方向：把 page tree 从运行时搬到构建期生成，docs 组件直接 import 静态数据，彻底去掉 loader。

## 方案

- 构建期由一个纯 Node 脚本 `scripts/build-page-trees.mjs` 扫描 `content/docs/` 下的 MDX 和 `_meta.ts`，解析 frontmatter，按 locale（en / zh）产出 page tree，写到 `app/generated/page-trees.ts`。
- `vite.config.ts` 注册一个轻量插件，在 `configResolved` 阶段 `spawnSync` 调脚本（dev / build 都会触发）。脚本本身不引 vite 上下文，避开 vite 自身的 node builtin 解析问题。
- `docs.tsx` 直接 `import { pageTrees } from "@/generated/page-trees"`，调用 `deserializePageTree(pageTrees[locale])` 还原 tree。
- 为了切断 `docs.tsx → collections/server` 依赖链，把纯工具函数 `buildMarkdownUrl` 拆到独立模块 `app/lib/markdown-url.ts`。

## 修过的几个坑（详细）

### 1. Rolldown 把 `node:path` 内联进 `vite.config.ts`

**现象**

第一次运行后报：
```
TypeError: path$1.join is not a function
```

**根因**

`vite.config.ts` 里写了 `import { resolve, dirname } from "node:path"` 来计算 `OUTPUT_PATH`。Rolldown 在打包 vite config 时没有把 `node:path` 列为 external，而是把它当作普通 module 处理，最终的 `path$1` 拿到了一个空壳对象，没有 `join` 方法。

**修复**

- 用 `import.meta.url` + `fileURLToPath(new URL(...))` 拼出脚本路径，避免在 vite config 里调用 `node:path` 函数。
- 所有路径相关处理（`mkdirSync(dirname(OUTPUT_PATH))` 等）下沉到 `scripts/build-page-trees.mjs`，那里 Node 原生执行，不受 Rolldown 影响。

**经验**

vite 配置文件本身经过打包，依赖的 `node:*` 内建模块必须保证被外置。任何在 `vite.config.ts` 里直接调用的 `node:path` / `node:fs` / `node:child_process` 函数，都要确认 Rolldown 会外置它们；最稳的写法是把这些调用挪到独立脚本里 `spawnSync` 出来。

### 2. `fumadocs-mdx` server runtime 被打进客户端 bundle

**现象**

去掉 loader 之后又报：
```
TypeError: path$1.join is not a function
  import * as path$1 from "/@id/__vite-browser-external:node:path";
  //#region src/runtime/server.ts
  function fileInfo(file, base) {
    return { path: file, fullPath: path$1.join(base, file) };
  }
```

来源：`node_modules/fumadocs-mdx/dist/runtime/server.js`。

**根因**

`docs.tsx` 还在 `import { buildMarkdownUrl } from "@/lib/source"`，而 `app/lib/source.ts` 顶部 `import { docs } from "collections/server"`。`docs.toFumadocsSource()` 会调到 `fumadocs-mdx/dist/runtime/server.js` 里的 `fileInfo`，这个文件直接 import `node:path`，浏览器跑不动。

`buildMarkdownUrl` 本身只是字符串拼接，逻辑上完全不需要 `collections/server`，但因为和 `source` 住在同一个文件，tree-shaking 没法把它切走。

**修复**

新建 [app/lib/markdown-url.ts](file:///d:/Documents/code/litefy-fuma/app/lib/markdown-url.ts)，只依赖 `i18n.ts`。`docs.tsx` 改为 import 它，`source.ts` 改成从 `markdown-url` 重新导出以保持 server 侧 API 不变：

```ts
// app/lib/source.ts
export { buildMarkdownUrl } from "./markdown-url";
```

这样 `docs.tsx` → `markdown-url` → `i18n` 这条链上没有任何 `node:path`，整个 `fumadocs-mdx` server runtime 只出现在 server bundle 里。

**经验**

在 React Router 这类同时跑 server / client 的项目里，要按"模块是否 import 了 server-only 依赖"来切分文件，而不是按"业务语义"。一个看起来无害的工具函数只要跟 server-only import 同处一文件，就会把整条 server 链拖进客户端 bundle。

### 3. barrel re-export 把 `node:path` 拉回 client bundle（坑 2 之后又复发）

**现象**

修完坑 2 之后，开发环境能跑、生产环境首次访问 `/docs` 仍然报 `ts.join is not a function`（`ts` 是 minify 后的 `path.join`），来源 chunk 是 `docs-*.js`，不是预期的 `server-*.js`。

**根因**

[app/lib/index.ts](file:///d:/Documents/code/litefy-fuma/app/lib/index.ts) 是个 barrel：

```ts
export * from "./class-name";
export * from "./i18n";
export * from "./layout.shared";
export * from "./markdown-url";
export * from "./shared";
export * from "./source";   // ← 这行
```

`./source` 顶部 `import { docs } from "collections/server"`，里面 `loader({source: docs.toFumadocsSource(), ...})` 在模块加载时执行。

`app/ui/*` + `app/components/*` 里 30+ 个文件 `import { cn } from "@/lib"`。即使它们只用了 `cn`（来自 `./class-name`），barrel 的 `export * from "./source"` 会让打包器把 `source.ts` 整个拉进 client chunk。`source.ts` 加载时执行 `toFumadocsSource()` → 调到 `fumadocs-mdx/dist/runtime/server.js` → `node:path.join` 在浏览器里炸。

**修复**

从 barrel 删掉 server-only 的 re-export：

```ts
// app/lib/index.ts
export * from "./class-name";
export * from "./i18n";
export * from "./layout.shared";
export * from "./markdown-url";
export * from "./shared";
```

需要 `source` 的地方（`app/routes/search.ts`、`app/llms/*`）改成相对路径 `import { source } from "@/lib/source"`，并把 import 放进 loader 函数体里用 `await import(...)`，防止 route 文件进 client chunk 时再把 source 拖进来：

```ts
// app/routes/search.ts
export async function loader() {
  const { source } = await import("@/lib/source");
  // ...
}
```

**经验**

barrel 文件（`index.ts`）是个隐性的"全量依赖广播器"。一旦里面 re-export 了 server-only 模块，所有 import 路径穿过它的客户端代码都会被污染。规则：**barrel 只 re-export 浏览器安全的模块**；server-only 入口强制走具体子路径，必要时再配合 `await import()` 把 server 依赖藏进函数体。

### 4. `clientLoader.getComponent` 找不到条目

**现象**

页面打开报：
```
[createClientLoader] component/accordion does not exist in available entries
    at getLoader (.../fumadocs-mdx/dist/runtime/browser.js:27)
```

**根因**

`.source/browser.ts` 用 `import.meta.glob(["./**/*.{mdx,md}"], { base: "./../content/docs", eager: false })` 注册条目，注册时 `glob` 给的 key 形如 `./component/accordion.mdx`，loader 内部 `loaders.set(k.startsWith("./") ? k.slice(2) : k, ...)`，所以最终 key 是 `component/accordion.mdx`（带 `.mdx` 后缀）。

原来 `loader` 里用的是 `source.getPage(slugs, locale).path`，由 source resolver 给出完整文件路径（带 `.mdx` / `.zh.mdx`），所以 `clientLoader.getComponent(loaderData.path)` 能命中。去掉 loader 之后我直接把 `slugs.join("/")`（即 `component/accordion`，没后缀）传进去，loader 的 map 里没有这个 key。

**修复**

按 locale 补上后缀：

```ts
const basePath = slugs.join("/");
const fullPath = locale === "zh" ? `${basePath}.zh.mdx` : `${basePath}.mdx`;
const PageContent = clientLoader.getComponent(fullPath);
```

这要求项目里 MDX 文件按 i18n 的 `parser: "dot"` 约定命名（`<name>.mdx` / `<name>.zh.mdx`），跟 `source.config.ts` 里的设置一致。

**更稳的做法（可选）**

把每条 page 的 file path 也写进 `pageTrees` 的 page 节点里，docs 组件直接读 `node.filePath`，就不用靠 slug 推断了。当前规模下用后缀补全够用。

## 文件变更清单

| 文件 | 状态 | 作用 |
| --- | --- | --- |
| `scripts/build-page-trees.mjs` | 新增 | 构建期扫描 MDX / `_meta.ts`，输出 page tree |
| `vite.config.ts` | 改 | 注册 `pageTreesPlugin`，`configResolved` 阶段跑脚本 |
| `app/lib/markdown-url.ts` | 新增 | 浏览器安全的 `buildMarkdownUrl` |
| `app/lib/source.ts` | 改 | `buildMarkdownUrl` 改为 re-export |
| `app/lib/index.ts` | 改 | barrel 删掉 `export * from "./source"`，避免 server-only 泄漏到 client |
| `app/routes/search.ts` | 改 | 改为 `await import("@/lib/source")`，把 server 依赖藏在 loader 内 |
| `app/llms/full.ts` / `index.ts` / `mdx.ts` | 改 | 同上，动态 import source |
| `app/routes/docs.tsx` | 改 | 删 `loader`、换 import、`getComponent` 用完整路径 |
| `app/generated/page-trees.ts` | 新增（生成产物） | 静态 page tree 数据 |
| `package.json` | 改 | `prebuild` 追加 `node scripts/build-page-trees.mjs`，`postinstall` 同步追加 |
| `.gitignore` | 改 | 加上 `/app/generated/` |
| `app/types/virtual-modules.d.ts` | 删除 | 不再使用虚拟模块方案 |

## 后续注意点

- 新增 / 删除 / 改名的 MDX 文件要重启 dev server 才会重新生成 page tree（脚本只在 vite config 加载时跑一次）。如果想 watch，可以在脚本里读 `process.env.NODE_ENV` 并加 `--watch` 之类的处理，或者改成 `vite` 插件的 `handleHotUpdate`。
- `clientLoader.getComponent` 走的是客户端懒加载，没在 `pageTrees` 里出现的 page（被 `_meta` 隐藏或者直接漏配）会拿到 `undefined` 而不报错，要靠路由 fallback 兜底。
- `prebuild` / `postinstall` 失败时 build / install 也会失败，避免了产物和源码不一致的诡异问题。
- 任何 server-only 模块（`app/lib/source.ts`、未来的 `*.server.ts` 等）**不要**放进 barrel 的 `export *`，也不要让 `app/ui/*` / `app/components/*` 静态 import 它。`source` 现在只在 `app/routes/search.ts` 和 `app/llms/*` 的 loader 体里被 `await import()`，整条 client 链路干净。
