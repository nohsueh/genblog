import { AdminDashboard } from "@/components/admin-dashboard";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdmin } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getGroupName } from "@/lib/utils";

export default async function DashboardPage(props: {
  params: Promise<{ language: Locale }>;
}) {
  const { language } = await props.params;

  // This will redirect if not authenticated
  await requireAdmin(language);

  const dictionary = await getDictionary(language);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader language={language} dictionary={dictionary} isAdmin={true} />
      <main className="container mx-auto flex-1 px-4 py-6">
        <AdminDashboard
          language={language}
          dictionary={dictionary}
          groupName={getGroupName()}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
