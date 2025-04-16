"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { analyzeLinks, analyzeSearch } from "@/lib/actions";
import { useState } from "react";
import { toast } from "sonner";

const DEFAULT_PROMPT =
  "You are a professional content writer and SEO specialist skilled at transforming raw webpage content into unique, engaging, and SEO-optimized articles. Create a high-quality human-style article from the provided content that covers a specific, niche topic in depth. The content should be original, well-researched, and provide significant value to readers. Structure the article clearly with engaging subheadings, bullet points, and short paragraphs to improve readability. Include relevant keywords naturally, but avoid keyword stuffing. Add internal links to related articles on the same website, and external links to authoritative sources to increase the page's credibility.";

interface BlogCreatorProps {
  dictionary: any;
  groupName: string;
}

export function BlogCreator({ dictionary, groupName }: BlogCreatorProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [temperature, setTemperature] = useState([1]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearchSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      // Add temperature to the form data
      formData.append("temperature", temperature[0].toString());
      // Add num to the form data (default 1 if not set)
      const num = formData.get("num") || 10;
      formData.set("num", num.toString());

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
                    defaultValue={DEFAULT_PROMPT}
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
                    max={25}
                    defaultValue={10}
                    disabled={isLoading}
                  />
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
                    defaultValue={DEFAULT_PROMPT}
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
