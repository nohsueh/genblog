import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./i18n-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale: Locale = "en") {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function getPaginationRange(current: number, total: number, siblingCount: number = 2) {
  const totalPageNumbers = siblingCount * 2 + 5; // 首页+末页+当前+两侧+siblingCount
  if (total <= totalPageNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages: (number | string)[] = [];
  const leftSibling = Math.max(current - siblingCount, 2);
  const rightSibling = Math.min(current + siblingCount, total - 1);

  pages.push(1);
  if (leftSibling > 2) pages.push('...');
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }
  if (rightSibling < total - 1) pages.push('...');
  pages.push(total);
  return pages;
}