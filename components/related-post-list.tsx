import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { relatedAnalyses } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate, getDefaultImage, getGroupName } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import Link from "next/link";
import { Suspense } from "react";
import ImageWithFallback from "./image-with-fallback";

const POSTS_PER_PAGE = 24;

interface RelatedBlogListProps {
  lang: Locale;
  dictionary: any;
  currentId: string;
}

export async function RelatedBlogList({
  lang,
  dictionary,
  currentId,
}: RelatedBlogListProps) {
  let related: AnalysisResult[];
  try {
    related = await relatedAnalyses(1, POSTS_PER_PAGE, currentId, {
      group: getGroupName(),
      language: lang,
    });
  } catch (error) {
    related = [];
  }

  function renderCard(post: AnalysisResult) {
    const contentLines = post.analysis?.content
      ?.split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "");
    const title =
      contentLines?.[0].replace(/^#+\s*/, "") || post.analysis?.title || "";
    const description = contentLines
      ?.slice(1)
      .find((line) => !line.startsWith("!["));
    const image = post.analysis?.image || getDefaultImage();
    const author = post.analysis?.author;
    const updatedAt = post.updatedAt;

    return (
      <Link href={`/${lang}/${post.analysisId}`}>
        <Card
          key={post.analysisId}
          className="flex flex-col overflow-hidden border-2 border-transparent transition-colors hover:border-primary/50 focus:border-primary/50 active:border-primary/50 dark:hover:bg-accent/50 dark:focus:bg-accent/50 dark:active:bg-accent/50"
        >
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden">
              <ImageWithFallback
                src={image}
                fallback={getDefaultImage()}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 pb-0">
            <CardTitle className="mb-2 line-clamp-2 text-base">
              {title}
            </CardTitle>
            <div className="mb-2 line-clamp-3 break-all text-sm text-muted-foreground">
              {description}...
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="text-xs text-muted-foreground">
              {updatedAt && <>{formatDate(updatedAt, lang)}</>}
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
  }

  return (
    <div className="mt-12">
      <section>
        <h2 className="mb-4 text-xl font-bold">
          {dictionary.blog.relatedPosts}
        </h2>
        <div className="grid sm:grid-cols-2 sm:gap-1 md:grid-cols-3 md:gap-2 lg:gap-4">
          <Suspense
            fallback={Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-0">
                  <Skeleton className="aspect-video" />
                </CardHeader>
                <CardContent className="p-4 pb-0">
                  <Skeleton className="my-[4px] h-[16px] w-full" />
                  <Skeleton className="mt-[4px] mb-2 h-[16px] w-3/4" />
                  <Skeleton className="my-[3px] h-[14px] w-full" />
                  <Skeleton className="my-[3px] h-[14px] w-full" />
                  <Skeleton className="mt-[3px] mb-2 h-[14px] w-3/4" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="my-[2px] h-[12px] w-1/2" />
                </CardFooter>
              </Card>
            ))}
          >
            {related.map(renderCard)}
          </Suspense>
        </div>
      </section>
    </div>
  );
}
