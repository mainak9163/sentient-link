"use client"

import { FC, useEffect, useState } from "react"
import { toast } from "sonner"

import { Link } from "../types"
import { LinksHeader } from "../links-header/links-header"
import { LinksStats } from "../links-stats/links-stats"
import { LinksTable } from "../links-table/links-table"
import { LinksEmptyState } from "../links-empty-state/links-empty-state"
import { LinksLoading } from "../links-loading/links-loading"
import { DeleteLinkDialog } from "../delete-link-dialog/delete-link-dialog"
import { LinksPageProps } from "./links-page.types"

export const LinksPage: FC<LinksPageProps> = ({
  className,
  ...props
}) => {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ""

  const buildShortUrl = (code: string) => `${baseUrl}/r/${code}`

  const fetchLinks = async () => {
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

  const handleDelete = async () => {
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

  const copyShortUrl = (code: string) => {
    const url = buildShortUrl(code)
    navigator.clipboard.writeText(url)
    toast.success("Copied to clipboard")
  }

  const openInNewTab = (code: string) => {
    const url = buildShortUrl(code)
    window.open(url, "_blank")
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  if (loading) {
    return <LinksLoading />
  }

  if (links.length === 0) {
    return <LinksEmptyState />
  }

  return (
    <div className={`space-y-6 pt-[10vh] ${className ?? ""}`} {...props}>
      <LinksHeader count={links.length} />
      <LinksStats links={links} />
      <LinksTable
        links={links}
        buildShortUrl={buildShortUrl}
        onCopy={copyShortUrl}
        onOpen={openInNewTab}
        onDelete={setDeleteId}
      />
      <DeleteLinkDialog
        open={!!deleteId}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onOpenChange={() => setDeleteId(null)}
      />
    </div>
  )
}
