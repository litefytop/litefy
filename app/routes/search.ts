import { createFromSource } from 'fumadocs-core/search/server';
import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';

const server = createFromSource(source, {
  language: 'english',
});

export async function loader({ params }: { params: { lang?: string } }) {
  const locale = params.lang || i18n.defaultLanguage;
  return server.staticGET();
}
