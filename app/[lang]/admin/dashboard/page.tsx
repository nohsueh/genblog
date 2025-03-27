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

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} isAdmin={true} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <AdminDashboard
          lang={lang}
          dictionary={dictionary}
          groupName={process.env.SEARCHLYSIS_BLOG_ROOT_DOMAIN || "searchlysis"}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
