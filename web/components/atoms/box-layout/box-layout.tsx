import { FC } from "react"
import clsx from "clsx"
import type { BoxLayoutProps } from "./box-layout.types"

export const BoxLayout: FC<BoxLayoutProps> = ({
  children,
  asGrid = false,
  wFull = false,
  hFull = false,
  centered = false,
  column = false,
  flex = false,
  className,
  ...props
}) => {
  const classNameValue = className ?? ""
  const usesGrid = asGrid || classNameValue.includes("grid")
  const usesFlex =
    !usesGrid && (classNameValue.includes("flex") || column || centered || flex)

  const classes = clsx(
    usesGrid && "grid",
    usesFlex && "flex",
    usesFlex && column && "flex-col",
    centered && (usesGrid ? "place-items-center" : "items-center justify-center"),
    wFull && "w-full",
    hFull && "h-full",
    flex && "flex-1",
    className
  )

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
