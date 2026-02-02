import { Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoadingStateProps {
  useCustomAlias: boolean
}

export function LoadingState({ useCustomAlias }: LoadingStateProps) {
  // Custom alias creation is instant, no special message needed
  if (useCustomAlias) {
    return (
      <Alert>
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>
          <span className="font-medium">Creating your custom link...</span>
        </AlertDescription>
      </Alert>
    )
  }

  // AI-powered creation shows detailed status
  return (
    <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <Sparkles className="h-4 w-4 animate-pulse text-blue-600 dark:text-blue-400" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium text-blue-900 dark:text-blue-100">
            AI is generating a smart alias...
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300">
            This takes 3-10 seconds. We&apos;ll try backup AI if needed.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}