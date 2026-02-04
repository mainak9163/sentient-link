import { Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoadingStateProps {
  useCustomAlias: boolean
}

export function LoadingState({ useCustomAlias }: LoadingStateProps) {
  // Custom alias creation is instant, no special message needed
  if (useCustomAlias) {
    return (
      <Alert className="border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/50 backdrop-blur-sm">
        <Loader2 className="h-4 w-4 animate-spin text-violet-600 dark:text-violet-400" />
        <AlertDescription>
          <span className="font-medium text-violet-900 dark:text-violet-100">
            Creating your custom link...
          </span>
        </AlertDescription>
      </Alert>
    )
  }

  // AI-powered creation shows detailed status
  return (
    <Alert className="border-cyan-200 bg-cyan-50/50 dark:border-cyan-900 dark:bg-cyan-950/50 backdrop-blur-sm">
      <Sparkles className="h-4 w-4 animate-pulse text-cyan-600 dark:text-cyan-400" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium text-cyan-900 dark:text-cyan-100">
            AI is generating a smart alias...
          </div>
          <div className="text-xs text-cyan-700 dark:text-cyan-300">
            This takes 3-10 seconds. We&apos;ll try backup AI if needed.
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}