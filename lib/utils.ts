import { Content } from "@/types/api";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { i18n, type Locale } from "./i18n-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string,
  locale: Locale = i18n.defaultLocale,
) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getPaginationRange(
  current: number,
  total: number,
  siblingCount: number = 2,
) {
  const totalPageNumbers = siblingCount * 2 + 5;
  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  const leftSibling = Math.max(current - siblingCount, 2);
  const rightSibling = Math.min(current + siblingCount, total - 1);

  pages.push(1);
  if (leftSibling > 2) {
    pages.push("...");
  }
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }
  if (rightSibling < total - 1) {
    pages.push("...");
  }
  return pages;
}

export function getGroupName() {
  return getBaseUrl();
}

export function getBaseUrl() {
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const BASE_URL = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${BASE_PATH}`;
  return BASE_URL;
}

export function getDefaultImage() {
  return `${getBaseUrl()}/logo.svg`;
}

export function encode(data: string) {
  return btoa(data).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function getAppType(): "blog" | "directory" {
  switch (process.env.NEXT_PUBLIC_APP_TYPE) {
    case "blog":
      return "blog";
    case "directory":
      return "directory";
    default:
      return "blog";
  }
}

export function extractContent(content: Content | null) {
  const articleLines = content?.article
    ?.split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return articleLines || [];
}
