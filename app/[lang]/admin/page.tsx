import { AdminLogin } from "@/components/admin-login";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminSession } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { redirect } from "next/navigation";

export default async function AdminPage(props: {
  params: Promise<{ lang: Locale }>;
}) {
  const params = await props.params;

  const { lang } = params;

  const dictionary = getDictionary(lang);
  const isLoggedIn = await checkAdminSession();

  if (isLoggedIn) {
    redirect(`/${lang}/admin/dashboard`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <AdminLogin lang={lang} dictionary={dictionary} />
      </main>
      <SiteFooter />
    </div>
  );
}
