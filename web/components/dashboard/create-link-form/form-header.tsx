import { Badge } from "@/components/ui/badge"

interface FormHeaderProps {
  useCustomAlias: boolean
}

export function FormHeader({ useCustomAlias }: FormHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Create short link</h2>
        <p className="text-sm text-muted-foreground">
          Instant links with optional AI enhancement
        </p>
      </div>

      <div className="flex gap-2">
        {useCustomAlias ? (
          <Badge variant="outline">Instant</Badge>
        ) : (
          <Badge variant="secondary">AI Assisted</Badge>
        )}
      </div>
    </div>
  )
}