import { BlogPost } from "@/components/blog-post";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminSession, getAnalysis } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function BlogPage(props: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const params = await props.params;
  const { lang, id } = params;
  const dictionary = await getDictionary(lang);
  const isLoggedIn = await checkAdminSession();

  try {
    const post = await getAnalysis(id);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader lang={lang} dictionary={dictionary} isAdmin={isLoggedIn} />
        <main className="container mb-48 flex-1 px-4 py-6">
          <Suspense
            fallback={
              <div className="py-10 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            }
          >
            <BlogPost post={post} lang={lang} dictionary={dictionary} />
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
  params: Promise<{ lang: Locale; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getAnalysis(id);

  const contentLines = post.analysis?.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const title =
    contentLines?.[0].replace(/^#+\s*/, "") +
    " - " +
    process.env.NEXT_PUBLIC_APP_NAME;
  const description = contentLines?.[1];
  const images = post.analysis?.image;

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
  };
}
