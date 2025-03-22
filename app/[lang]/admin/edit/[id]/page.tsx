import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogEditor } from "@/components/blog-editor"
import { getAnalysis, requireAdmin } from "@/lib/actions"
import { notFound } from "next/navigation"

export default async function EditBlogPage({
  params: { lang, id },
}: {
  params: { lang: Locale; id: string }
}) {
  // This will redirect if not authenticated
  await requireAdmin(lang)

  const dictionary = await getDictionary(lang)

  try {
    const post = await getAnalysis(id)

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader lang={lang} dictionary={dictionary} isAdmin={true} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <BlogEditor post={post} lang={lang} dictionary={dictionary} />
        </main>
        <SiteFooter lang={lang} dictionary={dictionary} />
      </div>
    )
  } catch (error) {
    return notFound()
  }
}

