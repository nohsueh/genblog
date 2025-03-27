"use client";

import type { Locale } from "@/lib/i18n-config";
import type { AnalysisResult } from "@/types/api";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { useEffect, useState } from "react";

interface BlogPostProps {
  post: AnalysisResult;
  lang: Locale;
  dictionary: any;
}

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export function BlogPost({ post, lang, dictionary }: BlogPostProps) {
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);

  useEffect(() => {
    // 从Markdown内容中提取标题生成目录
    const headings = post.analysis.content.match(/^(#{1,6})\s+(.+)$/gm);
    if (headings) {
      const tocItems = headings.map((heading) => {
        const level = heading.match(/^#+/)?.[0].length || 0;
        const text = heading.replace(/^#+\s+/, "");
        const id = text.toLowerCase().replace(/\s+/g, "-");
        return { id, text, level };
      });
      setToc(tocItems);
    }
  }, [post.analysis.content]);

  return (
    <article className="mx-auto max-w-3xl">
      <Link href={`/${lang}`} className="mb-6 inline-flex">
        <Button variant="ghost" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.blog.backToHome}
        </Button>
      </Link>

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
            src={post.analysis.image || "/placeholder.svg"}
            alt={post.analysis.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_250px]">
        <Markdown content={post.analysis.content} />

        {toc.length > 0 && (
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <h2 className="mb-4 text-lg font-semibold">
                {dictionary.blog.tableOfContents}
              </h2>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
