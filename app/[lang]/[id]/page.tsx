import { BlogPost } from "@/components/blog-post";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminSession, getAnalysis } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultImage } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}) {
  try {
    const { lang, id } = await params;
    const [dictionary, isLoggedIn, post] = await Promise.all([
      getDictionary(lang),
      checkAdminSession(),
      getAnalysis(id),
    ]);

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader lang={lang} dictionary={dictionary} isAdmin={isLoggedIn} />
        <main className="container mb-48 flex-1 px-4 py-6">
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; id: string }>;
}): Promise<Metadata> {
  const { id, lang } = await params;
  const post = await getAnalysis(id);

  const contentLines = post.analysis?.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
  const title =
    contentLines?.[0].replace(/^#+\s*/, "") +
    " - " +
    process.env.NEXT_PUBLIC_APP_NAME;
  const description = contentLines
    ?.slice(1)
    .find((line) => !line.startsWith("!["));

  let images = post.analysis?.image || "";
  try {
    const res = await fetch(images, {
      method: "HEAD",
      next: { revalidate: 2 },
    });
    const contentType = res.headers.get("Content-Type") || "";
    images =
      res.ok && contentType.startsWith("image")
        ? (post.analysis?.image as string)
        : getDefaultImage();
  } catch (err) {
    images = getDefaultImage();
  }

  const canonical = `${getBaseUrl()}/${lang}/${id}`;

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
