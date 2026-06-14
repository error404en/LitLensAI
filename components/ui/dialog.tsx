"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

export interface DialogProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, "title"> {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: React.ReactNode
}

const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  ({ className, isOpen, onClose, title, description, children, ...props }, ref) => {
    const dialogRef = React.useRef<HTMLDialogElement>(null)

    React.useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement)

    React.useEffect(() => {
      const dialog = dialogRef.current
      if (!dialog) return

      if (isOpen && !dialog.open) {
        dialog.showModal()
      } else if (!isOpen && dialog.open) {
        dialog.close()
      }
    }, [isOpen])

    const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose()
      }
    }

    return (
      <dialog
        ref={dialogRef}
        onClose={onClose}
        onClick={handleBackdropClick}
        className={cn(
          "backdrop:bg-black/50 open:animate-in open:fade-in-90 open:zoom-in-95 m-auto rounded-lg border bg-background p-0 shadow-lg sm:max-w-[425px]",
          className
        )}
        {...props}
      >
        <div className="flex flex-col space-y-1.5 p-6 text-center sm:text-left">
          {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <div className="p-6 pt-0">{children}</div>
      </dialog>
    )
  }
)
Dialog.displayName = "Dialog"

export { Dialog }
