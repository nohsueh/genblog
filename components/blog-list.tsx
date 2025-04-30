"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedBlogs } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate } from "@/lib/utils";
import { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";

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
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setPosts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotal(0);
    setLoading(true);
    const fetchFirstPage = async () => {
      try {
        const { blogs, total } = await getPublishedBlogs(
          1,
          PAGE_SIZE,
          group,
          lang
        );
        setPosts(blogs);
        setTotal(total);
        setHasMore(blogs.length < total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstPage();
  }, [group, lang]);

  // Load more
  const loadMore = async () => {
    if (loadingMore || loading) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const { blogs } = await getPublishedBlogs(
        nextPage,
        PAGE_SIZE,
        group,
        lang
      );
      setPosts((prev) => [...prev, ...blogs]);
      setCurrentPage(nextPage);
      if (posts.length + blogs.length >= total) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // IntersectionObserver
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaderRef, hasMore, loading, currentPage, total, group, lang]);

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
            <Link href={`/${lang}/${post.analysisId}`}>
              <Card
                key={post.analysisId}
                className="overflow-hidden transition-shadow hover:shadow-lg"
              >
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
                    <h4 className="mb-2 line-clamp-3 text-sm text-muted-foreground">
                      {description}...
                    </h4>
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="text-xs text-muted-foreground">
                    {createdAt && <>{formatDate(createdAt, lang)}</>}
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
      <div ref={loaderRef} />
      {loadingMore && (
        <div className="py-6 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
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
