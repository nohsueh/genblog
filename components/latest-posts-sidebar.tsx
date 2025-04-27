"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const POSTS_PER_PAGE = 6;

interface LatestPostsSidebarProps {
  lang: Locale;
  dictionary: any;
}

export function LatestPostsSidebar({ lang, dictionary }: LatestPostsSidebarProps) {
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
    const title = contentLines?.[0]?.replace(/^#+\s*/, "") || post.analysis?.title || "";
    const image = post.analysis?.image;
    return (
      <Card key={post.analysisId} className="mb-4 overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={image || `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`}
              unoptimized
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 pb-2">
          <CardTitle className="mb-2 line-clamp-2 text-base">
            <Link href={`/${lang}/${post.analysisId}`} className="hover:underline">
              {title}
            </Link>
          </CardTitle>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link href={`/${lang}/${post.analysisId}`} className="text-xs font-medium text-primary hover:underline">
            {dictionary.blog.readMore}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <aside className="hidden lg:block sticky top-[calc(8rem+40vh)] w-64 mt-8">
      <h2 className="mb-4 text-lg font-semibold">{dictionary.blog.latestPosts}</h2>
      <div>
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="mb-4 overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-video" />
                </CardHeader>
                <CardContent className="p-4 pb-2">
                  <Skeleton className="mb-2 h-6 w-full" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-4 w-24" />
                </CardFooter>
              </Card>
            ))
          : latest.map(renderCard)}
      </div>
    </aside>
  );
}
