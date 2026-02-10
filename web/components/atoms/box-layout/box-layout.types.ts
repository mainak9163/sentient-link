import { ComponentProps } from "react"

export type BoxLayoutProps = ComponentProps<"div"> & {
  asGrid?: boolean
  wFull?: boolean
  hFull?: boolean
  centered?: boolean
  column?: boolean
  flex?: boolean
}
