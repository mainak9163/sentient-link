import { ComponentProps } from "react"
import type { Link } from "../types"

export type LinksStatsProps = ComponentProps<"div"> & {
  links: Link[]
}
