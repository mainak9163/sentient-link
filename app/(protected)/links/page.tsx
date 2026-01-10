/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { useEffect, useState } from "react"

type Link = {
  _id: string
  originalUrl: string
  shortCode: string
  clicks: number
}

export default function LinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function fetchLinks() {
    const res = await fetch("/api/links")
    if (res.ok) {
      const data = await res.json()
      setLinks(data.links)
    }
  }

  async function createLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setShortUrl("")

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: url }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(data.message || "Failed to create link")
      return
    }

    const data = await res.json()
    setShortUrl(data.shortUrl)
    setUrl("")
    fetchLinks()
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shortUrl)
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold">Your Links</h1>

      {/* Create Link */}
      <form onSubmit={createLink} className="space-y-3">
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 rounded-md border px-3 py-2"
            required
          />
          <button
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            {loading ? "Creating..." : "Shorten"}
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </form>

      {/* Generated Short Link */}
      {shortUrl && (
        <div className="rounded-md border p-4 flex items-center justify-between">
          <span className="font-medium">{shortUrl}</span>
          <button
            onClick={copyToClipboard}
            className="text-sm text-blue-600 hover:underline"
          >
            Copy
          </button>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {links.length === 0 && (
          <p className="text-muted-foreground">
            No links yet. Create your first one.
          </p>
        )}

        {links.map((link) => (
          <div
            key={link._id}
            className="flex items-center justify-between rounded-md border p-4"
          >
            <div className="space-y-1">
              <p className="font-medium">
                {`${process.env.NEXT_PUBLIC_WEB_URL}/r/${link.shortCode}`}
              </p>
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {link.originalUrl}
              </p>
            </div>

            <span className="text-sm text-muted-foreground">
              {link.clicks} clicks
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
