import { redirect } from "next/navigation";
import { i18n } from "@/lib/i18n-config";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // 检查路径是否已经包含语言参数
  const hasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    // 只有在没有语言参数时才重定向
    redirect(`/${i18n.defaultLocale}`);
  }

  return null;
}
