import { Sparkles, Zap, Hash, Copy, ExternalLink, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { ResultPreviewProps } from "./result-preview.types"
import { BoxLayout } from "@/components/atoms/box-layout/box-layout"

export function ResultPreview({
  shortUrl,
  aliasSource,
  className,
  ...props
}: ResultPreviewProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(shortUrl)
    toast.success("Copied to clipboard")
  }

  const handleOpen = () => {
    window.open(shortUrl, "_blank")
  }

  const getBadge = () => {
    const badges = {
      custom: { text: "Custom", variant: "default" as const, icon: "✨" },
      ai: { text: "AI Generated", variant: "default" as const, icon: "🤖" },
      gemini: { text: "AI Powered", variant: "secondary" as const, icon: "⚡" },
      nanoid: { text: "Random", variant: "outline" as const, icon: "#" },
    }

    const badge = badges[aliasSource]

    return (
      <Badge variant={badge.variant} className="text-xs">
        {badge.icon} {badge.text}
      </Badge>
    )
  }

  const getMessage = () => {
    const messages = {
      custom: {
        icon: <CheckCircle2 className="h-4 w-4 text-purple-600" />,
        text: "Your custom alias is ready to use!",
        color: "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950",
        textColor: "text-purple-900 dark:text-purple-100",
      },
      ai: {
        icon: <Sparkles className="h-4 w-4 text-green-600" />,
        text: "AI generated a smart, meaningful alias for your link!",
        color: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950",
        textColor: "text-green-900 dark:text-green-100",
      },
      gemini: {
        icon: <Zap className="h-4 w-4 text-blue-600" />,
        text: "Created with backup AI - still smart and readable!",
        color: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950",
        textColor: "text-blue-900 dark:text-blue-100",
      },
      nanoid: {
        icon: <Hash className="h-4 w-4" />,
        text: "AI was unavailable, generated a random short code.",
        color: "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900",
        textColor: "text-muted-foreground",
      },
    }

    return messages[aliasSource]
  }

  const message = getMessage()

  return (
    <BoxLayout
      className={`space-y-3 rounded-lg border bg-card p-4 text-sm ${className ?? ""}`}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-muted-foreground">
          Your short link
        </div>
        {getBadge()}
      </div>

      {/* URL Display */}
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded bg-muted/50 px-3 py-2 font-mono text-sm font-medium">
          {shortUrl}
        </code>

        <Button size="sm" variant="ghost" onClick={handleCopy}>
          <Copy className="h-4 w-4" />
        </Button>

        <Button size="sm" variant="ghost" onClick={handleOpen}>
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>

      {/* Source-specific message */}
      <Alert className={message.color}>
        {message.icon}
        <AlertDescription>
          <span className={`text-sm ${message.textColor}`}>
            {message.text}
          </span>
        </AlertDescription>
      </Alert>
    </BoxLayout>
  )
}
