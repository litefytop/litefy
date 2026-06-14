import { uiTranslations } from "fumadocs-ui/i18n";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import logo from "../assets/logo.svg";
import { i18n } from "./i18n";
import { appName, gitConfig } from "./shared";
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
          <img src={logo} alt="Litefy UI" className="size-5" />
          {appName}
        </div>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
