import { BlogList } from "@/components/blog-list";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listAnalyses } from "@/lib/actions";
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n-config";

export default async function Home({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  // Get all unique groups for the tabs
  const allBlogs = await listAnalyses(1, 100);
  const uniqueGroups = Array.from(
    new Set(
      allBlogs
        .filter((blog) => blog.metadata?.group)
        .map((blog) => blog.metadata?.group as string)
    )
  );

  // Get the selected group from query params or use the first available group
  const { group } = await searchParams;
  const selectedGroup =
    typeof group === "string"
      ? group
      : uniqueGroups.length > 0
      ? uniqueGroups[0]
      : undefined;

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

        {uniqueGroups.length > 0 ? (
          <Tabs defaultValue={selectedGroup} className="mb-8">
            <TabsList className="mb-4 flex flex-wrap h-auto">
              {uniqueGroups.map((group) => (
                <TabsTrigger
                  key={group}
                  value={group}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  asChild
                >
                  <a href={`/${lang}?group=${group}`}>{group}</a>
                </TabsTrigger>
              ))}
            </TabsList>

            {uniqueGroups.map((group) => (
              <TabsContent key={group} value={group}>
                <BlogList lang={lang} dictionary={dictionary} group={group} />
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">{dictionary.blog.noBlogs}</p>
          </div>
        )}
      </main>
      <SiteFooter lang={lang} dictionary={dictionary} />
    </div>
  );
}
