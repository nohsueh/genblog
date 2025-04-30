import { Locale } from "./i18n-config";

export const getDictionary = async (locale: Locale) =>
  (await import(`./dictionaries/${locale}.json`)).default;
