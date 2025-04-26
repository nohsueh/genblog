import { listAnalysesIds } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const BASE_URL = `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}${BASE_PATH}`;
  const CURRENT_DATE = new Date();
  const analyses = await listAnalysesIds(1, 10000, { group: BASE_URL });

  return i18n.locales
    .filter((locale) => locale === i18n.defaultLocale)
    .flatMap((locale) => [
      {
        url: `${BASE_URL}/${locale}`,
        lastModified: CURRENT_DATE,
      },
      ...analyses.map((analysis) => ({
        url: `${BASE_URL}/${locale}/${analysis.analysisId}`,
        lastModified: analysis.updatedAt,
      })),
    ]);
}
