import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import logoRaw from "../assets/logo.svg?raw";
import { i18n } from "../lib/i18n";
import { appName, gitConfig } from "../lib/shared";
export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add("ui", {
    en: {
      displayName: "English",
    },
    zh: {
      displayName: "中文",
      search: "搜索文档",
    },
  });

export function baseOptions(_currentLocale: string): BaseLayoutProps {
  return {
    nav: {
      title: (
        <div className="flex items-center gap-2">
          <div dangerouslySetInnerHTML={{ __html: logoRaw }} className="fill-foreground size-8" />
          {appName}
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
