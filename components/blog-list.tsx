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
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedBlogs } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate, getPaginationRange } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const PAGE_SIZE = 12;

interface BlogListProps {
  lang: Locale;
  dictionary: any;
  group?: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

async function BlogListContent({
  lang,
  dictionary,
  group,
  searchParams,
}: BlogListProps) {
  const currentPage = Number(searchParams.page || 1);

  const { blogs: posts, total } = await getPublishedBlogs(
    currentPage,
    PAGE_SIZE,
    group,
    lang
  );

  return posts.length === 0 ? (
    <div className="py-10 text-center">
      <p className="text-muted-foreground">{dictionary.blog.noBlogs}</p>
    </div>
  ) : (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const contentLines = post.analysis?.content
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line !== "");
          const title =
            contentLines?.[0].replace(/^#+\s*/, "") ||
            post.analysis?.title ||
            "";
          const description = contentLines?.[1];
          const image = post.analysis?.image;
          const author = post.analysis?.author;
          const updatedAt = post.updatedAt;

          return (
            <Link href={`/${lang}/${post.analysisId}`} key={post.analysisId}>
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={
                        image ||
                        `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`
                      }
                      unoptimized
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pb-0">
                  <CardTitle>
                    <h3 className="mb-2 line-clamp-2">{title}</h3>
                  </CardTitle>
                  <CardDescription>
                    <h4 className="mb-2 line-clamp-3 text-sm text-muted-foreground break-all">
                      {description}...
                    </h4>
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">
                    {updatedAt && <>{formatDate(updatedAt, lang)}</>}
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
      {total > PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              {getPaginationRange(
                currentPage,
                Math.ceil(total / PAGE_SIZE)
              ).map((page, idx) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <span className="px-2 text-muted-foreground">...</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <Link href={`?page=${page}`}>
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </Link>
                  </PaginationItem>
                )
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
        <div className="grid sm:gap-2 md:gap-4 lg:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-video" />
              </CardHeader>
              <CardContent className="p-4 pb-0">
                <Skeleton className="mb-2 h-6 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-3/4" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-3 w-1/2" />
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
