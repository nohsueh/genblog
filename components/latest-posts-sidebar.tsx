import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getDefaultImage, getGroupName } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

const POSTS_PER_PAGE = 24;

interface LatestPostsSidebarProps {
  lang: Locale;
  dictionary: any;
}

export async function LatestPostsSidebar({
  lang,
  dictionary,
}: LatestPostsSidebarProps) {
  let latest: AnalysisResult[];
  try {
    latest = await listAnalyses(1, POSTS_PER_PAGE, {
      group: getGroupName(),
      language: lang,
    });
  } catch (error) {
    latest = [];
  }

  function renderCard(post: AnalysisResult) {
    const contentLines = post.analysis?.content
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const title =
      contentLines?.[0]?.replace(/^#+\s*/, "") || post.analysis?.title || "";
    const image = post.analysis?.image || getDefaultImage();

    return (
      <Link href={`/${lang}/${post.analysisId}`}>
        <Card
          key={post.analysisId}
          className="flex flex-row items-center overflow-hidden border-2 border-transparent p-0 transition-colors hover:border-primary/50 focus:border-primary/50 active:border-primary/50 dark:hover:bg-accent/50 dark:focus:bg-accent/50 dark:active:bg-accent/50"
        >
          <div className="relative ml-1 size-16 flex-shrink-0 overflow-hidden">
            <Image
              src={image}
              unoptimized
              alt={title}
              fill
              className="rounded object-cover"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pl-2 pr-1">
            <CardTitle className="line-clamp-3 text-sm font-semibold">
              {title}
            </CardTitle>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <aside className="sticky top-[40vh] mt-8 h-[40vh] overflow-y-auto xl:top-[calc(8rem+40vh)]">
      <h2 className="mb-2 text-base font-semibold">
        {dictionary.blog.latestPosts}
      </h2>
      <div className="flex flex-col space-y-2 px-1">
        <Suspense
          fallback={Array.from({ length: 4 }).map((_, i) => (
            <Card
              key={i}
              className="flex flex-row items-center overflow-hidden border border-gray-100 p-0 shadow-none"
            >
              <div className="relative ml-1 size-16 flex-shrink-0 overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pl-2 pr-1">
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="mb-1 h-4 w-3/4" />
              </div>
            </Card>
          ))}
        >
          {latest.map(renderCard)}
        </Suspense>
      </div>
    </aside>
  );
}
