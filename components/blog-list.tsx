import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n-config";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { getPublishedBlogs } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface BlogListProps {
  lang: Locale;
  dictionary: any;
  group?: string;
}

async function BlogListContent({ lang, dictionary, group }: BlogListProps) {
  const { blogs, total } = await getPublishedBlogs(1, 20, group);

  if (blogs.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">{dictionary.blog.noBlogs}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogs.map((post) => (
          <Card key={post.analysisId} className="overflow-hidden">
            <CardHeader className="p-0">
              {post.analysis.image ? (
                <div className="aspect-video relative overflow-hidden">
                  <Image
                    src={post.analysis.image || "/placeholder.svg"}
                    alt={post.analysis.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="line-clamp-2 mb-2">
                <Link
                  href={`/${lang}/blog/${post.analysisId}`}
                  className="hover:underline"
                >
                  {post.analysis.title}
                </Link>
              </CardTitle>
              <div className="flex items-center gap-2 mb-2">
                {post.metadata?.group && (
                  <Badge variant="outline">{post.metadata.group}</Badge>
                )}
              </div>
              <div className="line-clamp-3 text-sm text-muted-foreground mb-2">
                {post.analysis.content.substring(0, 150)}...
              </div>
              <div className="text-xs text-muted-foreground">
                {post.analysis.publishedDate && (
                  <>
                    {dictionary.blog.publishedOn}{" "}
                    {formatDate(post.analysis.publishedDate, lang)}
                  </>
                )}
                {post.analysis.author && (
                  <>
                    {" "}
                    {dictionary.blog.by} {post.analysis.author}
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Link
                href={`/${lang}/blog/${post.analysisId}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {dictionary.blog.readMore}
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {total > 20 && (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink href={`?page=${i + 1}`}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-video" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-4 w-24" />
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
