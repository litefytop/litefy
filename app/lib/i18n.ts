import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  languages: ["en", "zh"],
  defaultLanguage: "en",
  parser: "dot",
  fallbackLanguage: "en",
});

// 站点层默认语言：路由 :lang 缺省或非法时的回显语言；内容层文件约定（无后缀 = en 正本）不随它改动
export const siteDefaultLanguage = "zh";
