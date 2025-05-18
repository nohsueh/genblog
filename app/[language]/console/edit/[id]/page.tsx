import { BlogEditor } from "@/components/post-editor";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAnalysis, requireAdmin } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ language: Locale; id: string }>;
}) {
  const { language, id } = await params;

  // This will redirect if not authenticated
  await requireAdmin(language);

  const dictionary = await getDictionary(language);

  try {
    const post = await getAnalysis(id);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader
          language={language}
          dictionary={dictionary}
          isAdmin={true}
        />
        <main className="container mx-auto flex-1 px-4 py-6">
          <BlogEditor post={post} language={language} dictionary={dictionary} />
        </main>
        <SiteFooter />
      </div>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

export const metadata: Metadata = {
  title: "Edit",
  robots: {
    index: false,
    follow: false,
  },
};
