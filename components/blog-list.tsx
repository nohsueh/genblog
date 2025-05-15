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
import type { Analysis } from "@/types/api";
import Link from "next/link";
import { Suspense } from "react";
import { AnalysesPagination } from "./analyses-pagination";
import ImageWithFallback from "./image-with-fallback";
import { TagCloud } from "./tag-cloud";

const PAGE_SIZE = 12;

interface BlogListProps {
  language: Locale;
  dictionary: any;
  group?: string;
  tags?: string[];
  searchParams: { [key: string]: string | string[] | undefined };
}

function getTagFrequency(blogs: Analysis[]) {
  const tagFreq: { [key: string]: number } = {};
  blogs.forEach((blog) => {
    const tags = blog.jsonContent?.tags || [];
    tags.forEach((tag: string) => {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1;
    });
  });
  return Object.entries(tagFreq)
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
}

async function BlogListContent({
  language,
  dictionary,
  group,
  tags,
  searchParams,
}: BlogListProps) {
  const currentPage = Number(searchParams.page || 1);

  const blogs = await getFilteredAnalyses({
    pageNum: currentPage,
    pageSize: PAGE_SIZE,
    selectFields: ["jsonContent", "analysis", "updatedAt", "analysisId"],
    group,
    language,
    tags,
  });

  const totalCount = blogs?.[0]?.totalCount || 0;

  return blogs.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">{dictionary.blog.noBlogs}</p>
    </div>
  ) : (
    <div>
      <TagCloud analyses={blogs} language={language} dictionary={dictionary} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => {
          const title = blog.jsonContent?.title || blog.analysis.title;
          const overview = blog.jsonContent?.overview || "";
          const image = blog.analysis.image || getDefaultImage();
          const author = blog.analysis.author;
          const updatedAt = blog.updatedAt;

          return (
            <Link
              href={`${getBaseUrl()}/${language}/${blog.analysisId}/${encodeURIComponent(blog.jsonContent?.slug || "")}`}
              key={blog.analysisId}
            >
              <Card className="flex flex-col overflow-hidden border-2 border-transparent shadow-md transition-colors hover:border-primary/50 hover:shadow-lg dark:bg-accent/50">
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
