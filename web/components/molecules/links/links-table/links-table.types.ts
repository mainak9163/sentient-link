import { ComponentProps } from "react"
import type { Link } from "../types"

export type LinksTableProps = ComponentProps<"div"> & {
  links: Link[]
  buildShortUrl: (code: string) => string
  onCopy: (code: string) => void
  onOpen: (code: string) => void
  onDelete: (id: string) => void
}
