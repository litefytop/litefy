import type { Route } from './+types/home';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link, useParams, useNavigate } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { useEffect } from 'react';
import { Code2 } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Fumadocs on React Router' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const params = useParams<{ lang: string }>();
  const locale = params.lang || i18n.defaultLanguage;
  const docsPath = `/${locale}/docs`;

  // 保存用户选择的语言到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && params.lang) {
      localStorage.setItem('preferred-language', params.lang);
    }
  }, [params.lang]);

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Fumadocs on React Router.</h1>
        <p className="text-fd-muted-foreground mb-4">
          The truly flexible docs framework on React.js.
        </p>
        
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={docsPath}
        >
          Open Docs
        </Link>
        
        {/* Playground 占位区域 */}
        <div className="mt-12 w-full max-w-4xl">
          <div className="border-2 border-dashed rounded-lg p-12 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">
                {locale === 'zh' ? 'Playground（开发中）' : 'Playground (Coming Soon)'}
              </h2>
              <p className="text-fd-muted-foreground">
                {locale === 'zh' 
                  ? '这里将是组件的交互式演示区域，敬请期待！' 
                  : 'This will be an interactive demo area for components. Stay tuned!'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
