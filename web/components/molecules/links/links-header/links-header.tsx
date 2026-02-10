"use client"

import { FC } from "react"
import { Button } from "@/components/ui/button"
import { LinksHeaderProps } from "./links-header.types"
import { BoxLayout } from "@/components/atoms/box-layout/box-layout"

export const LinksHeader: FC<LinksHeaderProps> = ({
  count,
  className,
  ...props
}) => {
  return (
    <BoxLayout className={`flex items-center justify-between ${className ?? ""}`} {...props}>
      <div>
        <h1 className="text-3xl font-bold">Your Links</h1>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "link" : "links"} created
        </p>
      </div>

      <Button onClick={() => (window.location.href = "/dashboard")}>
        Create New Link
      </Button>
    </BoxLayout>
  )
}
