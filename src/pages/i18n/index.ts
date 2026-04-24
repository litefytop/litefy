import { zh } from "./zh";
import { en } from "./en";

export type LocaleType = "zh" | "en";

const locales = { zh, en };

export function t(locale?: LocaleType) {
  const currentLocale = locale || "zh";
  return locales[currentLocale];
}

export { zh, en };
