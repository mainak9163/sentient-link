import { Badge } from "@/components/ui/badge"
import type { FormHeaderProps } from "./form-header.types"

export function FormHeader({
  useCustomAlias,
  className,
  ...props
}: FormHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className ?? ""}`} {...props}>
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
