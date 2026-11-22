import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("", "routes/index.tsx"),
  route(":lang", "routes/home.tsx"),
  route(":lang/docs/*", "routes/docs.tsx"),
  route(":lang/showcase/:slug", "routes/showcase.tsx"),
  route(":lang/tools/color", "routes/tools-color.tsx"),
  route(":lang/api/search", "routes/search.ts"),

  route("neo/:lang", "routes/neo-home.tsx"),
  route("neo/:lang/showcase/:slug", "routes/neo-showcase.tsx"),
  route("neo/:lang/docs/*", "routes/neo-docs.tsx"),

  route("neon/:lang/docs/*", "routes/neon-docs.tsx"),
  route("neon/:lang/showcase/:slug", "routes/neon-showcase.tsx"),

  route("flat/:lang/docs/*", "routes/flat-docs.tsx"),
  route("flat/:lang/showcase/:slug", "routes/flat-showcase.tsx"),

  route(":lang/llms.txt", "llms/index.ts"),
  route(":lang/llms-full.txt", "llms/full.ts"),
  route(":lang/llms.mdx/docs/*", "llms/mdx.ts"),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
