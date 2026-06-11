import type { Route } from './+types/not-found';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Link, useParams, useNavigate } from 'react-router';
import { baseOptions } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';
import { useEffect } from 'react';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Not Found' }];
}

export default function NotFound() {
  const params = useParams<{ lang: string }>();
  const navigate = useNavigate();
  const locale = params.lang || i18n.defaultLanguage;
  const docsPath = `/${locale}/docs`;

  // 保存用户选择的语言到 localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && params.lang) {
      localStorage.setItem('preferred-language', params.lang);
    }
  }, [params.lang]);

  // 语言切换处理
  const handleLanguageChange = (newLang: string) => {
    navigate(`/${newLang}`);
  };

  return (
    <HomeLayout {...baseOptions(locale)}>
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Not Found</h1>
        <p className="text-fd-muted-foreground mb-4">This page could not be found.</p>
        
        {/* 语言切换器 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleLanguageChange('en')}
            className={`px-4 py-2 rounded ${locale === 'en' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('zh')}
            className={`px-4 py-2 rounded ${locale === 'zh' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
          >
            中文
          </button>
        </div>
        
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground rounded-full font-medium px-4 py-2.5"
          to={docsPath}
        >
          Back to Docs
        </Link>
      </div>
    </HomeLayout>
  );
}
