import { i18n } from "@/lib/i18n-config";
import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to the default locale
  redirect(`/${i18n.defaultLocale}`);
}
