import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog } from "../ui/dialog"
import { Button } from "../ui/button"

const RenameProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
})

type RenameProjectFormValues = z.infer<typeof RenameProjectSchema>

interface RenameProjectDialogProps {
  isOpen: boolean
  onClose: () => void
  onRename: (newName: string) => Promise<void>
  currentName: string
}

export function RenameProjectDialog({ isOpen, onClose, onRename, currentName }: RenameProjectDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
  } = useForm<RenameProjectFormValues>({
    resolver: zodResolver(RenameProjectSchema),
    defaultValues: { title: currentName },
  })

  React.useEffect(() => {
    if (isOpen) {
      reset({ title: currentName })
    }
  }, [isOpen, currentName, reset])

  const onFormSubmit = async (data: RenameProjectFormValues) => {
    if (!data.title.trim() || data.title === currentName) return
    try {
      await onRename(data.title.trim())
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Rename Project" description="Enter a new name for your project.">
      <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
        <div className="space-y-2">
          <input
            autoFocus
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Project name"
            maxLength={100}
            {...register("title")}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting || !isDirty || !isValid}>
            {isSubmitting ? "Renaming..." : "Rename"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
