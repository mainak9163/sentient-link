import { Button } from "@/components/ui/button"

interface SubmitButtonProps {
  isLoading: boolean
}

export function SubmitButton({ isLoading }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isLoading}>
      {isLoading ? "Creating…" : "Create short link"}
    </Button>
  )
}