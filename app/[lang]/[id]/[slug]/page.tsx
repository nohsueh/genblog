import { BlogPost } from "@/components/blog-post";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminCookie, getAnalysis, validateImage } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { extractContent, getBaseUrl } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;

type Props = {
  lang: Locale;
  id: string;
  slug: String;
};

export default async function BlogPage({ params }: { params: Promise<Props> }) {
  try {
    const { lang, id } = await params;
    const [dictionary, isLoggedIn] = await Promise.all([
      getDictionary(lang),
      checkAdminCookie(),
    ]);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader language={lang} dictionary={dictionary} isAdmin={isLoggedIn} />
        <main className="container mb-48 flex-1 px-4 py-6">
          <Suspense
            fallback={
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            }
          >
            <BlogPost analysisId={id} lang={lang} dictionary={dictionary} />
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Props>;
}): Promise<Metadata> {
  const { id, lang, slug } = await params;
  const post = await getAnalysis(id);

  const articleLines = extractContent(post.jsonContent);
  const title =
    articleLines[0].replace(/^#+\s+|\*+/g, "") +
    " - " +
    process.env.NEXT_PUBLIC_APP_NAME;
  const description = articleLines
    ?.slice(1)
    .find((line) => !line.startsWith("!["));

  const images = await validateImage(post.analysis.image || "");

  const canonical = `${getBaseUrl()}/${lang}/${id}/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images,
    },
    twitter: {
      title,
      description,
      images,
    },
    alternates: {
      canonical,
    },
  };
}
