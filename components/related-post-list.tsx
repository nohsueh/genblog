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
import {
  formatDate,
  getBaseUrl,
  getDefaultImage,
  getDefaultGroup,
} from "@/lib/utils";
import type { Analysis } from "@/types/api";
import Link from "next/link";
import { Suspense } from "react";
import ImageWithFallback from "./image-with-fallback";

const POSTS_PER_PAGE = 12;

interface RelatedBlogListProps {
  language: Locale;
  dictionary: any;
  currentId: string;
}

export async function RelatedBlogList({
  language,
  dictionary,
  currentId,
}: RelatedBlogListProps) {
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
                  <Skeleton className="mb-2 mt-[4px] h-[16px] w-3/4" />
                  <Skeleton className="my-[3px] h-[14px] w-full" />
                  <Skeleton className="my-[3px] h-[14px] w-full" />
                  <Skeleton className="mb-2 mt-[3px] h-[14px] w-3/4" />
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="my-[2px] h-[12px] w-1/2" />
                </CardFooter>
              </Card>
            ))}
          >
            <RelatedBlogListContent
              language={language}
              dictionary={dictionary}
              currentId={currentId}
            />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

async function RelatedBlogListContent({
  language,
  dictionary,
  currentId,
}: RelatedBlogListProps) {
  let related: Analysis[];
  try {
    related = await relatedAnalyses({
      analysisId: currentId,
      pageNum: 1,
      pageSize: POSTS_PER_PAGE,
      selectFields: ["analysisId", "analysis", "updatedAt", "jsonContent"],
      metadata: {
        group: getDefaultGroup(),
        language,
      },
    });
  } catch (error) {
    related = [];
  }

  function renderCard(post: Analysis) {
    const title = post.jsonContent?.title || post.analysis.title;
    const overview = post.jsonContent?.overview || "";
    const image = post.analysis.image || getDefaultImage();
    const author = post.analysis.author;
    const updatedAt = post.updatedAt;

    return (
      <Link
        href={`${getBaseUrl()}/${language}/${post.analysisId}${post.jsonContent?.slug ? `/${encodeURIComponent(post.jsonContent?.slug)}` : ""}`}
      >
        <Card
          key={post.analysisId}
          className="flex flex-col overflow-hidden border-2 border-transparent transition-colors hover:border-primary/50 dark:hover:bg-accent/50"
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
            <CardTitle className="mb-2 line-clamp-2 text-ellipsis text-base">
              {title}
            </CardTitle>
            <div className="mb-2 line-clamp-3 text-ellipsis text-sm text-muted-foreground">
              {overview}...
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="text-xs text-muted-foreground">
              {updatedAt && <>{formatDate(updatedAt, language)}</>}
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

  return related.map(renderCard);
}
