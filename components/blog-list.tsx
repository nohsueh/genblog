"use client";

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
import { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";

const PAGE_SIZE = 12;

interface BlogListProps {
  lang: Locale;
  dictionary: any;
  group?: string;
}

async function BlogListContent({ lang, dictionary, group }: BlogListProps) {
  const [posts, setPosts] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      setError(null);
      const { blogs, total } = await getPublishedBlogs(
        pageRef.current,
        PAGE_SIZE,
        group,
        lang,
      );

      if (blogs.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...blogs]);
      setHasMore(posts.length + blogs.length < total);
      pageRef.current += 1;
    } catch (error) {
      setError(dictionary.blog.loadError || "加载失败，请重试");
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [group, lang, hasMore, loading, posts.length, dictionary.blog.loadError]);

  const debouncedLoadMore = useDebounce(loadMore, 300);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          debouncedLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [debouncedLoadMore]);

  useEffect(() => {
    loadMore();
  }, [group, lang]);

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="mb-4 text-red-500">{error}</p>
        <button
          onClick={loadMore}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          {dictionary.blog.retry || "重试"}
        </button>
      </div>
    );
  }

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
          const createdAt = post.createdAt;

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

      {hasMore && (
        <div ref={observerTarget} className="mt-8 flex justify-center">
          {loading && (
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          )}
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
