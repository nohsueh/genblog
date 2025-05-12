import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { checkAdminCookie } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultImage, getGroupName } from "@/lib/utils";
import { Metadata } from "next";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const isLoggedIn = await checkAdminCookie();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} isAdmin={isLoggedIn} />
      <main className="container flex-1 px-4 py-6">
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
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const page = Number((await searchParams).page || 1);
  const dictionary = await getDictionary(lang);

  const title = process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    `${dictionary.home.title} - ${dictionary.home.description}`;
  const images = getDefaultImage();

  const canonical = `${getBaseUrl()}/${lang}?page=${page}`;

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
