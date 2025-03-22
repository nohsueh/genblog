import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogPost } from "@/components/blog-post"
import { getAnalysis } from "@/lib/api"
import { notFound } from "next/navigation"

export default async function BlogPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string }
}) {
  const dictionary = await getDictionary(lang)

  try {
    const post = await getAnalysis(id)

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader lang={lang} dictionary={dictionary} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <BlogPost post={post} lang={lang} dictionary={dictionary} />
        </main>
        <SiteFooter lang={lang} dictionary={dictionary} />
      </div>
    )
  } catch (error) {
    return notFound()
  }
}

