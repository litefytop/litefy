import { route, type RouteConfig } from '@react-router/dev/routes';

export default [
  // 根路径自动跳转到默认语言
  route('', 'routes/root.tsx'),
  
  // 所有路径都需要语言前缀
  route(':lang/docs/*', 'routes/docs.tsx'),
  route(':lang/api/search', 'routes/search.ts'),

  // LLM integration:
  route(':lang/llms.txt', 'llms/index.ts'),
  route(':lang/llms-full.txt', 'llms/full.ts'),
  route(':lang/llms.mdx/docs/*', 'llms/mdx.ts'),

  // 首页和 404
  route(':lang', 'routes/home.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
