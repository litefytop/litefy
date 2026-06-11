import { redirect } from 'react-router';
import type { Route } from './+types/root';

// 从 localStorage 读取用户上次选择的语言，默认为英文
function getPreferredLanguage(): string {
  // 服务端渲染时返回默认语言
  if (typeof window === 'undefined') {
    return 'en';
  }
  
  try {
    const stored = localStorage.getItem('preferred-language');
    if (stored && ['en', 'zh'].includes(stored)) {
      return stored;
    }
  } catch (e) {
    // localStorage 不可用时使用默认语言
  }
  
  return 'en';
}

export async function loader({}: Route.LoaderArgs) {
  const lang = getPreferredLanguage();
  return redirect(`/${lang}`);
}

export default function Root() {
  // 这个组件不会被渲染，因为 loader 会重定向
  return null;
}
