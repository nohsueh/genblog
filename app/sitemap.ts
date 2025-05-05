import { listAnalysesIds } from "@/lib/actions";
import { i18n } from "@/lib/i18n-config";
import { getBaseUrl, getGroupName } from "@/lib/utils";
import type { MetadataRoute } from "next";

export async function generateSitemaps() {
  return i18n.locales.map((locale) => ({
    id: locale,
  }));
}

export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const CURRENT_DATE = new Date().toISOString();
  const analyses = await listAnalysesIds(1, 49999, {
    group: getGroupName(),
    language: id,
  });

  return [
    {
      url: `${getBaseUrl()}/${id}`,
    },
    ...analyses.map((analysis) => ({
      url: `${getBaseUrl()}/${id}/${analysis.analysisId}`,
    })),
  ];
}
