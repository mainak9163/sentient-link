import { Alert, AlertDescription } from "@/components/ui/alert"
import { AgentStatusBar } from "@/components/agent-status-bar"

import type { AgentStatus, AgentResult } from "./types"

interface ResultPreviewProps {
  shortUrl: string
  agentStatus: AgentStatus
  agentResult: AgentResult | null
}

export function ResultPreview({
  shortUrl,
  agentStatus,
  agentResult,
}: ResultPreviewProps) {
  const showSuggestedAlias = agentStatus === "completed" && agentResult?.suggested_alias

  return (
    <div className="rounded-md border p-3 text-sm space-y-2">
      <div className="text-muted-foreground">Your short link</div>
      <div className="font-mono break-all">{shortUrl}</div>

      <AgentStatusBar status={agentStatus} />

      {showSuggestedAlias && (
        <Alert>
          <AlertDescription>
            <strong>Suggested alias:</strong>{" "}
            <span className="font-mono">{agentResult.suggested_alias}</span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}