"use client";

import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { updateAnalysis } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import type { Analysis } from "@/types/api";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BlogEditorProps {
  post: Analysis;
  language: Locale;
  dictionary: any;
}

export function BlogEditor({ post, language, dictionary }: BlogEditorProps) {
  const [article, setArticle] = useState(post.jsonContent?.article || "");
  const [title, setTitle] = useState(post.jsonContent?.title || "");
  const [overview, setOverview] = useState(post.jsonContent?.overview || "");
  const [name, setBrand] = useState(post.jsonContent?.name || "");
  const [group, setGroup] = useState(post.metadata?.group || "");
  const [tags, setTags] = useState<string[]>(post.jsonContent?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const router = useRouter();

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTags = tagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (newTags.length > 0 && !newTags.some((tag) => tags.includes(tag))) {
        setTags([...tags, ...newTags]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      formData.set("analysisId", post.analysisId);
      formData.set(
        "jsonContent",
        JSON.stringify({
          ...post.jsonContent,
          article,
          tags,
          title,
          overview,
          name,
        }),
      );
      formData.set("metadata", JSON.stringify({ ...post.metadata, group }));

      await updateAnalysis(formData);

      toast.success(dictionary.admin.edit.success);

      router.push(`/${language}/console/dashboard`);
      router.refresh();
    } catch (error) {
      toast.error(dictionary.admin.edit.error, {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>{post.analysis.title}</h1>
          </CardTitle>
          <CardDescription>
            <h2>{post.analysis.url}</h2>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              {" "}
              <Label htmlFor="title">{dictionary.admin.edit.titleLabel}</Label>
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={dictionary.admin.edit.titlePlaceholder}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overview">{dictionary.admin.edit.overview}</Label>
              <Textarea
                id="overview"
                name="overview"
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder={dictionary.admin.edit.overviewPlaceholder}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{dictionary.admin.edit.name}</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={dictionary.admin.edit.brandPlaceholder}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">{dictionary.admin.edit.group}</Label>
              <Input
                id="group"
                name="group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="e.g., technology, health, etc."
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground">
                {dictionary.admin.edit.groupHelp}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">{dictionary.admin.edit.tags}</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive/50"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="ml-1 h-3 w-3" />
                    </Badge>
                  ))}
                </div>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder={dictionary.admin.edit.tagsPlaceholder}
                  disabled={isLoading}
                />
                <p className="text-sm text-muted-foreground">
                  {dictionary.admin.edit.tagsHelp}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">{dictionary.admin.edit.content}</Label>
              <Tabs
                defaultValue="edit"
                value={activeTab}
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">
                    {dictionary.admin.edit.editTab}
                  </TabsTrigger>
                  <TabsTrigger value="preview">
                    {dictionary.admin.edit.previewTab}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="pt-4">
                  <Textarea
                    id="content"
                    name="content"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                    rows={20}
                    disabled={isLoading}
                    className="font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="preview" className="pt-4">
                  <div className="prose prose-gray min-h-[400px] max-w-none rounded-md border p-4 dark:prose-invert">
                    <Markdown content={article} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? dictionary.admin.edit.saving
                : dictionary.admin.edit.save}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
