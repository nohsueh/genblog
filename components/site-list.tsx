import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
          <h2 className="mb-4 text-xl font-bold">{dictionary.blog.tagCloud}</h2>
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

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sites.map((site) => {
          const title = site.analysis.title;
          const favicon = site.analysis.favicon || getDefaultFavicon();
          const url = site.analysis.url;
          return (
            <Link
              href={`${getBaseUrl()}/${language}/${site.analysisId}/${encodeURIComponent(site.jsonContent?.slug || "")}`}
              key={site.analysisId}
              className="group"
            >
              <Card className="flex flex-col overflow-hidden border-2 border-transparent transition-colors hover:border-primary/50 focus:border-primary/50 active:border-primary/50 dark:hover:bg-accent/50 dark:focus:bg-accent/50 dark:active:bg-accent/50">
                <CardContent className="flex items-start gap-3 p-4">
                  <Link
                    href={url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="shrink-0 opacity-90 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100"
                  >
                    <ImageWithFallback
                      src={favicon}
                      fallback={getDefaultFavicon()}
                      alt={title}
                      width={32}
                      height={32}
                    />
                  </Link>
                  <h3 className="line-clamp-3 text-sm font-medium">{title}</h3>
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
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE / 2 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="flex items-start p-4">
                <Skeleton className="size-8" />
                <div>
                  <Skeleton className="my-[4px] h-[16px] w-full" />
                  <Skeleton className="my-[4px] h-[16px] w-full" />
                  <Skeleton className="my-[4px] mb-2 h-[16px] w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      }
    >
      <SiteListContent {...props} />
    </Suspense>
  );
}
