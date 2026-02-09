import { ComponentProps } from "react"
import type { AliasSource } from "../types"

export type ResultPreviewProps = ComponentProps<"div"> & {
  shortUrl: string
  aliasSource: AliasSource
}
