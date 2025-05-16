import { BlogCreator } from "@/components/blog-creator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { requireAdmin } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getGroup } from "@/lib/utils";
import { Metadata } from "next";

export default async function CreateBlogPage({
  params,
}: {
  params: Promise<{ language: Locale }>;
}) {
  const { language } = await params;

  // This will redirect if not authenticated
  await requireAdmin(language);

  const dictionary = await getDictionary(language);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader language={language} dictionary={dictionary} isAdmin={true} />
      <main className="container mx-auto flex-1 px-4 py-6">
        <BlogCreator
          group={getGroup()}
          language={language}
          dictionary={dictionary}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Edit",
  robots: {
    index: false,
    follow: false,
  },
};
