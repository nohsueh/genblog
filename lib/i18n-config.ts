export const i18n = {
  defaultLocale: "en",
  locales: ["en", "fr", "es", "de", "ja", "zh"],
};

export type Locale = (typeof i18n)["locales"][number];
