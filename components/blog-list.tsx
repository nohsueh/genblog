"use client";

import {
  Card,
  CardContent,
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
import { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const PAGE_SIZE = 12;

interface BlogListProps {
  lang: Locale;
  dictionary: any;
  group?: string;
}

async function BlogListContent({ lang, dictionary, group }: BlogListProps) {
  const [posts, setPosts] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { blogs, total } = await getPublishedBlogs(
          currentPage,
          PAGE_SIZE,
          group
        );
        setPosts(blogs);
        setTotal(total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [group, currentPage, setPosts, setTotal, setLoading]);

  return loading ? (
    <div className="py-10 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
    </div>
  ) : posts.length === 0 ? (
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
          const createdAt = post.createdAt;

          return (
            <Card key={post.analysisId} className="overflow-hidden">
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
              <CardContent className="p-4">
                <CardTitle className="mb-2 line-clamp-2">
                  <Link
                    href={`/${lang}/${post.analysisId}`}
                    className="hover:underline"
                  >
                    {title}
                  </Link>
                </CardTitle>
                <div className="mb-2 line-clamp-3 text-sm text-muted-foreground">
                  {description}...
                </div>
                <div className="text-xs text-muted-foreground">
                  {createdAt && (
                    <>
                      {dictionary.blog.publishedOn}{" "}
                      {formatDate(createdAt, lang)}
                    </>
                  )}
                  {author && (
                    <>
                      {" "}
                      {dictionary.blog.by} {author}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link
                  href={`/${lang}/${post.analysisId}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {dictionary.blog.readMore}
                </Link>
              </CardFooter>
            </Card>
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
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(Number(page))}
                    >
                      {page}
                    </PaginationLink>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-video" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="mb-2 h-6 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-2 h-4 w-3/4" />
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
