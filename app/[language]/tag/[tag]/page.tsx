import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteList } from "@/components/site-list";
import { Badge } from "@/components/ui/badge";
import { checkAdminCookie } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";
import { getAppType, getBaseUrl, getDefaultImage, getGroup } from "@/lib/utils";
import { Metadata } from "next";
import { Params } from "next/dist/server/request/params";
import { notFound } from "next/navigation";

interface Props extends Params {
  language: Locale;
  tag: string;
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<Props>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  try {
    const { language, tag } = await params;
    const [dictionary, isAdmin] = await Promise.all([
      getDictionary(language),
      checkAdminCookie(),
    ]);
    const decodedTag = decodeURIComponent(tag);
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
        <main className="container flex-1 px-4 py-6">
          <header className="flex w-full flex-col items-center justify-center px-2 py-8">
            <h2 className="text-center text-2xl font-bold md:text-4xl">
              {description}
            </h2>
          </header>
          <div className="mb-6 flex flex-col items-start justify-center gap-2">
            <Badge variant={"secondary"} className="px-5 py-1">
              <h1 className="text-3xl font-bold">{decodedTag}</h1>
            </Badge>
          </div>
          {getAppType() === "blog" && (
            <BlogList
              language={language}
              dictionary={dictionary}
              group={getGroup()}
              tags={[decodedTag]}
              searchParams={await searchParams}
            />
          )}
          {getAppType() === "directory" && (
            <SiteList
              language={language}
              dictionary={dictionary}
              group={getGroup()}
              tags={[decodedTag]}
              searchParams={await searchParams}
            />
          )}
        </main>
        <SiteFooter />
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Props>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { language, tag } = await params;
  const { page } = await searchParams;
  const dictionary = await getDictionary(language);
  const decodedTag = decodeURIComponent(tag);
  const title = `${decodedTag} - ${process.env.NEXT_PUBLIC_APP_NAME}`;
  const description = `${decodedTag} - ${dictionary.tag.description}`;
  const images = getDefaultImage();
  const canonical = `${getBaseUrl()}/${language}/tag/${decodedTag}?page=${page}`;

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
