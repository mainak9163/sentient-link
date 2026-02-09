import { ComponentProps } from "react"
import { Button } from "@/components/ui/button"

export type SubmitButtonProps = ComponentProps<typeof Button> & {
  isLoading: boolean
  useCustomAlias: boolean
}
