import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Locale } from "./i18n-config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale: Locale = "en") {
  const date = new Date(dateString)

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

