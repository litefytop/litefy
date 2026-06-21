// app/lib/index.ts
//
// ⚠️ Barrel export rules (2026-06-20)
//
// 1. ALLOWED: pure UI utilities / helper functions / code with NO node builtin deps
//    e.g. cn, twMerge, formatDate, all UI components
//
// 2. FORBIDDEN: any module that:
//    - imports from "collections/server"
//    - imports from "node:*"
//    - executes server-only logic at module top level
//    - app/lib/source.ts (imports collections/server → fumadocs-mdx/runtime/server.js → node:path)
//
// 3. Why:
//    This barrel is imported by 30+ UI/component files via `import { cn } from "@/lib"`.
//    Any server-only export here will leak node:path into the client bundle.
//
// 4. If you need source:
//    Use `import { source } from "@/lib/source"` directly.
//    Do NOT add it to this barrel.
export * from "./class-name";
export * from "./i18n";
export * from "./layout.shared";
export * from "./markdown-url";
export * from "./shared";
