import { LatestPostsSidebar } from "@/components/latest-posts-sidebar";
import { markdownToHtml } from "@/components/markdown";
import { OnThisPage } from "@/components/on-this-page";
import { RelatedBlogList } from "@/components/related-post-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Locale } from "@/lib/i18n-config";
import { formatDate } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import { TableOfContents } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 3600;

interface BlogPostProps {
  post: AnalysisResult;
  lang: Locale;
  dictionary: any;
}

export function BlogPost({ post, lang, dictionary }: BlogPostProps) {
  const { html, headings } = markdownToHtml(post.analysis?.content || "");

  return (
    <div className="relative">
      <article className="mx-auto max-w-4xl">
        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed right-8 top-20 z-50"
              >
                <TableOfContents className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <OnThisPage headings={headings} dictionary={dictionary} />
              <LatestPostsSidebar lang={lang} dictionary={dictionary} />
            </SheetContent>
          </Sheet>
        </div>
        <div>
          {post.analysis?.image && (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
              <Image
                src={
                  post.analysis.image ||
                  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`
                }
                unoptimized
                alt={post.analysis.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={post.analysis?.url || "#"}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <span>{formatDate(post.createdAt, lang)}</span>
              {post.analysis?.author && (
                <span>
                  {" "}
                  {dictionary.blog.by} {post.analysis.author}
                </span>
              )}
            </Link>
          </div>

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <div
              className="prose prose-sm prose-gray w-full max-w-none break-all dark:prose-invert sm:prose-base prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      </article>

      <div className="fixed right-8 top-24 hidden w-64 xl:block">
        <div>
          <OnThisPage headings={headings} dictionary={dictionary} />
          <LatestPostsSidebar lang={lang} dictionary={dictionary} />
        </div>
      </div>

      <div>
        <RelatedBlogList
          lang={lang}
          dictionary={dictionary}
          currentId={post.analysisId}
        />
      </div>
    </div>
  );
}
