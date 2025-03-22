"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { listAnalyses, logoutAdmin } from "@/lib/actions"
import type { AnalysisResult } from "@/types/api"
import { formatDate } from "@/lib/utils"

interface AdminDashboardProps {
  lang: Locale
  dictionary: any
}

export function AdminDashboard({ lang, dictionary }: AdminDashboardProps) {
  const [posts, setPosts] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [groups, setGroups] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const metadata = selectedGroup ? { group: selectedGroup } : undefined
        const data = await listAnalyses(1, 100, metadata)
        setPosts(data)

        // Extract unique groups
        const uniqueGroups = Array.from(
          new Set(data.filter((post) => post.metadata?.group).map((post) => post.metadata?.group as string)),
        )
        setGroups(uniqueGroups)
      } catch (error) {
        console.error("Failed to fetch posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [selectedGroup])

  const filteredPosts = posts.filter((post) => post.analysis.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleLogout = async () => {
    await logoutAdmin()
    router.push(`/${lang}/admin`)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{dictionary.admin.dashboard.title}</h1>
        <div className="flex gap-2">
          <Link href={`/${lang}/admin/create`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {dictionary.admin.dashboard.createNew}
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            {dictionary.header.logout}
          </Button>
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
              <SelectItem value="all">{dictionary.admin.dashboard.allGroups}</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
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
          <p className="text-muted-foreground">{dictionary.admin.dashboard.noBlogs}</p>
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
                  <TableCell className="font-medium">{post.analysis.title}</TableCell>
                  <TableCell>
                    {post.updatedAt ? formatDate(post.updatedAt, lang) : formatDate(post.createdAt, lang)}
                  </TableCell>
                  <TableCell>
                    {post.metadata?.group ? (
                      <Badge variant="outline">{post.metadata.group}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {post.metadata?.group ? (
                      <Badge variant="outline">{dictionary.admin.dashboard.visible}</Badge>
                    ) : (
                      <Badge variant="secondary">{dictionary.admin.dashboard.hidden}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/${lang}/admin/edit/${post.analysisId}`}>
                        <Button size="icon" variant="ghost">
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{dictionary.admin.dashboard.edit}</span>
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{dictionary.admin.dashboard.delete}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{dictionary.admin.dashboard.confirmDelete}</AlertDialogTitle>
                            <AlertDialogDescription>{post.analysis.title}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{dictionary.admin.dashboard.cancel}</AlertDialogCancel>
                            <AlertDialogAction>{dictionary.admin.dashboard.delete}</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

