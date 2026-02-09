import { ComponentProps } from "react"
import { AlertDialog } from "@/components/ui/alert-dialog"

export type DeleteLinkDialogProps = ComponentProps<typeof AlertDialog> & {
  isDeleting: boolean
  onConfirm: () => void
}
