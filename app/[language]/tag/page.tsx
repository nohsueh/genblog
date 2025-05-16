import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";
import { permanentRedirect } from "next/navigation";

type Props = {
  language: Locale;
};

export default async function TagPage({ params }: { params: Promise<Props> }) {
  const { language } = await params;

  permanentRedirect(`${getBaseUrl()}/${language}`);
}
