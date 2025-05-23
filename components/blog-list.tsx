import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFilteredAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate, getBaseUrl, getDefaultImage } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import { AnalysesPagination } from "./analyses-pagination";
import ImageWithFallback from "./image-with-fallback";
import { TagCloud } from "./tag-cloud";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export const PAGE_SIZE = 24;

interface BlogListProps {
  language: Locale;
  dictionary: any;
  group?: string;
  tags?: string[];
  page?: number;
}

async function BlogListContent({
  language,
  dictionary,
  group,
  tags,
  page = 1,
}: BlogListProps) {
  const blogs = await getFilteredAnalyses({
    pageNum: page,
    pageSize: PAGE_SIZE,
    selectFields: ["jsonContent", "analysis", "updatedAt", "analysisId"],
    group,
    language,
    tags,
  });

  const totalCount = blogs?.[0]?.totalCount || 0;

  return blogs.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">{dictionary.blog.noPosts}</p>
    </div>
  ) : (
    <div>
      <div className="mb-8 px-5">
        <TagCloud analyses={blogs} language={language} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => {
          const title = blog.jsonContent?.title || blog.analysis.title;
          const overview = blog.jsonContent?.overview || "";
          const image = blog.analysis.image || getDefaultImage();
          const author = blog.analysis.author;
          const updatedAt = blog.updatedAt;

          return (
            <HoverCard key={blog.analysisId}>
              <HoverCardTrigger>
                <Link
                  href={`${getBaseUrl()}/${language}/${blog.analysisId}${blog.jsonContent?.slug && `/${encodeURIComponent(blog.jsonContent?.slug)}`}`}
                  key={blog.analysisId}
                >
                  <Card className="flex flex-col overflow-hidden break-all border-2 border-transparent shadow-md transition-colors hover:border-primary/50 hover:shadow-lg dark:bg-accent/50">
                    <CardHeader className="p-0">
                      <div className="relative aspect-video overflow-hidden">
                        <ImageWithFallback
                          src={image}
                          fallback={getDefaultImage()}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pb-0">
                      <CardTitle>
                        <h3 className="mb-2 line-clamp-2 text-base">{title}</h3>
                      </CardTitle>
                      <CardDescription>
                        <h4 className="mb-2 line-clamp-3 text-ellipsis text-sm text-muted-foreground">
                          {overview}
                        </h4>
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <div className="text-xs text-muted-foreground">
                        {updatedAt && <>{formatDate(updatedAt, language)}</>}
                        {author && (
                          <>
                            {" "}
                            {dictionary.blog.by} {author}
                          </>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="max-w-96">
                <TagCloud analyses={[blog]} language={language} />
              </HoverCardContent>
            </HoverCard>
          );
        })}
      </div>

      <AnalysesPagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}

export function BlogList(props: BlogListProps) {
  return (
    <Suspense
      fallback={
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE / 2 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-video" />
              </CardHeader>
              <CardContent className="p-4 pb-0">
                <Skeleton className="my-[4px] h-[16px] w-full" />
                <Skeleton className="my-[4px] mb-2 h-[16px] w-3/4" />
                <Skeleton className="my-[3px] h-[14px] w-full" />
                <Skeleton className="my-[3px] h-[14px] w-full" />
                <Skeleton className="my-[3px] mb-2 h-[14px] w-3/4" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="my-[2px] h-[12px] w-1/2" />
              </CardFooter>
            </Card>
          ))}
        </div>
      }
    >
      <BlogListContent {...props} />
    </Suspense>
  );
}
