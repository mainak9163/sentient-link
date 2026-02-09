"use client"

import { FC } from "react"
import { Loader2 } from "lucide-react"
import { LinksLoadingProps } from "./links-loading.types"

export const LinksLoading: FC<LinksLoadingProps> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={`flex min-h-100 items-center justify-center ${className ?? ""}`}
      {...props}
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
