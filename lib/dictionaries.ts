import { Locale } from "./i18n-config";
import en from "./dictionaries/en";
import fr from "./dictionaries/fr";
import es from "./dictionaries/es";
import de from "./dictionaries/de";
import ja from "./dictionaries/ja";
import zh from "./dictionaries/zh";

const dictionaries = {
  en: en,
  fr: fr,
  es: es,
  de: de,
  ja: ja,
  zh: zh,
} as const;

export const getDictionary = (locale: Locale) =>
  dictionaries[locale as keyof typeof dictionaries];
