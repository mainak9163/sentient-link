import { Badge } from "@/components/ui/badge"

export function AgentStatusBar({ status }: { status: string }) {
  if (status === "no-agent") return null

  if (status === "pending" || status === "running") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">AI</Badge>
        Analyzing link…
      </div>
    )
  }

  if (status === "completed") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Badge variant="outline">AI</Badge>
        AI suggestions applied
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="flex items-center gap-2 text-sm text-yellow-600">
        <Badge variant="outline">AI</Badge>
        AI unavailable — fallback used
      </div>
    )
  }

  return null
}
