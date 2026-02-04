"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink, Copy, Trash2, BarChart3, Calendar } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

type Link = {
  _id: string
  originalUrl: string
  shortCode: string
  clicks: number
  createdAt: string
  aiStatus?: string
  tags?: string[]
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function fetchLinks() {
    try {
      const res = await fetch("/api/links")
      
      if (!res.ok) {
        throw new Error("Failed to fetch links")
      }

      const data = await res.json()
      setLinks(data.links)
    } catch (error) {
      toast.error("Failed to load links")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return

    setDeleting(true)

    try {
      const res = await fetch(`/api/links/${deleteId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete link")
      }

      setLinks((prev) => prev.filter((link) => link._id !== deleteId))
      toast.success("Link deleted")
    } catch (error) {
      toast.error("Failed to delete link")
      console.error(error)
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  function copyShortUrl(code: string) {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${code}`
    navigator.clipboard.writeText(url)
    toast.success("Copied to clipboard")
  }

  function openInNewTab(code: string) {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${code}`
    window.open(url, "_blank")
  }

  function getAiStatusBadge(status?: string) {
    const badges = {
      completed: { text: "AI", variant: "default" as const },
      fallback: { text: "Gemini", variant: "secondary" as const },
      skipped: { text: "Custom", variant: "outline" as const },
    }

    if (!status || !badges[status as keyof typeof badges]) return null

    const badge = badges[status as keyof typeof badges]
    return <Badge variant={badge.variant}>{badge.text}</Badge>
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="space-y-6 sm:min-w-lg">
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">No links yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Create your first short link to get started
          </p>
          <Button onClick={() => (window.location.href = "/dashboard")}>
            Create Link
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Links</h1>
          <p className="text-sm text-muted-foreground">
            {links.length} {links.length === 1 ? "link" : "links"} created
          </p>
        </div>

        <Button onClick={() => (window.location.href = "/dashboard")}>
          Create New Link
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Links</p>
              <p className="text-2xl font-bold">{links.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">
                {links.reduce((sum, link) => sum + link.clicks, 0)}
              </p>
            </div>
            <ExternalLink className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg. Clicks</p>
              <p className="text-2xl font-bold">
                {links.length > 0
                  ? Math.round(
                      links.reduce((sum, link) => sum + link.clicks, 0) /
                        links.length
                    )
                  : 0}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      </div>

      {/* Links Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short Link</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => {
              const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/r/${link.shortCode}`

              return (
                <TableRow key={link._id}>
                  {/* Short Link */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyShortUrl(link.shortCode)}
                        className="group flex items-center gap-2 font-mono text-sm hover:text-primary"
                      >
                        <span className="max-w-50 truncate">
                          {shortUrl}
                        </span>
                        <Copy className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                      {getAiStatusBadge(link.aiStatus)}
                    </div>
                    {link.tags && link.tags.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {link.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {link.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{link.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>

                  {/* Original URL */}
                  <TableCell>
                    <a
                      href={link.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <span className="max-w-75 truncate">
                        {link.originalUrl}
                      </span>
                      <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </TableCell>

                  {/* Clicks */}
                  <TableCell className="text-center">
                    <span className="font-medium">{link.clicks}</span>
                  </TableCell>

                  {/* Created */}
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(link.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyShortUrl(link.shortCode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openInNewTab(link.shortCode)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(link._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this link? This action cannot be
              undone and the short URL will no longer work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}