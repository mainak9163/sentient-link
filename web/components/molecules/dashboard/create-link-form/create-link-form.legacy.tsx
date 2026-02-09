"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AgentStatusBar } from "@/components/agent-status-bar"
import { useAgentSync } from "@/hooks/use-agent-sync"

export function CreateLinkForm() {
  // Form state
  const [originalUrl, setOriginalUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [userIntent, setUserIntent] = useState("")
  const [useCustomAlias, setUseCustomAlias] = useState(false)

  // Result state
  const [loading, setLoading] = useState(false)
  const [createdUrl, setCreatedUrl] = useState<string | null>(null)
  const [linkId, setLinkId] = useState<string | null>(null)

  // Agent sync
  const { status: agentStatus, result: agentResult } =
    useAgentSync(linkId ?? undefined)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setCreatedUrl(null)
    setLinkId(null)

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl,
          customCode: useCustomAlias ? customCode : undefined,
          userIntent: !useCustomAlias ? userIntent || undefined : undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to create link")
      }

      setCreatedUrl(data.shortUrl)
      setLinkId(data.id)

      toast.success("Short link created")

      await navigator.clipboard.writeText(data.shortUrl)
      toast.message("Copied to clipboard", {
        description: data.shortUrl,
      })

      // Reset inputs (keep mode)
      setOriginalUrl("")
      setCustomCode("")
      setUserIntent("")
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FieldGroup>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Create short link</h2>
            <p className="text-sm text-muted-foreground">
              Instant links with optional AI enhancement
            </p>
          </div>

          <div className="flex gap-2">
            {!useCustomAlias && <Badge variant="secondary">AI Assisted</Badge>}
            {useCustomAlias && <Badge variant="outline">Instant</Badge>}
          </div>
        </div>

        {/* Original URL */}
        <Field>
          <FieldLabel>Original URL</FieldLabel>
          <Input
            placeholder="https://example.com"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
          />
        </Field>

        {/* Mode toggle */}
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Use custom alias</FieldLabel>
            <Switch
              checked={useCustomAlias}
              onCheckedChange={setUseCustomAlias}
            />
          </div>
          <FieldDescription>
            {useCustomAlias
              ? "Custom aliases skip AI analysis"
              : "AI can suggest a more meaningful alias"}
          </FieldDescription>
        </Field>

        {/* Custom alias */}
        {useCustomAlias && (
          <Field>
            <FieldLabel>Custom short code</FieldLabel>
            <Input
              placeholder="my-custom-link"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              required
            />
            <FieldDescription>
              Lowercase letters, numbers, and hyphens only.
            </FieldDescription>
          </Field>
        )}

        {/* AI intent */}
        {!useCustomAlias && (
          <Field>
            <FieldLabel>
              Purpose / Intent{" "}
              <span className="text-muted-foreground">(optional)</span>
            </FieldLabel>
            <Input
              placeholder="share resume with recruiters"
              value={userIntent}
              onChange={(e) => setUserIntent(e.target.value)}
            />
            <FieldDescription>
              Helps AI generate a better alias.
            </FieldDescription>
          </Field>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create short link"}
        </Button>

        {/* Result preview */}
        {createdUrl && (
          <div className="rounded-md border p-3 text-sm space-y-2">
            <div className="text-muted-foreground">
              Your short link
            </div>
            <div className="font-mono break-all">{createdUrl}</div>

            {/* Agent status */}
            <AgentStatusBar status={agentStatus} />

            {/* AI result preview */}
            {agentStatus === "completed" && agentResult && (
              <Alert>
                <AlertDescription>
                  <strong>Suggested alias:</strong>{" "}
                  <span className="font-mono">
                    {agentResult?.suggested_alias??""}
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </FieldGroup>
    </form>
  )
}
