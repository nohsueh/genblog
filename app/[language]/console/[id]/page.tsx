import { getAnalysis, requireAdmin } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";
import { Analysis } from "@/types/api";
import { notFound, permanentRedirect } from "next/navigation";

export default async function EditBlogPage(props: {
  params: Promise<{ language: Locale; id: string }>;
}) {
  const { language, id } = await props.params;

  // This will redirect if not authenticated
  await requireAdmin(language);

  let post: Analysis;
  try {
    post = await getAnalysis(id);
  } catch (error) {
    console.error(error);
    return notFound();
  }
  permanentRedirect(
    `${getBaseUrl()}/${language}/console/${id}/${encodeURIComponent(post.jsonContent?.slug || "")}`,
  );
}
