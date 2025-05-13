import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminCookie } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { Params } from "next/dist/server/request/params";
import { notFound } from "next/navigation";

interface Props extends Params {
  language: Locale;
  tag: string;
}

export default async function TagPage({ params }: { params: Promise<Props> }) {
  try {
    const { language, tag } = await params;
    const [dictionary, isAdmin] = await Promise.all([
      getDictionary(language),
      checkAdminCookie(),
    ]);

    const decodedTag = decodeURIComponent(tag);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader
          language={language}
          dictionary={dictionary}
          isAdmin={isAdmin}
        />
        <main className="container flex-1 px-4 py-6">
          <h1 className="mb-6 text-3xl font-bold">
            {dictionary.blog.tag} {decodedTag}
          </h1>
          <BlogList
            language={language}
            dictionary={dictionary}
            searchParams={{ tags: [decodedTag] }}
          />
        </main>
        <SiteFooter />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
