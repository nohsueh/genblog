import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getFilteredAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultFavicon, getTagFrequency } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { AnalysesPagination } from "./analyses-pagination";
import ImageWithFallback from "./image-with-fallback";

const PAGE_SIZE = 48;

interface SiteListProps {
  language: Locale;
  dictionary: any;
  group?: string;
  tags?: string[];
  searchParams: { [key: string]: string | string[] | undefined };
}

async function SiteListContent({
  language,
  dictionary,
  group,
  tags,
  searchParams,
}: SiteListProps) {
  const currentPage = Number(searchParams.page || 1);

  const sites = await getFilteredAnalyses({
    pageNum: currentPage,
    pageSize: PAGE_SIZE,
    selectFields: ["jsonContent", "analysis", "updatedAt", "analysisId"],
    group,
    language,
    tags,
  });

  const totalCount = sites?.[0]?.totalCount || 0;
  const tagCloud = getTagFrequency(sites);

  return sites.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">{dictionary.blog.noBlogs}</p>
    </div>
  ) : (
    <div>
      {tagCloud.length > 0 && (
        <div className="mb-8 px-5">
          <h2 className="mb-4 text-xl font-bold">
            {dictionary.blog.tagCloudOnThisPage}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tagCloud.slice(0, 10).map(({ tag, count }) => (
              <Link
                key={tag}
                href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
              >
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-accent"
                >
                  {tag}
                  {count > 1 && `(${count})`}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sites.map((site) => {
          const brand = site.jsonContent?.brand;
          const title = site.analysis.title;
          const favicon = site.analysis.favicon || getDefaultFavicon();

          return (
            <Link
              href={`${getBaseUrl()}/${language}/${site.analysisId}/${encodeURIComponent(site.jsonContent?.slug || "")}`}
              key={site.analysisId}
              className="group"
            >
              <Card className="flex h-36 flex-col border-2 border-transparent shadow-md transition-colors hover:border-primary/50 hover:shadow-lg dark:bg-accent/50">
                <CardContent className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center gap-2">
                    <ImageWithFallback
                      src={favicon}
                      fallback={getDefaultFavicon()}
                      alt={title}
                      width={32}
                      height={32}
                      className="shrink-0 opacity-90 group-hover:opacity-100"
                    />
                    <h2 className="text-ellipsis text-base font-bold">
                      {brand}
                    </h2>
                  </div>
                  <h3 className="h-full overflow-y-auto text-ellipsis text-sm font-medium">
                    {title}
                  </h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      <AnalysesPagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}

export function SiteList(props: SiteListProps) {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: PAGE_SIZE / 2 }).map((_, i) => (
            <Card
              key={i}
              className="h-36 border-2 border-transparent shadow-md transition-colors dark:bg-accent/50"
            />
          ))}
        </div>
      }
    >
      <SiteListContent {...props} />
    </Suspense>
  );
}
