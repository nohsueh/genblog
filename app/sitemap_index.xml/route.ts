import { i18n } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";

export async function GET() {
  const dynamicSitemaps = generateSitemaps();
  const sitemaps = [...dynamicSitemaps.map((sitemap) => sitemap.url)];

  const sitemapIndexXML = buildSitemapIndexXML(sitemaps);

  return new Response(sitemapIndexXML, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

function generateSitemaps() {
  const sitemaps = i18n.locales.map((locale) => ({
    id: locale,
    url: `${getBaseUrl()}/sitemap/${locale}.xml`,
  }));

  return sitemaps;
}

function buildSitemapIndexXML(sitemaps: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  sitemaps.forEach((sitemap) => {
    xml += "<sitemap>";
    xml += `<loc>${sitemap}</loc>`;
    xml += "</sitemap>";
  });
  xml += "</sitemapindex>";

  return xml;
}
