import type { Locale } from "@/lib/i18n-config";
import { getDictionary } from "@/lib/dictionaries";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { BlogCreator } from "@/components/blog-creator";
import { requireAdmin } from "@/lib/actions";

export default async function CreateBlogPage(props: {
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
      <main className="container mx-auto flex-1 px-4 py-6">
        <BlogCreator
          dictionary={dictionary}
          groupName={process.env.NEXT_PUBLIC_ROOT_DOMAIN || "searchlysis.com"}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
