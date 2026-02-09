import { ComponentProps } from "react"

export type ModeToggleProps = ComponentProps<"div"> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}
