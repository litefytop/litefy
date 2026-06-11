import type { LoaderFunctionArgs } from 'react-router';
import { getLLMText, source } from '@/lib/source';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const locale = params.lang || 'en';
  const slug = params['*'] || '';
  const slugs = slug.split('/').filter((v) => v.length > 0);
  
  console.log('[LLM MDX] params:', params);
  console.log('[LLM MDX] locale:', locale);
  console.log('[LLM MDX] slug:', slug);
  console.log('[LLM MDX] slugs:', slugs);
  
  const page = source.getPage(slugs, locale);
  console.log('[LLM MDX] page found:', !!page, page?.url);
  
  if (!page) {
    return new Response('not found', { status: 404 });
  }
  
  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}
