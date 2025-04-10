import { listAnalyses } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const analysesIds = (
    await listAnalyses(1, 10000, { group: process.env.NEXT_PUBLIC_ROOT_DOMAIN })
  ).map((analysis) => analysis.analysisId);

  return [i18n.defaultLocale].flatMap((locale) => [
    {
      url: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/${locale}`,
    },
    ...analysesIds.map((analysisId) => ({
      url: `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/blog/${locale}/${analysisId}`,
    })),
  ]);
}
