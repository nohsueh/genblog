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
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedBlogs } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate } from "@/lib/utils";
import { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const PAGE_SIZE = 6;

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
          group,
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
        {posts.map((post) => (
          <Card key={post.analysisId} className="overflow-hidden">
            <CardHeader className="p-0">
              {post.analysis.image ? (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={
                      post.analysis.image ||
                      `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`
                    }
                    alt={post.analysis.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="mb-2 line-clamp-2">
                <Link
                  href={`/${lang}/${post.analysisId}`}
                  className="hover:underline"
                >
                  {post.analysis.title}
                </Link>
              </CardTitle>
              <div className="mb-2 line-clamp-3 text-sm text-muted-foreground">
                {post.analysis.content.substring(0, 150)}...
              </div>
              <div className="text-xs text-muted-foreground">
                {post.createdAt && (
                  <>
                    {dictionary.blog.publishedOn}{" "}
                    {formatDate(post.createdAt, lang)}
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
                href={`/${lang}/${post.analysisId}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {dictionary.blog.readMore}
              </Link>
            </CardFooter>
          </Card>
        ))}
        {total > PAGE_SIZE && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    aria-disabled={currentPage <= 1}
                  />
                </PaginationItem>
                {Array.from(
                  { length: Math.ceil(total / PAGE_SIZE) },
                  (_, i) => i + 1,
                ).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(Math.ceil(total / PAGE_SIZE), p + 1),
                      )
                    }
                    aria-disabled={currentPage >= Math.ceil(total / PAGE_SIZE)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
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
