import { getAnalysis, validateImage } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";
import { AnalysisResult } from "@/types/api";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 86400;

type Props = {
  lang: Locale;
  id: string;
};

export default async function BlogPage({ params }: { params: Promise<Props> }) {
  const { lang, id } = await params;
  let post: AnalysisResult;
  try {
    post = await getAnalysis(id);
  } catch (error) {
    console.error(`BlogPage getAnalysis: ${error}`);
    return notFound();
  }
  permanentRedirect(`${getBaseUrl()}/${lang}/${id}/${post.slug || ""}`);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Props>;
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

  let images = await validateImage(post.analysis?.image || "");

  const canonical = `${getBaseUrl()}/${lang}/${id}/${post.slug || ""}`;

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
