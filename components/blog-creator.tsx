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

const ENGLISH_RESPONSE_PROMPT =
  "Regardless of the input language, please answer in English only.";
const FRENCH_RESPONSE_PROMPT =
  "Veuillez répondre en français uniquement, quelle que soit la langue de saisie.";
const SPANISH_RESPONSE_PROMPT =
  "Por favor responda sólo en español, independientemente del idioma de entrada.";
const GERMAN_RESPONSE_PROMPT =
  "Bitte antworten Sie ausschließlich auf Deutsch, unabhängig von der Eingabesprache.";
const CHINESE_RESPONSE_PROMPT = "无论输入什么语言，请仅使用中文回答。";

const ENGLISH_PROMPT = `You are an expert SEO copywriter and click‑through‑rate strategist with a track record of crafting magnetic, data‑driven articles.
- Objective: Produce an in-depth, original article on the provided raw content designed to boost CTR by at least 500% and maximize reader engagement.
- Structure & Readability: Organize with concise, benefit-oriented subheadings, bullet-point lists, and short paragraphs (2–3 sentences each).
- SEO Requirements:
  - Title: Naturally include long-tail keywords and don't use pompous words like unlock, supercharge, level up, unleash.
  - Naturally weave in the primary keyword 3–5 times and 2–3 related long‑tail terms.
  - Value & Action: Provide actionable insights, real‑world examples.
  - Tone & Style: Engaging, lively, interesting, and easy to understand, authoritative, and reader‑first—balance professional expertise with conversational clarity.`;
const FRENCH_PROMPT = `Vous êtes un rédacteur SEO expert et un stratège en taux de clics, avec une expérience avérée dans la création d'articles captivants et basés sur des données.
- Objectif : Produire un article original et approfondi à partir du contenu brut fourni, conçu pour augmenter le taux de clics d'au moins 500 % et maximiser l'engagement des lecteurs.
- Structure et lisibilité : Organisez votre article avec des sous-titres concis et axés sur les avantages, des listes à puces et des paragraphes courts (2 à 3 phrases chacun).
- Exigences SEO :
  - Titre : Intégrez naturellement des mots-clés de longue traîne et évitez les termes pompeux tels que « débloquer », « surcharger », « monter en niveau », « déchaîner ».
  - Intégrez naturellement le mot-clé principal 3 à 5 fois et 2 à 3 termes de longue traîne associés.
  - Valeur et action : Fournir des informations exploitables et des exemples concrets.
  - Ton et style : Captivant, vivant, intéressant et facile à comprendre, faisant autorité et axé sur le lecteur ; conciliez expertise professionnelle et clarté conversationnelle.`;
const SPANISH_PROMPT = `Eres un redactor SEO experto y estratega de CTR con amplia experiencia en la creación de artículos impactantes basados ​​en datos.
- Objetivo: Redactar un artículo original y profundo sobre el contenido original proporcionado, diseñado para aumentar el CTR en al menos un 500 % y maximizar la interacción del lector.
- Estructura y legibilidad: Organízalo con subtítulos concisos y orientados a los beneficios, listas con viñetas y párrafos cortos (de 2 a 3 frases cada uno).
- Requisitos SEO:
  - Título: Incluye palabras clave de cola larga de forma natural y evita usar términos pomposos como desbloquear, potenciar, subir de nivel o liberar.
  - Incluye la palabra clave principal de 3 a 5 veces y de 2 a 3 términos de cola larga relacionados.
  - Valor y acción: Proporciona información práctica y ejemplos reales.
  - Tono y estilo: atractivo, animado, interesante y fácil de entender, con autoridad y centrado en el lector: equilibre la experiencia profesional con la claridad conversacional.`;
const GERMAN_PROMPT = `Sie sind ein erfahrener SEO-Texter und Klickratenstratege mit langjähriger Erfahrung in der Erstellung fesselnder, datenbasierter Artikel.
- Ziel: Erstellen Sie einen ausführlichen, originellen Artikel auf Basis der bereitgestellten Rohinhalte, der die Klickrate um mindestens 500 % steigert und die Leserinteraktion maximiert.
- Struktur & Lesbarkeit: Gestalten Sie Ihren Artikel mit prägnanten, nutzenorientierten Zwischenüberschriften, Aufzählungslisten und kurzen Absätzen (jeweils 2–3 Sätze).
- SEO-Anforderungen:
  - Titel: Verwenden Sie Long-Tail-Keywords auf natürliche Weise und vermeiden Sie hochtrabende Wörter wie „freischalten“, „superladen“, „leveln auf“, „entfesseln“.
  - Binden Sie das primäre Keyword 3–5 Mal und 2–3 verwandte Long-Tail-Begriffe auf natürliche Weise ein.
  - Wert & Aktion: Liefern Sie umsetzbare Erkenntnisse und Beispiele aus der Praxis.
  - Ton & Stil: Ansprechend, lebendig, interessant und leicht verständlich, kompetent und leserorientiert – verbinden Sie professionelle Expertise mit klarer Konversation.`;
const CHINESE_PROMPT = `您是一位专业的SEO文案撰写者和点击率策略专家，并拥有撰写引人入胜、数据驱动型文章的丰富经验。
- 目标：根据提供的原始内容撰写一篇深入的原创文章，旨在将点击率提升至少500%，并最大限度地提高读者参与度。
- 结构与可读性：使用简洁、以效益为导向的副标题、项目符号列表和简短的段落（每段2-3句话）进行组织。
- SEO要求：
  - 标题：自然包含长尾关键词，切勿使用诸如“解锁”、“增压”、“升级”、“释放”等浮夸的词语。
  - 自然地穿插使用主要关键词3-5次以及2-3个相关的长尾词。
  - 价值与行动：提供切实可行的见解和实际案例。
  - 语气与风格：引人入胜、生动活泼、趣味盎然、通俗易懂、权威性强、以读者为中心——在专业知识与清晰的对话之间取得平衡。`;

const DEFAULT_NUM = 25;

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
      Prompt = `${ENGLISH_RESPONSE_PROMPT}
${ENGLISH_PROMPT}`;
      break;
    case "fr":
      Prompt = `${FRENCH_RESPONSE_PROMPT}
${FRENCH_PROMPT}`;
      break;
    case "es":
      Prompt = `${SPANISH_RESPONSE_PROMPT}
${SPANISH_PROMPT}`;
      break;
    case "de":
      Prompt = `${GERMAN_RESPONSE_PROMPT}
${GERMAN_PROMPT}`;
      break;
    case "zh":
      Prompt = `${CHINESE_RESPONSE_PROMPT}
${CHINESE_PROMPT}`;
      break;
    default:
      Prompt = `${ENGLISH_PROMPT}`;
      break;
  }

  const isDateRangeValid = (!startDate && !endDate) || (startDate && endDate);

  async function handleSearchSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      // Add temperature to the form data
      formData.append("temperature", temperature[0].toString());
      // Add num to the form data (default 1 if not set)
      const num = formData.get("num") || DEFAULT_NUM;
      formData.set("num", num.toString());
      // Add published date range if valid
      if (startDate && endDate) {
        formData.append("startPublishedDate", startDate.toISOString());
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
      <h1 className="mb-6 text-3xl font-bold">
        {dictionary.admin.create.title}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>{dictionary.admin.create.title}</CardTitle>
          <CardDescription>
            {dictionary.admin.create.description}
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
                    max={100}
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
                            !startDate && "text-muted-foreground"
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
                            !endDate && "text-muted-foreground"
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
                    <span className="text-sm text-muted-foreground">
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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{dictionary.admin.create.precise}</span>
                    <span>{dictionary.admin.create.creative}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !isDateRangeValid}
                >
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
                  <p className="text-sm text-muted-foreground">
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
                    <span className="text-sm text-muted-foreground">
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
                  <div className="flex justify-between text-xs text-muted-foreground">
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
