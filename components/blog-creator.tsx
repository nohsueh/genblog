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

interface BlogCreatorProps {
  dictionary: any;
  groupName: string;
}

export function BlogCreator({ dictionary, groupName }: BlogCreatorProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [temperature, setTemperature] = useState([0.7]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearchSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      // Add temperature to the form data
      formData.append("temperature", temperature[0].toString());

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
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
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
                    placeholder={`e.g., site:${process.env.SEARCHLYSIS_BLOG_ROOT_DOMAIN} topic`}
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
                    placeholder={`https://${process.env.SEARCHLYSIS_BLOG_ROOT_DOMAIN}/article1\nhttps://${process.env.SEARCHLYSIS_BLOG_ROOT_DOMAIN}/article2\nhttps://${process.env.SEARCHLYSIS_BLOG_ROOT_DOMAIN}/article3`}
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
