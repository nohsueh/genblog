import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} dictionary={dictionary} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl lg:text-5xl">
              {dictionary.home.title}
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              {dictionary.home.description}
            </p>
          </div>
        </section>

        <BlogList
          lang={lang}
          dictionary={dictionary}
          group={process.env.SEARCHLYSIS_GROUP_NAME}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
