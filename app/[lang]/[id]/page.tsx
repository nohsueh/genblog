import { getAnalysis, validateImage } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { extractContent, getBaseUrl } from "@/lib/utils";
import { Analysis } from "@/types/api";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

type Props = {
  lang: Locale;
  id: string;
};

export default async function BlogPage({ params }: { params: Promise<Props> }) {
  const { lang, id } = await params;
  let post: Analysis;
  try {
    post = await getAnalysis(id);
  } catch (error) {
    console.error(`BlogPage getAnalysis: ${error}`);
    return notFound();
  }
  permanentRedirect(`${getBaseUrl()}/${lang}/${id}/${post.jsonContent?.slug || ""}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Props>;
}): Promise<Metadata> {
  const { id, lang } = await params;
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

  const canonical = `${getBaseUrl()}/${lang}/${id}/${post.jsonContent?.slug || ""}`;

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
