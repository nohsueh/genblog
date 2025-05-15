import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteList } from "@/components/site-list";
import { checkAdminCookie } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getAppType, getBaseUrl, getDefaultImage, getGroup } from "@/lib/utils";
import { Metadata } from "next";

export const revalidate = 3600;

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ language: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { language } = await params;
  const dictionary = await getDictionary(language);
  const isAdmin = await checkAdminCookie();
  const description =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    `${dictionary.home.title} - ${dictionary.home.description}`;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        language={language}
        dictionary={dictionary}
        isAdmin={isAdmin}
      />
      <header className="flex w-full flex-col items-center justify-center px-2 py-8">
        <h2 className="text-2xl md:text-4xl">{description}</h2>
      </header>
      <main className="container flex-1 px-4 py-6">
        {getAppType() === "blog" && (
          <BlogList
            language={language}
            dictionary={dictionary}
            group={getGroup()}
            searchParams={await searchParams}
          />
        )}
        {getAppType() === "directory" && (
          <SiteList
            language={language}
            dictionary={dictionary}
            group={getGroup()}
            searchParams={await searchParams}
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ language: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { language } = await params;
  const page = Number((await searchParams).page || 1);
  const dictionary = await getDictionary(language);

  const title = process.env.NEXT_PUBLIC_APP_NAME;
  const description =
    process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
    `${dictionary.home.title} - ${dictionary.home.description}`;
  const images = getDefaultImage();

  const canonical = `${getBaseUrl()}/${language}?page=${page}`;

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
