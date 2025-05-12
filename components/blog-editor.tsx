"use client";

import { Markdown } from "@/components/markdown";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface BlogEditorProps {
  post: Analysis;
  lang: Locale;
  dictionary: any;
}

export function BlogEditor({ post, lang, dictionary }: BlogEditorProps) {
  const [article, setArticle] = useState(post.jsonContent?.article || "");
  const [group, setGroup] = useState(post.metadata?.group || "");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);

    try {
      // Update the form data with the current state values
      formData.set("analysisId", post.analysisId);
      formData.set(
        "jsonContent",
        JSON.stringify({ ...post.jsonContent, article }),
      );
      formData.set("metadata", JSON.stringify({ ...post.metadata, group }));

      await updateAnalysis(formData);

      toast.success(dictionary.admin.edit.success);

      router.push(`/${lang}/console/dashboard`);
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
