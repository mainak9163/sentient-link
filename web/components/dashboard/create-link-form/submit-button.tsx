import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  isLoading: boolean
  useCustomAlias: boolean
}

export function SubmitButton({ isLoading, useCustomAlias }: SubmitButtonProps) {
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
    <Button type="submit" disabled={isLoading} className="w-full">
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {getButtonText()}
    </Button>
  )
}