"use client"

import { useEffect, useRef, useState } from "react"

type AgentStatus =
  | "idle"
  | "no-agent"
  | "pending"
  | "running"
  | "completed"
  | "failed"

/** Result payload for link_analysis jobs */
export type LinkAnalysisResult = {
  /** Categorization tags for the link */
  tags: string[];
  
  /** Risk assessment score (0-1, where 0 is lowest risk) */
  risk_score: number;
  
  /** AI-suggested human-readable alias for the link */
  suggested_alias: string;
  
  /** Explanation of how the alias was generated */
  reasoning: string;
};

export function useAgentSync(linkId?: string) {
  const [status, setStatus] = useState<AgentStatus>("idle")
  const [result, setResult] = useState<LinkAnalysisResult | null>(null)

  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const attemptsRef = useRef(0)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!linkId) return

    attemptsRef.current = 0
    initializedRef.current = false

    pollingRef.current = setInterval(async () => {
      if (!initializedRef.current) {
        setStatus("pending")
        initializedRef.current = true
      }

      attemptsRef.current++

      try {
        const res = await fetch(
          `/api/links/agent-sync?linkId=${linkId}`
        )

        const data = await res.json()

        setStatus(data.status)

        if (data.status === "completed") {
          setResult(data.result)
          clearInterval(pollingRef.current!)
        }

        if (
          data.status === "failed" ||
          data.status === "no-agent"
        ) {
          clearInterval(pollingRef.current!)
        }

        // Hard stop after ~30s
        if (attemptsRef.current > 10) {
          setStatus("failed")
          clearInterval(pollingRef.current!)
        }
      } catch {
        setStatus("failed")
        clearInterval(pollingRef.current!)
      }
    }, 3000)

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [linkId])

  return {
    status,
    result,
  }
}
