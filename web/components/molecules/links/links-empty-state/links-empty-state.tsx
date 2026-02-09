"use client"

import { FC } from "react"
import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LinksEmptyStateProps } from "./links-empty-state.types"

export const LinksEmptyState: FC<LinksEmptyStateProps> = ({
  className,
  ...props
}) => {
  return (
    <div className={`space-y-6 sm:min-w-lg ${className ?? ""}`} {...props}>
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No links yet</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Create your first short link to get started
        </p>
        <Button onClick={() => (window.location.href = "/dashboard")}>
          Create Link
        </Button>
      </Card>
    </div>
  )
}
