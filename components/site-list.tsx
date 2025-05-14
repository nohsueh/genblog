import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedBlogs } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { extractContent, getBaseUrl, getDefaultFavicon } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { BlogPagination } from "./blog-pagination";
import ImageWithFallback from "./image-with-fallback";

const PAGE_SIZE = 24; // More items per page for directory view

interface SiteListProps {
  language: Locale;
  dictionary: any;
  group?: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

async function SiteListContent({
  language,
  dictionary,
  group,
  searchParams,
}: SiteListProps) {
  const currentPage = Number(searchParams.page || 1);

  const sites = await getPublishedBlogs({
    pageNum: currentPage,
    pageSize: PAGE_SIZE,
    selectFields: ["jsonContent", "analysis", "analysisId"],
    group,
    language,
  });

  const totalCount = sites?.[0]?.totalCount || 0;

  return sites.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">{dictionary.blog.noBlogs}</p>
    </div>
  ) : (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {sites.map((site) => {
          const articleLines = extractContent(site.jsonContent);
          const title =
            site.analysis.title ||
            articleLines[0]?.replace(/^#+\s+|\*+/g, "") ||
            "No Title";

          return (
            <div key={site.analysisId} className="group relative">
              {/* External link button */}
              {site.analysis.url && (
                <a
                  href={site.analysis.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1.5 opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                  title={dictionary.site.openExternal}
                >
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}

              <Link
                href={`${getBaseUrl()}/${language}/${site.analysisId}/${encodeURIComponent(site.jsonContent?.slug || "")}`}
              >
                <Card className="group flex h-full flex-col overflow-hidden border-2 border-transparent transition-colors hover:border-primary/50">
                  <CardContent className="flex flex-col items-center gap-3 p-4">
                    <div className="relative h-8 w-8">
                      <ImageWithFallback
                        src={site.analysis.favicon || getDefaultFavicon()}
                        fallback={getDefaultFavicon()}
                        alt={title}
                        fill
                        className="rounded-md object-contain"
                      />
                    </div>
                    <CardTitle>
                      <h3 className="line-clamp-2 text-center text-sm font-medium">
                        {title}
                      </h3>
                    </CardTitle>
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>

      <BlogPagination
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="flex flex-col items-center gap-3 p-4">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))}
        </div>
      }
    >
      <SiteListContent {...props} />
    </Suspense>
  );
}
