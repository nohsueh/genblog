import de from "./dictionaries/de";
import en from "./dictionaries/en";
import es from "./dictionaries/es";
import fr from "./dictionaries/fr";
import ja from "./dictionaries/ja";
import zh from "./dictionaries/zh";
import { Locale } from "./i18n-config";

const dictionaries = {
  en: en,
  es: es,
  de: de,
  ja: ja,
  fr: fr,
  zh: zh,
} as const;

export const getDictionary = (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries];
