import { useState } from "react"

import type { CreateLinkPayload, CreateLinkResponse } from "../types"

interface UseCreateLinkOptions {
  onSuccess?: (data: CreateLinkResponse) => void
  onError?: (error: Error) => void
}

export function useCreateLink({ onSuccess, onError }: UseCreateLinkOptions) {
  const [isLoading, setIsLoading] = useState(false)

  async function createLink(payload: CreateLinkPayload) {
    setIsLoading(true)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create link")
      }

      onSuccess?.(data)
      return data
    } catch (error) {
      const err = error instanceof Error ? error : new Error("Unknown error")
      onError?.(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createLink,
    isLoading,
  }
}