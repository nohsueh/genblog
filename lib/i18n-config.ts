import { i18n as i18nConfig } from "@/next.config.mjs";

export const i18n = i18nConfig;

export type Locale = (typeof i18n)["locales"][number];
