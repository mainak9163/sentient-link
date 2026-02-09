import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SubmitButtonProps } from "./submit-button.types"

export function SubmitButton({
  isLoading,
  useCustomAlias,
  className,
  ...props
}: SubmitButtonProps) {
  const getButtonText = () => {
    if (!isLoading) {
        return useCustomAlias ? "Create Link" : "Generate Smart Link"
    }

    if (useCustomAlias) {
      return "Creating..."
    }

    return "Generating..."
  }

  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={`w-full ${className ?? ""}`}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {getButtonText()}
    </Button>
  )
}
