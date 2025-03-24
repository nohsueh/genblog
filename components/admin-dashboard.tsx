"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPublishedBlogs, updateAnalysis } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { formatDate } from "@/lib/utils";
import type { AnalysisResult } from "@/types/api";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

interface AdminDashboardProps {
  lang: Locale;
  dictionary: any;
  groupName: string;
}

export function AdminDashboard({
  lang,
  dictionary,
  groupName,
}: AdminDashboardProps) {
  const [posts, setPosts] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const group = selectedGroup === groupName ? selectedGroup : undefined;
        const result = await getPublishedBlogs(currentPage, 20, group);
        setPosts(result.blogs);
        setTotal(result.total);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [groupName, selectedGroup, currentPage]);

  const filteredPosts = posts.filter((post) =>
    post.analysis.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleVisibility = async (post: AnalysisResult) => {
    try {
      const formData = new FormData();
      formData.append("analysisId", post.analysisId);
      formData.append("content", post.analysis.content);
      formData.append(
        "group",
        post.metadata?.group === groupName ? "" : groupName
      );

      const updatedPost = await updateAnalysis(formData);

      // Update local state
      setPosts(
        posts.map((p) =>
          p.analysisId === updatedPost.analysisId ? updatedPost : p
        )
      );
    } catch (error) {
      toast.error(dictionary.admin.edit.error);
      console.error("Failed to update post visibility:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <h1 className="text-3xl font-bold">
          {dictionary.admin.dashboard.title}
        </h1>
        <div className="flex gap-2">
          <Link href={`/${lang}/admin/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {dictionary.admin.dashboard.createNew}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={dictionary.admin.dashboard.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger>
              <SelectValue placeholder={dictionary.admin.dashboard.filter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {dictionary.admin.dashboard.allGroups}
              </SelectItem>
              <SelectItem value={groupName}>{groupName}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            {dictionary.admin.dashboard.noBlogs}
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>{dictionary.admin.dashboard.group}</TableHead>
                <TableHead>{dictionary.admin.dashboard.visibility}</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.analysisId}>
                  <TableCell className="font-medium">
                    {post.analysis.title}
                  </TableCell>
                  <TableCell>
                    {post.updatedAt
                      ? formatDate(post.updatedAt, lang)
                      : formatDate(post.createdAt, lang)}
                  </TableCell>
                  <TableCell>
                    {post.metadata?.group ? (
                      <Badge variant="outline">{post.metadata.group}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={post.metadata?.group === groupName}
                        onCheckedChange={() => handleToggleVisibility(post)}
                      />
                      <Label>
                        {post.metadata?.group === groupName
                          ? dictionary.admin.dashboard.visible
                          : dictionary.admin.dashboard.hidden}
                      </Label>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/${lang}/admin/edit/${post.analysisId}`}>
                        <Button size="icon" variant="ghost">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">
                            {dictionary.admin.dashboard.edit}
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {total > 20 && (
            <div className="p-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    />
                  </PaginationItem>
                  {Array.from(
                    { length: Math.ceil(total / 20) },
                    (_, i) => i + 1
                  ).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((p) =>
                          Math.min(Math.ceil(total / 20), p + 1)
                        )
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
