import type { Locale } from "@/lib/i18n-config"
import { getDictionary } from "@/lib/dictionaries"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogCreator } from "@/components/blog-creator"
import { requireAdmin } from "@/lib/actions"

export default async function CreateBlogPage(
  props: {
    params: Promise<{ lang: Locale }>
  }
) {
  const params = await props.params;

  const {
    lang
  } = params;

  // This will redirect if not authenticated
  await requireAdmin(lang)

  const dictionary = await getDictionary(lang)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} isAdmin={true} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <BlogCreator lang={lang} dictionary={dictionary} />
      </main>
      <SiteFooter lang={lang} dictionary={dictionary} />
    </div>
  )
}

