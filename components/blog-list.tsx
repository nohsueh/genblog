import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedBlogs } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import {
  extractContent,
  formatDate,
  getBaseUrl,
  getDefaultImage,
  getPaginationRange,
} from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import ImageWithFallback from "./image-with-fallback";

const PAGE_SIZE = 12;

interface BlogListProps {
  language: Locale;
  dictionary: any;
  group?: string;
  tags?:string[];
  searchParams: { [key: string]: string | string[] | undefined };
}

async function BlogListContent({
  language,
  dictionary,
  group,
  tags,
  searchParams,
}: BlogListProps) {
  const currentPage = Number(searchParams.page || 1);

  const blogs = await getPublishedBlogs({
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
      <div className="grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-6">
        {blogs.map((blog) => {
          const articleLines = extractContent(blog.jsonContent);
          const title =
            articleLines[0].replace(/^#+\s+|\*+/g, "") ||
            blog.analysis.title ||
            "No Title";
          const description = articleLines
            ?.slice(1)
            .find((line) => !line.startsWith("!["));
          const image = blog.analysis.image || getDefaultImage();
          const author = blog.analysis.author;
          const updatedAt = blog.updatedAt;

          return (
            <Link
              href={`${getBaseUrl()}/${language}/${blog.analysisId}/${blog.jsonContent?.slug || ""}`}
              key={blog.analysisId}
            >
              <Card className="flex flex-col overflow-hidden border-2 border-transparent transition-colors hover:border-primary/50 focus:border-primary/50 active:border-primary/50 dark:hover:bg-accent/50 dark:focus:bg-accent/50 dark:active:bg-accent/50">
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
                    <h4 className="mb-2 line-clamp-3 break-all text-sm text-muted-foreground">
                      {description}...
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
      {totalCount > PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {getPaginationRange(
                currentPage,
                Math.ceil(totalCount / PAGE_SIZE),
              ).map((page, idx) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <Link href={`?page=${page}`}>
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </Link>
                  </PaginationItem>
                ),
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

export function BlogList(props: BlogListProps) {
  return (
    <Suspense
      fallback={
        <div className="grid sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
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
