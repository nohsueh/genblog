"use client";
import {
  Card,
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import type { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const POSTS_PER_PAGE = 12;

interface LatestPostsSidebarProps {
  lang: Locale;
  dictionary: any;
}

export function LatestPostsSidebar({
  lang,
  dictionary,
}: LatestPostsSidebarProps) {
  const [latest, setLatest] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const latestRes = await listAnalyses(1, POSTS_PER_PAGE);
        setLatest(latestRes);
      } catch (err) {
        setLatest([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function renderCard(post: AnalysisResult) {
    const contentLines = post.analysis?.content
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const title =
      contentLines?.[0]?.replace(/^#+\s*/, "") || post.analysis?.title || "";
    const image = post.analysis?.image;
    return (
      <Card
        key={post.analysisId}
        className="mb-2 flex flex-row items-center overflow-hidden border border-gray-100 p-0 shadow-none"
      >
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden">
          <Image
            src={
              image ||
              `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`
            }
            unoptimized
            alt={title}
            fill
            className="rounded object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between px-2 py-1">
          <CardTitle className="mb-1 line-clamp-2 text-sm font-semibold">
            <Link
              href={`/${lang}/${post.analysisId}`}
              className="hover:underline"
            >
              {title}
            </Link>
          </CardTitle>
          <CardFooter className="px-0 pb-0 pt-0">
            <Link
              href={`/${lang}/${post.analysisId}`}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              {dictionary.blog.readMore}
            </Link>
          </CardFooter>
        </div>
      </Card>
    );
  }

  return (
    <aside className="sticky top-[calc(8rem+40vh)] mt-8 h-[40vh] overflow-y-auto">
      <h2 className="mb-2 text-base font-semibold">
        {dictionary.blog.latestPosts}
      </h2>
      <div>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card
                key={i}
                className="mb-2 flex flex-row items-center overflow-hidden border border-gray-100 p-0 shadow-none"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between px-2 py-1">
                  <Skeleton className="mb-1 h-4 w-full" />
                  <div className="flex items-center">
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </Card>
            ))
          : latest.map(renderCard)}
      </div>
    </aside>
  );
}
