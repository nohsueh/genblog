import type { Locale } from "@/lib/i18n-config"
import type { AnalysisResult } from "@/types/api"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Markdown } from "@/components/markdown"

interface BlogPostProps {
  post: AnalysisResult
  lang: Locale
  dictionary: any
}

export function BlogPost({ post, lang, dictionary }: BlogPostProps) {
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
            {dictionary.blog.publishedOn} {formatDate(post.analysis.publishedDate, lang)}
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

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <Markdown content={post.analysis.content} />
      </div>
    </article>
  )
}

