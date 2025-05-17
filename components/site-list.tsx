import { getFilteredAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultFavicon } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { AnalysesPagination } from "./analyses-pagination";
import ImageWithFallback from "./image-with-fallback";
import { TagCloud } from "./tag-cloud";
import { Card, CardContent } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Skeleton } from "./ui/skeleton";

export const PAGE_SIZE = 48;

interface SiteListProps {
  language: Locale;
  dictionary: any;
  group?: string;
  tags?: string[];
  page?: number;
}

async function SiteListContent({
  language,
  dictionary,
  group,
  tags,
  page = 1,
}: SiteListProps) {
  const sites = await getFilteredAnalyses({
    pageNum: page,
    pageSize: PAGE_SIZE,
    selectFields: ["jsonContent", "analysis", "updatedAt", "analysisId"],
    group,
    language,
    tags,
  });

  const totalCount = sites?.[0]?.totalCount || 0;

  return sites.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">{dictionary.blog.noPosts}</p>
    </div>
  ) : (
    <div>
      <div className="mb-8 px-5">
        <TagCloud analyses={sites} language={language} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sites.map((site) => {
          const name = site.jsonContent?.name;
          const description =
            site.jsonContent?.description || site.analysis.title;
          const favicon = site.analysis.favicon || getDefaultFavicon();

          return (
            <HoverCard key={site.analysisId}>
              <HoverCardTrigger>
                <Link
                  href={`${getBaseUrl()}/${language}/${site.analysisId}/${encodeURIComponent(site.jsonContent?.slug || "")}`}
                  key={site.analysisId}
                  className="group"
                >
                  <Card className="flex h-40 flex-col break-all border-2 border-transparent shadow-md transition-colors hover:border-primary/50 hover:shadow-lg dark:bg-accent/50">
                    <CardContent className="flex h-full flex-col gap-2 p-4">
                      <div className="flex items-center gap-2">
                        <ImageWithFallback
                          src={favicon}
                          fallback={getDefaultFavicon()}
                          alt={description}
                          width={32}
                          height={32}
                          className="shrink-0 opacity-90 group-hover:opacity-100"
                        />
                        <h2 className="text-ellipsis text-base font-bold">
                          {name}
                        </h2>
                      </div>
                      <h3 className="h-full overflow-y-auto text-ellipsis text-sm text-muted-foreground">
                        {description}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="max-w-96">
                <TagCloud analyses={[site]} language={language} />
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>
      <AnalysesPagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        language={language}
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
              className="h-36 border-2 border-transparent p-4 shadow-md transition-colors dark:bg-accent/50"
            >
              <Skeleton className="size-full" />
            </Card>
          ))}
        </div>
      }
    >
      <SiteListContent {...props} />
    </Suspense>
  );
}
