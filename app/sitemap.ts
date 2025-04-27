import { listAnalysesIds } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import { getBaseUrl, getGroupName } from "@/lib/utils";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const CURRENT_DATE = new Date();
  const analyses = await listAnalysesIds(1, 10000, { group: getGroupName() });

  return i18n.locales
    .filter((locale) => locale === i18n.defaultLocale)
    .flatMap((locale) => [
      {
        url: `${getBaseUrl()}/${locale}`,
        lastModified: CURRENT_DATE,
      },
      ...analyses.map((analysis) => ({
        url: `${getBaseUrl()}/${locale}/${analysis.analysisId}`,
        lastModified: analysis.updatedAt,
      })),
    ]);
}
