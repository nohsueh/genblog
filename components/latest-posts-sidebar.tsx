import { Card, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getGroupName } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
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
              <div className="flex flex-col justify-between p-1">
                <Skeleton className="my-[2px] h-3 w-full" />
                <Skeleton className="my-[2px] h-3 w-full" />
                <Skeleton className="my-[2px] h-3 w-3/4" />
              </div>
            </Card>
          ))}
        >
          <LatestPostsContent lang={lang} />
        </Suspense>
      </div>
    </aside>
  );
}

async function LatestPostsContent({ lang }: { lang: Locale }) {
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

    return (
      <Link href={`/${lang}/${post.analysisId}/${post.slug || ""}`}>
        <Card
          key={post.analysisId}
          className="flex flex-row items-center overflow-hidden border-2 border-transparent p-0 transition-colors hover:border-primary/50 focus:border-primary/50 active:border-primary/50 dark:hover:bg-accent/50 dark:focus:bg-accent/50 dark:active:bg-accent/50"
        >
          <CardTitle className="line-clamp-3 p-1 text-xs font-semibold">
            {title}
          </CardTitle>
        </Card>
      </Link>
    );
  }

  return latest.map(renderCard);
}
