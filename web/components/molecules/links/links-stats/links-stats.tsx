"use client"

import { FC } from "react"
import { BarChart3, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LinksStatsProps } from "./links-stats.types"

export const LinksStats: FC<LinksStatsProps> = ({
  links,
  className,
  ...props
}) => {
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const averageClicks = links.length > 0 ? Math.round(totalClicks / links.length) : 0

  return (
    <div className={`grid gap-4 md:grid-cols-3 ${className ?? ""}`} {...props}>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Links</p>
            <p className="text-2xl font-bold">{links.length}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
            <p className="text-2xl font-bold">{totalClicks}</p>
          </div>
          <ExternalLink className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Avg. Clicks</p>
            <p className="text-2xl font-bold">{averageClicks}</p>
          </div>
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
      </Card>
    </div>
  )
}
