import { LatestPostsSidebar } from "@/components/latest-posts-sidebar";
import { markdownToHtml } from "@/components/markdown";
import { OnThisPage } from "@/components/on-this-page";
import { RelatedBlogList } from "@/components/related-post-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAnalysis } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate, getDefaultImage } from "@/lib/utils";
import type { Analysis } from "@/types/api";
import { TableOfContents } from "lucide-react";
import ImageWithFallback from "./image-with-fallback";

interface BlogPostProps {
  analysisId: string;
  language: Locale;
  dictionary: any;
}

export async function BlogPost({
  analysisId,
  language,
  dictionary,
}: BlogPostProps) {
  const post: Analysis = await getAnalysis(analysisId);
  const { html, headings } = markdownToHtml(post.jsonContent?.article || "");
  const image = post.analysis.image || getDefaultImage();
  const title = post.analysis.title || "";

  return (
    <div className="relative">
      <div className="lg:mr-[calc(48rem-50vw)] 2xl:mr-0">
        <article className="mx-auto max-w-4xl">
          {image && (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
              <ImageWithFallback
                src={image}
                fallback={getDefaultImage()}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDate(post.updatedAt, language)}</span>
            {post.analysis.author && (
              <span>
                {" "}
                {dictionary.blog.by} {post.analysis.author}
              </span>
            )}
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <div
              className="prose prose-sm prose-gray w-full max-w-none break-all dark:prose-invert sm:prose-base prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </article>

        <RelatedBlogList
          language={language}
          dictionary={dictionary}
          currentId={post.analysisId}
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed right-4 top-20 z-50 lg:hidden"
          >
            <TableOfContents className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px]">
          <OnThisPage headings={headings} />
          <LatestPostsSidebar language={language} dictionary={dictionary} />
        </SheetContent>
      </Sheet>
      <div className="fixed top-24 hidden w-60 lg:right-4 lg:block 2xl:left-[calc(50vw+32rem)]">
        <OnThisPage headings={headings} />
        <LatestPostsSidebar language={language} dictionary={dictionary} />
      </div>
    </div>
  );
}
