export const i18n = {
  defaultLocale: "en",
  locales: ["en", "es", "de", "ja", "fr", "zh"],
};

export type Locale = (typeof i18n)["locales"][number];
