import { BlogPost } from "@/components/blog-post";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getAnalysis } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

export default async function BlogPage(props: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  const params = await props.params;

  const { lang, id } = params;

  const dictionary = getDictionary(lang);

  try {
    const post = await getCachedAnalysis(id);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader lang={lang} dictionary={dictionary} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <BlogPost post={post} lang={lang} dictionary={dictionary} />
        </main>
        <SiteFooter />
      </div>
    );
  } catch (error) {
    console.error(error);
    return notFound();
  }
}

const getCachedAnalysis = cache(getAnalysis);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getCachedAnalysis(id);

  const contentLines = post.analysis.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const title = contentLines[0].replace(/^#+\s*/, "") ?? post.analysis.title;
  const description = contentLines[1] ?? post.analysis.title;
  const images = post.analysis.image;

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
