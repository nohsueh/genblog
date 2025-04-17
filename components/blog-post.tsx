"use client";

import type { Locale } from "@/lib/i18n-config";
import type { AnalysisResult } from "@/types/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface BlogPostProps {
  post: AnalysisResult;
  lang: Locale;
  dictionary: any;
}

export function BlogPost({ post, lang, dictionary }: BlogPostProps) {
  const [headings, setHeadings] = useState<
    Array<{ id: string; text: string; level: number }>
  >([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const TableOfContents = () => (
    <div className="sticky top-8">
      <h2 className="mb-4 text-lg font-semibold">
        {dictionary.blog.tableOfContents}
      </h2>
      <nav className="space-y-2">
        {headings.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm transition-colors ${
              activeId === item.id
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="relative">
      <article className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/${lang}`}>
            <Button variant="ghost" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              {dictionary.blog.backToHome}
            </Button>
          </Link>
          {headings.length > 0 && (
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <TableOfContents />
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>

        <div>
          <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
            {post.analysis.title}
          </h1>

          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            {post.analysis.publishedDate && (
              <span>
                {dictionary.blog.publishedOn}{" "}
                {formatDate(post.analysis.publishedDate, lang)}
              </span>
            )}
            {post.analysis.author && (
              <span>
                {dictionary.blog.by} {post.analysis.author}
              </span>
            )}
          </div>

          {post.analysis.image && (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
              <Image
                src={
                  post.analysis.image ||
                  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/placeholder.svg`
                }
                alt={post.analysis.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none dark:prose-invert">
            <Markdown
              content={post.analysis.content}
              onHeadingsExtracted={setHeadings}
            />
          </div>
        </div>
      </article>

      {headings.length > 0 && (
        <div className="fixed right-8 top-24 hidden w-64 lg:block">
          <TableOfContents />
        </div>
      )}
    </div>
  );
}
