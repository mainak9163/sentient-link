"use client"

import { FC } from "react"
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DeleteLinkDialogProps } from "./delete-link-dialog.types"

export const DeleteLinkDialog: FC<DeleteLinkDialogProps> = ({
  open,
  isDeleting,
  onConfirm,
  onOpenChange,
  ...props
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this link? This action cannot be
            undone and the short URL will no longer work.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
