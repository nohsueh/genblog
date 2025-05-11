import { i18n } from "@/lib/i18n-config";
import { permanentRedirect } from "next/navigation";

export default function HomePage() {
  // Redirect to the default locale
  permanentRedirect(`/${i18n.defaultLocale}`);
}
