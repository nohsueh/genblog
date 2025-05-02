import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminSession } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultImage, getGroupName } from "@/lib/utils";
import { Metadata } from "next";

export const revalidate = 3600;

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const isLoggedIn = await checkAdminSession();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} isAdmin={isLoggedIn} />
      <main className="container flex-1 px-4 py-6">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              {dictionary.home.title}
            </h1>
            <h2 className="max-w-[700px] text-lg text-muted-foreground">
              {dictionary.home.description}
            </h2>
          </div>
        </section>

        <BlogList
          lang={lang}
          dictionary={dictionary}
          group={getGroupName()}
          searchParams={await searchParams}
        />
      </main>
      <SiteFooter />
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  const title = process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    `${dictionary.home.title} - ${dictionary.home.description}`;
  const images = getDefaultImage();

  const canonicalUrl = `${getBaseUrl()}/${lang}`;

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
      canonical: canonicalUrl,
    },
  };
}
