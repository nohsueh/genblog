import { redirect } from "next/navigation";
import { i18n } from "@/lib/i18n-config";
import { headers } from "next/headers";

export default async function Home() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";

  // Check if the pathname already contains a language parameter
  const hasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!hasLocale) {
    // Only redirect if there is no language parameter
    redirect(`/${i18n.defaultLocale}`);
  }

  return null;
}
