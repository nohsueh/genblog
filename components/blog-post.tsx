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
    <article className="max-w-3xl mx-auto">
      <Link href={`/${lang}`} className="inline-flex mb-6">
        <Button variant="ghost" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.blog.backToHome}
        </Button>
      </Link>

      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl mb-4">
        {post.analysis.title}
      </h1>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
        <div className="relative aspect-video mb-6 overflow-hidden rounded-lg">
          <Image
            src={post.analysis.image || "/placeholder.svg"}
            alt={post.analysis.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <Markdown content={post.analysis.content} />
        </div>

        {toc.length > 0 && (
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <h2 className="text-lg font-semibold mb-4">
                {dictionary.blog.tableOfContents}
              </h2>
              <nav className="space-y-2">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
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
