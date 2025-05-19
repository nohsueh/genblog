import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";
import { permanentRedirect } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  return [];
}

type Props = {
  language: Locale;
  id: string;
  slug: string;
};

export default async function PostPage({ params }: { params: Promise<Props> }) {
  const { language, id } = await params;

  permanentRedirect(`${getBaseUrl()}/${language}/console/edit/${id}`);
}
