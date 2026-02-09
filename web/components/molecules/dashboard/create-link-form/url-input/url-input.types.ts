import { ComponentProps } from "react"

export type UrlInputProps = ComponentProps<"div"> & {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}
