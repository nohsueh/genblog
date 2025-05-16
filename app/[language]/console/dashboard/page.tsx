import { requireAdmin } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { permanentRedirect } from "next/navigation";

export default async function DashboardPage(props: {
  params: Promise<{ language: Locale }>;
}) {
  const { language } = await props.params;

  // This will redirect if not authenticated
  await requireAdmin(language);

  permanentRedirect(`/${language}/console/dashboard/1`);
}
