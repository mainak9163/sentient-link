import { ComponentProps } from "react"

export type IntentInputProps = ComponentProps<"div"> & {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}
