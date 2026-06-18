import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("", "routes/index.tsx"),

  route(":lang/docs/*", "routes/docs.tsx"),
  route(":lang/api/search", "routes/search.ts"),

  route(":lang/llms.txt", "llms/index.ts"),
  route(":lang/llms-full.txt", "llms/full.ts"),
  route(":lang/llms.mdx/docs/*", "llms/mdx.ts"),

  route(":lang", "routes/home.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
