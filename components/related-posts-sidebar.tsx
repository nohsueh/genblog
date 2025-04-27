"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAnalyses, relatedAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const POSTS_PER_PAGE = 12;

interface RelatedAndLatestListProps {
  lang: Locale;
  dictionary: any;
  currentId: string;
}

export function RelatedAndLatestList({
  lang,
  dictionary,
  currentId,
}: RelatedAndLatestListProps) {
  const [latest, setLatest] = useState<AnalysisResult[]>([]);
  const [related, setRelated] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [latestRes, relatedRes] = await Promise.all([
          listAnalyses(1, POSTS_PER_PAGE),
          relatedAnalyses(1, POSTS_PER_PAGE, currentId),
        ]);
        setLatest(latestRes);
        setRelated(relatedRes);
      } catch (err) {
        setLatest([]);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentId]);

  function renderCard(post: AnalysisResult) {
    const contentLines = post.analysis?.content
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const title =
      contentLines?.[0]?.replace(/^#+\s*/, "") || post.analysis?.title || "";
    const description = contentLines?.[1] || "";
    const image = post.analysis?.image;
    const author = post.analysis?.author;
    const createdAt = post.createdAt;
    return (
      <Card key={post.analysisId} className="flex flex-col overflow-hidden">
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
        <CardContent className="flex-1 p-4">
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
                {dictionary.blog.publishedOn} {formatDate(createdAt, lang)}
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
  }

  return (
    <div className="mt-12">
      <section>
        <h2 className="mb-4 text-xl font-bold">
          {dictionary.blog.relatedPosts}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
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
              ))
            : related.map(renderCard)}
        </div>
      </section>
    </div>
  );
}
