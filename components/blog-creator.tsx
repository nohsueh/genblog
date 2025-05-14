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
import { cn, getAppType } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_NUM = 25;

interface BlogCreatorProps {
  dictionary: any;
  group: string;
}

export function BlogCreator({ dictionary, group }: BlogCreatorProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [temperature, setTemperature] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const responseFormat = {
    type: "json_schema",
    json_schema: {
      name: "content",
      strict: true,
      schema: {
        type: "object",
        properties: {
          article: {
            type: "string",
            description: dictionary.prompt.article,
          },
          slug: {
            type: "string",
            description: dictionary.prompt.slug,
          },
          tags: {
            type: "array",
            items: [
              {
                type: "string",
              },
            ],
            description: dictionary.prompt.tags,
          },
          title: {
            type: "string",
            description: dictionary.prompt.title,
          },
          overview: {
            type: "string",
            description: dictionary.prompt.overview,
          },
          ...(getAppType() === "directory" && {
            brand: {
              type: "string",
              description: dictionary.prompt.brand,
            },
          }),
        },
        required: [
          "slug",
          "article",
          "tags",
          "title",
          "overview",
          getAppType() === "directory" ? "brand" : "",
        ].filter(Boolean),
        additionalProperties: false,
      },
    },
  };

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
      formData.append("responseFormat", JSON.stringify(responseFormat));

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
      formData.append("responseFormat", JSON.stringify(responseFormat));

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
                    defaultValue={dictionary.prompt.task}
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
                    defaultValue={group}
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
                    defaultValue={dictionary.prompt.task}
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
                    defaultValue={group}
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
