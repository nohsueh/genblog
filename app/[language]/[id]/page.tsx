import { getAnalysis } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";
import { Analysis } from "@/types/api";
import { notFound, permanentRedirect } from "next/navigation";

type Props = {
  language: Locale;
  id: string;
};

export default async function PostPage({ params }: { params: Promise<Props> }) {
  const { language, id } = await params;
  let post: Analysis;
  try {
    post = await getAnalysis(id);
  } catch (error) {
    console.error(`PostPage getAnalysis: ${error}`);
    return notFound();
  }
  permanentRedirect(
    `${getBaseUrl()}/${language}/${id}${post.jsonContent?.slug ? `/${encodeURIComponent(post.jsonContent?.slug)}` : ""}`,
  );
}
