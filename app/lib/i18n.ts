import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  languages: ['en', 'zh'],
  defaultLanguage: 'en',
  parser: 'dot', // 使用 .zh 后缀解析
  fallbackLanguage: 'en', // 如果中文不存在，回退到英文
});
