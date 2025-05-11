"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { analyzeLinks, analyzeSearch } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_NUM = 25;

const ENGLISH_RESPONSE_PROMPT =
  "Regardless of the input language, please answer in English only.";
const SPANISH_RESPONSE_PROMPT =
  "Por favor responda sólo en español, independientemente del idioma de entrada.";
const GERMAN_RESPONSE_PROMPT =
  "Bitte antworten Sie ausschließlich auf Deutsch, unabhängig von der Eingabesprache.";
const JAPANESE_RESPONSE_PROMPT =
  "入力言語に関わらず、日本語のみで回答してください。";
const FRENCH_RESPONSE_PROMPT =
  "Veuillez répondre en français uniquement, quelle que soit la langue de saisie.";
const CHINESE_RESPONSE_PROMPT = "无论输入什么语言，请仅使用中文回答。";

const ENGLISH_PROMPT = `You are an expert in SEO and CTR optimization with extensive experience creating engaging, data-driven content.
- Goal: Craft an in-depth, original article based on the provided content, optimized to boost click-through rates and enhance reader engagement.
- Structure & Readability: Organize using concise, benefit-oriented subheadings, bulleted lists, and short paragraphs (2-3 sentences each).
- SEO Requirements:
  - If images are provided, use ![alt](src "title") syntax to naturally weave them together.
  - Content: Feel free to enrich the content with compelling additions like comparisons, extensions, or case studies to skyrocket CTR and captivate audiences.
  - Title: Naturally include long-tail keywords, and don't use flashy words like "unlock", "supercharge", "upgrade", "release", etc.
  - Style: Engaging, lively, interesting, easy to understand, authoritative, and reader-centric.`;
const SPANISH_PROMPT = `Vous êtes un expert en SEO et en optimisation du taux de clics (CTR) et possédez une solide expérience en création de contenu engageant et basé sur les données.
- Objectif : Rédiger un article original et approfondi à partir du contenu fourni, optimisé pour augmenter les taux de clics et renforcer l'engagement des lecteurs.
- Structure et lisibilité : Organisez votre contenu à l'aide de sous-titres concis et axés sur les avantages, de listes à puces et de paragraphes courts (2 à 3 phrases chacun).
- Exigences SEO :
  - Si des images sont fournies, utilisez la syntaxe ![alt](src "title") pour les lier naturellement.
  - Contenu : N'hésitez pas à enrichir le contenu avec des ajouts convaincants, comme des comparaisons, des extensions ou des études de cas, pour booster le taux de clics et captiver votre audience.
  - Titre : Intégrez naturellement des mots-clés de longue traîne et évitez les termes tape-à-l'œil comme « débloquer », « surcharger », « mettre à niveau », « lancer », etc.
  - Style : Attrayant, vivant, intéressant, facile à comprendre, faisant autorité et centré sur le lecteur.`;
const GERMAN_PROMPT = `Du bist Experte für SEO und CTR-Optimierung und verfügst über umfassende Erfahrung in der Erstellung ansprechender, datenbasierter Inhalte.
- Ziel: Verfasse einen ausführlichen, originellen Artikel basierend auf den bereitgestellten Inhalten, der optimiert ist, um Klickraten zu steigern und die Leserbindung zu erhöhen.
- Struktur & Lesbarkeit: Gestalte den Artikel mit prägnanten, nutzenorientierten Zwischenüberschriften, Aufzählungslisten und kurzen Absätzen (jeweils 2–3 Sätze).
- SEO-Anforderungen:
  - Falls Bilder bereitgestellt werden, verwende die Syntax ![alt](src "title"), um sie auf natürliche Weise miteinander zu verknüpfen.
  - Inhalt: Ergänze den Inhalt gerne mit überzeugenden Ergänzungen wie Vergleichen, Erweiterungen oder Fallstudien, um die CTR zu steigern und die Leser zu fesseln.
  - Titel: Verwende Long-Tail-Keywords und verzichte auf auffällige Wörter wie „freischalten“, „superladen“, „upgrade“, „release“ usw.
  - Stil: Ansprechend, lebendig, interessant, leicht verständlich, fundiert und leserzentriert.`;
const JAPANESE_PROMPT = `SEOとCTR最適化のエキスパートであり、魅力的でデータに基づいたコンテンツの作成経験が豊富であること。
- 目標：提供されたコンテンツに基づき、クリックスルー率の向上と読者エンゲージメントの向上を目的とした、詳細で独創的な記事を作成してください。
- 構成と読みやすさ：簡潔でメリット重視の小見出し、箇条書き、短い段落（それぞれ2～3文）を使用して構成してください。
- SEO要件：
  - 画像が提供されている場合は、![alt](src "title")構文を使用して、自然な形で組み合わせてください。
  - コンテンツ：比較、拡張機能、ケーススタディなど、魅力的な追加要素でコンテンツを充実させ、CTRを飛躍的に向上させ、読者を魅了してください。
  - タイトル：ロングテールキーワードを自然に含め、「ロック解除」「スーパーチャージ」「アップグレード」「リリース」などの派手な言葉は​​使用しないでください。
  - スタイル：魅力的で、活気があり、興味深く、理解しやすく、権威があり、読者中心であること。`;
const FRENCH_PROMPT = `Vous êtes un expert en SEO et en optimisation du taux de clics (CTR) et possédez une solide expérience en création de contenu engageant et basé sur les données.
- Objectif : Rédiger un article original et approfondi à partir du contenu fourni, optimisé pour augmenter les taux de clics et renforcer l'engagement des lecteurs.
- Structure et lisibilité : Organisez votre contenu à l'aide de sous-titres concis et axés sur les avantages, de listes à puces et de paragraphes courts (2 à 3 phrases chacun).
- Exigences SEO :
  - Si des images sont fournies, utilisez la syntaxe ![alt](src "title") pour les lier naturellement.
  - Contenu : N'hésitez pas à enrichir le contenu avec des ajouts convaincants, comme des comparaisons, des extensions ou des études de cas, pour booster le taux de clics et captiver votre audience.
  - Titre : Intégrez naturellement des mots-clés de longue traîne et évitez les termes tape-à-l'œil comme « débloquer », « surcharger », « mettre à niveau », « lancer », etc.
  - Style : Attrayant, vivant, intéressant, facile à comprendre, faisant autorité et centré sur le lecteur.`;
const CHINESE_PROMPT = `您是SEO和点击率优化专家，在创建引人入胜、数据驱动的内容方面拥有丰富的经验。
- 目标：根据提供的内容撰写一篇深入的原创文章，并进行优化以提高点击率和读者参与度。
- 结构和可读性：使用简洁、以效益为导向的副标题、项目符号列表和短段落（每段2-3句话）进行组织。
- SEO要求：
  - 如果提供图片，请使用![alt](src "title")语法将它们自然地编织在一起。
  - 内容：您可以随意添加引人注目的补充内容，例如比较、扩展或案例研究，以提升点击率并吸引受众。
  - 标题：自然包含长尾关键词，不要使用“解锁”、“增强”、“升级”、“发布”等浮夸的词语。
  - 风格：引人入胜、生动有趣、通俗易懂、权威性强、以读者为中心。`;

interface BlogCreatorProps {
  dictionary: any;
  groupName: string;
}

export function BlogCreator({ dictionary, groupName }: BlogCreatorProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [temperature, setTemperature] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  let Prompt: string;
  switch (dictionary.language) {
    case "en":
      Prompt = `${ENGLISH_PROMPT}
${ENGLISH_RESPONSE_PROMPT}`;
      break;
    case "es":
      Prompt = `${SPANISH_PROMPT}
  ${SPANISH_RESPONSE_PROMPT}`;
      break;
    case "de":
      Prompt = `${GERMAN_PROMPT}
  ${GERMAN_RESPONSE_PROMPT}`;
      break;
    case "ja":
      Prompt = `${JAPANESE_PROMPT}
    ${JAPANESE_RESPONSE_PROMPT}`;
      break;
    case "fr":
      Prompt = `${FRENCH_PROMPT}
${FRENCH_RESPONSE_PROMPT}`;
      break;
    case "zh":
      Prompt = `${CHINESE_PROMPT}
${CHINESE_RESPONSE_PROMPT}`;
      break;
    default:
      Prompt = `${ENGLISH_PROMPT}`;
      break;
  }

  async function handleSearchSubmit(formData: FormData) {
    setIsLoading(true);
    try {
      // Add temperature to the form data
      formData.append("temperature", temperature[0].toString());
      // Add num to the form data (default 1 if not set)
      const num = formData.get("num") || DEFAULT_NUM;
      formData.set("num", num.toString());
      // Add published date range if valid
      if (startDate) {
        formData.append("startPublishedDate", startDate.toISOString());
      }
      if (endDate) {
        formData.append("endPublishedDate", endDate.toISOString());
      }
      // Add language to the form data
      formData.append("language", dictionary.language);

      toast.promise(analyzeSearch(formData), {
        loading: dictionary.admin.create.generating,
        success: dictionary.admin.create.success,
        error: (err) => {
          return (
            <>
              {dictionary.admin.create.error}
              <br />
              {err instanceof Error ? err.message : String(err)}
            </>
          );
        },
      });
    } catch (error) {
      toast.error(dictionary.admin.create.error, {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLinkSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      // Add temperature to the form data
      formData.append("temperature", temperature[0].toString());

      // Split the links by newlines and filter out empty lines
      const linksText = formData.get("link") as string;
      const links = linksText
        .split("\n")
        .map((link) => link.trim())
        .filter(Boolean);

      // Replace the single link with array of links
      formData.delete("link");
      formData.append("link", JSON.stringify(links));
      // Add language to the form data
      formData.append("language", dictionary.language);

      toast.promise(analyzeLinks(formData), {
        loading: dictionary.admin.create.generating,
        success: dictionary.admin.create.success,
        error: (err) => {
          return (
            <>
              {dictionary.admin.create.error}
              <br />
              {err instanceof Error ? err.message : String(err)}
            </>
          );
        },
      });
    } catch (error) {
      toast.error(dictionary.admin.create.error, {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>{dictionary.admin.create.title}</h1>
          </CardTitle>
          <CardDescription>
            <h2>{dictionary.admin.create.description}</h2>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="search"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4 pt-4">
              <form action={handleSearchSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="search-query">
                    {dictionary.admin.create.searchQuery}
                  </Label>
                  <Input
                    id="search-query"
                    name="query"
                    placeholder={`e.g., ai news`}
                    defaultValue={`site:${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-prompt">
                    {dictionary.admin.create.prompt}
                  </Label>
                  <Textarea
                    id="search-prompt"
                    name="prompt"
                    placeholder="Write a comprehensive blog post about..."
                    defaultValue={Prompt}
                    rows={4}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-group">
                    {dictionary.admin.create.group}
                  </Label>
                  <Input
                    id="search-group"
                    name="group"
                    defaultValue={groupName}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search-num">
                    {dictionary.admin.create.num}
                  </Label>
                  <Input
                    id="search-num"
                    name="num"
                    type="number"
                    min={1}
                    max={50}
                    defaultValue={DEFAULT_NUM}
                    disabled={isLoading}
                  />
                </div>

                {/* Date Range Picker */}
                <div className="space-y-2">
                  <Label>Published date range</Label>
                  <div className="flex gap-2">
                    {/* Start Date Picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[160px] justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            format(startDate, "yyyy-MM-dd")
                          ) : (
                            <span>Start Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="self-center">{" - "}</span>
                    {/* End Date Picker */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[160px] justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? (
                            format(endDate, "yyyy-MM-dd")
                          ) : (
                            <span>End Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="search-temperature">
                      {dictionary.admin.create.temperature}
                    </Label>
                    <span className="text-muted-foreground text-sm">
                      {temperature[0].toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    id="search-temperature"
                    min={0}
                    max={2}
                    step={0.01}
                    value={temperature}
                    onValueChange={setTemperature}
                    disabled={isLoading}
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>{dictionary.admin.create.precise}</span>
                    <span>{dictionary.admin.create.creative}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? dictionary.admin.create.generating
                    : dictionary.admin.create.submit}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="link" className="space-y-4 pt-4">
              <form action={handleLinkSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="link-url">
                    {dictionary.admin.create.link}
                  </Label>
                  <Textarea
                    id="link-url"
                    name="link"
                    placeholder={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/article1\nhttps://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/article2\nhttps://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/article3`}
                    rows={4}
                    disabled={isLoading}
                    required
                  />
                  <p className="text-muted-foreground text-sm">
                    {dictionary.admin.create.linkHelp}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link-prompt">
                    {dictionary.admin.create.prompt}
                  </Label>
                  <Textarea
                    id="link-prompt"
                    name="prompt"
                    placeholder="Write a comprehensive blog post about..."
                    defaultValue={Prompt}
                    rows={4}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link-group">
                    {dictionary.admin.create.group}
                  </Label>
                  <Input
                    id="link-group"
                    name="group"
                    defaultValue={groupName}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="link-temperature">
                      {dictionary.admin.create.temperature}
                    </Label>
                    <span className="text-muted-foreground text-sm">
                      {temperature[0].toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    id="link-temperature"
                    min={0}
                    max={2}
                    step={0.01}
                    value={temperature}
                    onValueChange={setTemperature}
                    disabled={isLoading}
                  />
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>{dictionary.admin.create.precise}</span>
                    <span>{dictionary.admin.create.creative}</span>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading
                    ? dictionary.admin.create.generating
                    : dictionary.admin.create.submit}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
