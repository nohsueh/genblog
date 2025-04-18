import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdmin } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";

export default async function AdminDashboardPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { lang } = params;

  // This will redirect if not authenticated
  await requireAdmin(lang);

  const dictionary = getDictionary(lang);

  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const BASE_URL = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${BASE_PATH}`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} isAdmin={true} />
      <main className="container mx-auto flex-1 px-4 py-6">
        <AdminDashboard
          lang={lang}
          dictionary={dictionary}
          groupName={BASE_URL}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
