"use client"

import { useState } from "react"
import { toast } from "sonner"

import { FormHeader } from "./form-header"
import { UrlInput } from "./url-input"
import { ModeToggle } from "./mode-toggle"
import { AliasInput } from "./alias-input"
import { IntentInput } from "./intent-input"
import { SubmitButton } from "./submit-button"
import { ResultPreview } from "./result-preview"
import { useCreateLink } from "./hooks/use-create-link"
import { useAgentSync } from "@/hooks/use-agent-sync"

import type { FormState, CreateLinkResponse } from "./types"

const INITIAL_FORM_STATE: FormState = {
  originalUrl: "",
  customCode: "",
  userIntent: "",
  useCustomAlias: false,
}

export function CreateLinkForm() {
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE)
  const [result, setResult] = useState<CreateLinkResponse | null>(null)

  const { status: agentStatus, result: agentResult } = useAgentSync(
    result?.id ?? undefined
  )

  const { createLink, isLoading } = useCreateLink({
    onSuccess: handleSuccess,
    onError: handleError,
  })

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }))
  }

  function handleSuccess(data: CreateLinkResponse) {
    setResult(data)
    toast.success("Short link created")

    navigator.clipboard.writeText(data.shortUrl)
    toast.message("Copied to clipboard", {
      description: data.shortUrl,
    })

    // Reset form inputs while preserving mode
    setFormState((prev) => ({
      ...INITIAL_FORM_STATE,
      useCustomAlias: prev.useCustomAlias,
    }))
  }

  function handleError() {
    toast.error("Something went wrong")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)

    const payload = {
      originalUrl: formState.originalUrl,
      customCode: formState.useCustomAlias ? formState.customCode : undefined,
      userIntent:
        !formState.useCustomAlias && formState.userIntent
          ? formState.userIntent
          : undefined,
    }

    await createLink(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <FormHeader useCustomAlias={formState.useCustomAlias} />

        <UrlInput
          value={formState.originalUrl}
          onChange={(value) => updateField("originalUrl", value)}
        />

        <ModeToggle
          checked={formState.useCustomAlias}
          onCheckedChange={(checked) => updateField("useCustomAlias", checked)}
        />

        {formState.useCustomAlias ? (
          <AliasInput
            value={formState.customCode}
            onChange={(value) => updateField("customCode", value)}
          />
        ) : (
          <IntentInput
            value={formState.userIntent}
            onChange={(value) => updateField("userIntent", value)}
          />
        )}

        <SubmitButton isLoading={isLoading} />

        {result && (
          <ResultPreview
            shortUrl={result.shortUrl}
            agentStatus={agentStatus}
            agentResult={agentResult}
          />
        )}
      </div>
    </form>
  )
}